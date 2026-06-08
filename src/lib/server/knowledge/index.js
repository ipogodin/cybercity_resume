import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MAX_CONTEXT_CHARS = 30_000;
const REQUIRED_FILES = ['experience.md', 'skills.md', 'education.md'];
const OPTIONAL_FILES = ['philosophy.md'];

/** @param {string} filename */
function readSection(filename) {
	const filepath = join(__dirname, filename);
	if (!existsSync(filepath)) {
		if (REQUIRED_FILES.includes(filename)) {
			console.warn(`[knowledge] Required file missing: ${filename}`);
			return `[${filename} not found — context unavailable for this section]`;
		}
		return null;
	}
	return readFileSync(filepath, 'utf-8');
}

export function buildResumeContext() {
	const sections = [];

	for (const file of REQUIRED_FILES) {
		sections.push(readSection(file));
	}

	for (const file of OPTIONAL_FILES) {
		const content = readSection(file);
		if (content !== null) sections.push(content);
	}

	const joined = sections.join('\n\n---\n\n');

	if (joined.length > MAX_CONTEXT_CHARS) {
		return joined.slice(0, MAX_CONTEXT_CHARS) + '[context truncated]';
	}

	return joined;
}
