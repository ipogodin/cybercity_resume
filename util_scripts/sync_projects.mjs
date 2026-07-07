#!/usr/bin/env node
/**
 * sync_projects.mjs — refresh Alex's side-project knowledge draft.
 *
 * Pulls curated repos (allowlist in projects.config.json) from GitHub and/or
 * scans a local dev folder, then writes a DRAFT markdown file:
 *
 *   src/lib/server/knowledge/projects.generated.md
 *
 * The draft is NOT used by Alex directly. Review it, merge the relevant
 * updates into projects.md (the curated file Alex actually reads), commit.
 *
 * Usage:
 *   node util_scripts/sync_projects.mjs                 # GitHub allowlist
 *   node util_scripts/sync_projects.mjs --local ~/dev   # also scan local git repos
 *   GITHUB_TOKEN=ghp_xxx node util_scripts/sync_projects.mjs   # higher rate limits
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, 'projects.config.json');
const OUT_PATH = join(__dirname, '..', 'src', 'lib', 'server', 'knowledge', 'projects.generated.md');
const README_EXCERPT_CHARS = 1200;

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

const ghHeaders = {
	Accept: 'application/vnd.github+json',
	'User-Agent': 'sync-projects-script',
	...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
};

async function gh(path) {
	const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders });
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`GitHub ${path} → ${res.status} ${await res.text()}`);
	return res.json();
}

async function fetchRepo(user, name) {
	const repo = await gh(`/repos/${user}/${name}`);
	if (!repo) return { name, missing: true };

	const [languages, readme] = await Promise.all([
		gh(`/repos/${user}/${name}/languages`).catch(() => ({})),
		gh(`/repos/${user}/${name}/readme`).catch(() => null)
	]);

	let readmeExcerpt = '';
	if (readme?.content) {
		readmeExcerpt = Buffer.from(readme.content, 'base64')
			.toString('utf8')
			.replace(/\r/g, '')
			.trim()
			.slice(0, README_EXCERPT_CHARS);
	}

	return {
		name: repo.name,
		description: repo.description || '',
		url: repo.html_url,
		homepage: repo.homepage || '',
		topics: repo.topics || [],
		languages: Object.keys(languages || {}),
		pushedAt: repo.pushed_at,
		createdAt: repo.created_at,
		stars: repo.stargazers_count,
		archived: repo.archived,
		readmeExcerpt
	};
}

function scanLocal(root) {
	const rootPath = resolve(root.replace(/^~(?=$|\/)/, homedir()));
	if (!existsSync(rootPath)) {
		console.warn(`[local] path not found: ${rootPath}`);
		return [];
	}
	const results = [];
	for (const entry of readdirSync(rootPath)) {
		const dir = join(rootPath, entry);
		try {
			if (!statSync(dir).isDirectory() || !existsSync(join(dir, '.git'))) continue;
			const git = (args) =>
				execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();
			const lastCommitISO = git(['log', '-1', '--format=%cI']);
			const recentLog = git(['log', '-15', '--since=90 days ago', '--format=- %s']);
			let readmeExcerpt = '';
			for (const f of ['README.md', 'readme.md', 'README.txt']) {
				if (existsSync(join(dir, f))) {
					readmeExcerpt = readFileSync(join(dir, f), 'utf8').trim().slice(0, README_EXCERPT_CHARS);
					break;
				}
			}
			results.push({ name: entry, dir, lastCommitISO, recentLog, readmeExcerpt });
		} catch {
			/* not a usable repo — skip */
		}
	}
	return results.sort((a, b) => b.lastCommitISO.localeCompare(a.lastCommitISO));
}

function repoSection(r) {
	if (r.missing) return `### ${r.name}\n\n> ⚠️ Not found on GitHub (private, renamed, or deleted?). Remove from allowlist or fix.\n`;
	const lines = [
		`### ${r.name}${r.archived ? ' (archived)' : ''}`,
		'',
		`- **URL:** ${r.url}${r.homepage ? ` | **Live:** ${r.homepage}` : ''}`,
		`- **Description:** ${r.description || '(none on GitHub — consider adding one)'}`,
		`- **Languages:** ${r.languages.join(', ') || 'n/a'}${r.topics.length ? ` | **Topics:** ${r.topics.join(', ')}` : ''}`,
		`- **Last push:** ${r.pushedAt?.slice(0, 10)} | **Created:** ${r.createdAt?.slice(0, 10)}${r.stars ? ` | ⭐ ${r.stars}` : ''}`
	];
	if (config.notes?.[r.name]) lines.push(`- **Curator note:** ${config.notes[r.name]}`);
	if (r.readmeExcerpt) lines.push('', '<details><summary>README excerpt</summary>', '', '```', r.readmeExcerpt, '```', '', '</details>');
	return lines.join('\n') + '\n';
}

function localSection(r) {
	const lines = [
		`### ${r.name} (local: ${r.dir})`,
		'',
		`- **Last commit:** ${r.lastCommitISO.slice(0, 10)}`
	];
	if (r.recentLog) lines.push('- **Recent commits (90d):**', r.recentLog);
	if (r.readmeExcerpt) lines.push('', '<details><summary>README excerpt</summary>', '', '```', r.readmeExcerpt, '```', '', '</details>');
	return lines.join('\n') + '\n';
}

const localFlagIdx = process.argv.indexOf('--local');
const localRoot = localFlagIdx !== -1 ? process.argv[localFlagIdx + 1] || '~/dev' : null;

console.log(`Fetching ${config.allowlist.length} repos for ${config.githubUser}...`);
const repos = [];
for (const name of config.allowlist) {
	process.stdout.write(`  ${name}... `);
	try {
		repos.push(await fetchRepo(config.githubUser, name));
		console.log('ok');
	} catch (e) {
		console.log(`FAILED: ${e.message}`);
		repos.push({ name, missing: true });
	}
}

let localRepos = [];
if (localRoot) {
	console.log(`Scanning local repos under ${localRoot}...`);
	localRepos = scanLocal(localRoot);
	console.log(`  found ${localRepos.length} git repos`);
}

const out = [
	'<!-- GENERATED DRAFT — do not import. Curate into projects.md, then delete or regenerate. -->',
	`<!-- Generated ${new Date().toISOString()} by util_scripts/sync_projects.mjs -->`,
	'',
	'# Side Projects — sync draft',
	'',
	'Review each entry below. Merge anything new/changed into `projects.md` in your own words,',
	'keeping the calibration rules (honest scale, backend-first framing).',
	'',
	'## GitHub (curated allowlist)',
	'',
	...repos.map(repoSection),
	...(localRepos.length
		? ['## Local repos (recent activity first)', '', ...localRepos.map(localSection)]
		: [])
].join('\n');

writeFileSync(OUT_PATH, out);
console.log(`\nWrote ${OUT_PATH}`);
console.log('Next: review the draft and merge updates into src/lib/server/knowledge/projects.md');
