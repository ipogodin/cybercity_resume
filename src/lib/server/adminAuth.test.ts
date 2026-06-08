import { describe, it, expect, vi } from 'vitest';

// Mutable env object so individual tests can override it
const mockEnv = { ADMIN_TOKEN: 'test-secret-token' };

vi.mock('$env/dynamic/private', () => ({ env: mockEnv }));

describe('verifyAdminToken', () => {
	it('returns true for valid Bearer token', async () => {
		mockEnv.ADMIN_TOKEN = 'test-secret-token';
		const { verifyAdminToken } = await import('./adminAuth.js');
		expect(verifyAdminToken('Bearer test-secret-token')).toBe(true);
	});

	it('returns false for wrong token', async () => {
		mockEnv.ADMIN_TOKEN = 'test-secret-token';
		const { verifyAdminToken } = await import('./adminAuth.js');
		expect(verifyAdminToken('Bearer wrong-token')).toBe(false);
	});

	it('returns false for null header', async () => {
		mockEnv.ADMIN_TOKEN = 'test-secret-token';
		const { verifyAdminToken } = await import('./adminAuth.js');
		expect(verifyAdminToken(null)).toBe(false);
	});

	it('returns false for token with extra characters', async () => {
		mockEnv.ADMIN_TOKEN = 'test-secret-token';
		const { verifyAdminToken } = await import('./adminAuth.js');
		expect(verifyAdminToken('Bearer test-secret-tokenEXTRA')).toBe(false);
	});

	it('returns false when ADMIN_TOKEN env var is missing', async () => {
		mockEnv.ADMIN_TOKEN = '';
		const { verifyAdminToken } = await import('./adminAuth.js');
		expect(verifyAdminToken('Bearer anything')).toBe(false);
		mockEnv.ADMIN_TOKEN = 'test-secret-token'; // restore
	});
});
