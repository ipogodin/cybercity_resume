import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const raw = await redis.lrange('leads:all', 0, 199);
		const leads = raw
			.map(item => { try { return JSON.parse(String(item)); } catch { return null; } })
			.filter(Boolean);
		return new Response(JSON.stringify(leads), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch leads' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
