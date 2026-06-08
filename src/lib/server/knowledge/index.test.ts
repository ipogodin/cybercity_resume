import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./experience.md?raw', () => ({ default: '## Experience\nWorked at Meta and Google.' }));
vi.mock('./skills.md?raw',    () => ({ default: '## Skills\nJava, Python, Distributed Systems.' }));
vi.mock('./education.md?raw', () => ({ default: '## Education\nM.S. Applied Mathematics.' }));

describe('buildResumeContext', () => {
	beforeEach(() => { vi.resetModules(); });

	it('returns string with all section headings when all files present', async () => {
		const { buildResumeContext } = await import('./index.js');
		const result = buildResumeContext();
		expect(result).toContain('## Experience');
		expect(result).toContain('## Skills');
		expect(result).toContain('## Education');
	});

	it('joins sections with --- separator', async () => {
		const { buildResumeContext } = await import('./index.js');
		const result = buildResumeContext();
		expect(result).toContain('---');
	});

	it('does not throw when content is present', async () => {
		const { buildResumeContext } = await import('./index.js');
		expect(() => buildResumeContext()).not.toThrow();
	});

	it('truncates output over 30 000 chars with notice', async () => {
		vi.doMock('./experience.md?raw', () => ({ default: 'x'.repeat(15_000) }));
		vi.doMock('./skills.md?raw',    () => ({ default: 'y'.repeat(15_000) }));
		vi.doMock('./education.md?raw', () => ({ default: 'z'.repeat(5_000) }));
		vi.resetModules();
		const { buildResumeContext } = await import('./index.js');
		const result = buildResumeContext();
		expect(result).toContain('[context truncated]');
		expect(result.length).toBeLessThanOrEqual(30_000 + '[context truncated]'.length);
	});
});
