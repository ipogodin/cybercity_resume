import { describe, it, expect, vi } from 'vitest';

const mockContext = { value: '## Experience\nWorked at Meta and Google.' };

vi.mock('./knowledge/index.js', () => ({
	buildResumeContext: vi.fn(() => mockContext.value)
}));

describe('buildSystemPrompt', () => {
	it('ask mode includes EXPERIENCE CONTEXT, no JOB DESCRIPTION section', async () => {
		const { buildSystemPrompt } = await import('./prompt.js');
		const result = buildSystemPrompt('ask');
		expect(result).toContain('EXPERIENCE CONTEXT');
		expect(result).not.toContain('JOB DESCRIPTION');
	});

	it('fit mode includes both EXPERIENCE CONTEXT and JOB DESCRIPTION', async () => {
		const { buildSystemPrompt } = await import('./prompt.js');
		const result = buildSystemPrompt('fit', 'We need a senior backend engineer.');
		expect(result).toContain('EXPERIENCE CONTEXT');
		expect(result).toContain('JOB DESCRIPTION');
	});

	it('strips HTML tags from job description', async () => {
		const { buildSystemPrompt } = await import('./prompt.js');
		const result = buildSystemPrompt('fit', '<b>Senior Engineer</b> needed');
		expect(result).toContain('Senior Engineer');
		expect(result).not.toContain('<b>');
		expect(result).not.toContain('</b>');
	});

	it('truncates JD over 8000 chars', async () => {
		const { buildSystemPrompt } = await import('./prompt.js');
		const longJD = 'x'.repeat(10_000);
		const result = buildSystemPrompt('fit', longJD);
		const jdIndex = result.indexOf('JOB DESCRIPTION');
		const jdContent = result.slice(jdIndex);
		expect(jdContent.length).toBeLessThan(9_000);
	});

	it('includes placeholder notice when knowledge base is empty', async () => {
		mockContext.value = '';
		const { buildSystemPrompt } = await import('./prompt.js');
		const result = buildSystemPrompt('ask');
		expect(result).toContain('unavailable');
		mockContext.value = '## Experience\nWorked at Meta and Google.'; // restore
	});
});

describe('sanitiseJobDescription', () => {
	it('strips HTML tags', async () => {
		const { sanitiseJobDescription } = await import('./prompt.js');
		expect(sanitiseJobDescription('<p>Hello <b>world</b></p>')).toBe('Hello world');
	});

	it('preserves paragraph structure via newlines', async () => {
		const { sanitiseJobDescription } = await import('./prompt.js');
		const result = sanitiseJobDescription('Line one\n\nLine two');
		expect(result).toContain('Line one');
		expect(result).toContain('Line two');
	});

	it('does not truncate exactly 8000 chars', async () => {
		const { sanitiseJobDescription } = await import('./prompt.js');
		const text = 'a'.repeat(8_000);
		expect(sanitiseJobDescription(text).length).toBe(8_000);
	});

	it('truncates to 8000 chars when input is 8001+', async () => {
		const { sanitiseJobDescription } = await import('./prompt.js');
		const text = 'a'.repeat(8_001);
		expect(sanitiseJobDescription(text).length).toBe(8_000);
	});
});
