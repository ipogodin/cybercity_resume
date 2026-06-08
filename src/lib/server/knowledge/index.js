import experienceMd from './experience.md?raw';
import skillsMd from './skills.md?raw';
import educationMd from './education.md?raw';

const MAX_CONTEXT_CHARS = 30_000;

const REQUIRED_SECTIONS = [
	{ name: 'experience', content: experienceMd },
	{ name: 'skills',     content: skillsMd },
	{ name: 'education',  content: educationMd }
];

export function buildResumeContext() {
	const parts = [];

	for (const { name, content } of REQUIRED_SECTIONS) {
		if (!content || !content.trim()) {
			console.warn(`[knowledge] Section missing or empty: ${name}`);
			parts.push(`[${name} context unavailable]`);
		} else {
			parts.push(content.trim());
		}
	}

	const joined = parts.join('\n\n---\n\n');

	if (joined.length > MAX_CONTEXT_CHARS) {
		return joined.slice(0, MAX_CONTEXT_CHARS) + '[context truncated]';
	}

	return joined;
}
