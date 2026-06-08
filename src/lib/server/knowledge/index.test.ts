import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync } from 'fs';

vi.mock('fs');
vi.mock('url', () => ({
	fileURLToPath: () => '/fake/path/index.js'
}));
vi.mock('path', async () => {
	const actual = await vi.importActual<typeof import('path')>('path');
	return { ...actual };
});

describe('buildResumeContext', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns string with all section headings when all files present', async () => {
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readFileSync).mockImplementation((p: unknown) => {
			const path = String(p);
			if (path.includes('experience.md')) return '## Experience\nContent';
			if (path.includes('skills.md')) return '## Skills\nContent';
			if (path.includes('education.md')) return '## Education\nContent';
			return 'Other content';
		});
		const { buildResumeContext } = await import('./index.js');
		const result = buildResumeContext();
		expect(result).toContain('## Experience');
		expect(result).toContain('## Skills');
		expect(result).toContain('## Education');
	});

	it('does not throw and omits section when optional philosophy.md is missing', async () => {
		vi.mocked(existsSync).mockImplementation((p: unknown) => {
			return !String(p).includes('philosophy.md');
		});
		vi.mocked(readFileSync).mockReturnValue('## Section\nContent');
		const { buildResumeContext } = await import('./index.js');
		expect(() => buildResumeContext()).not.toThrow();
		const result = buildResumeContext();
		expect(result).not.toContain('philosophy');
	});

	it('does not throw and includes warning when required experience.md is missing', async () => {
		vi.mocked(existsSync).mockImplementation((p: unknown) => !String(p).includes('experience.md'));
		vi.mocked(readFileSync).mockReturnValue('## Section\nContent');
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { buildResumeContext } = await import('./index.js');
		expect(() => buildResumeContext()).not.toThrow();
		const result = buildResumeContext();
		expect(result).toContain('not found');
	});

	it('truncates output over 30 000 chars with notice', async () => {
		vi.mocked(existsSync).mockReturnValue(true);
		const longContent = 'x'.repeat(15_000);
		vi.mocked(readFileSync).mockReturnValue(longContent);
		const { buildResumeContext } = await import('./index.js');
		const result = buildResumeContext();
		expect(result.length).toBeLessThanOrEqual(30_000 + '[context truncated]'.length);
		expect(result).toContain('[context truncated]');
	});
});
