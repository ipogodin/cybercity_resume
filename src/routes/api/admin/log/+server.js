import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, url }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);

	try {
		// 1 read — LRANGE on the capped list, newest first
		const raw = await redis.lrange('log:all', 0, limit - 1);
		const entries = raw
			.map(item => { try { return JSON.parse(String(item)); } catch { return null; } })
			.filter(Boolean);

		return new Response(JSON.stringify(entries), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch log' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
