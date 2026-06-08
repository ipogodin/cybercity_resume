import { timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

/** @param {string | null} authHeader */
export function verifyAdminToken(authHeader) {
	if (!authHeader || !env.ADMIN_TOKEN) return false;

	const provided = Buffer.from(authHeader);
	const expected = Buffer.from(`Bearer ${env.ADMIN_TOKEN}`);

	if (provided.length !== expected.length) return false;

	return timingSafeEqual(provided, expected);
}

/** @param {Request} request */
export function requireAdmin(request) {
	const authHeader = request.headers.get('authorization');
	if (!verifyAdminToken(authHeader)) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	return null;
}
