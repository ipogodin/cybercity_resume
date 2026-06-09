import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		// 1 command — no SCAN
		const hash = await redis.hgetall('blocked:ips');
		const blocked = hash
			? Object.entries(hash).map(([ip, reason]) => ({ ip, reason: String(reason), ttl: null }))
			: [];

		return new Response(JSON.stringify(blocked), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch blocked IPs' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
