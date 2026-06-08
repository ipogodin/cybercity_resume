import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, params, url }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);
	const ip = params.ip;

	try {
		const raw = await redis.zrange(`log:ip:${ip}`, 0, limit - 1, { rev: true });
		const entries = raw.map((item) => {
			try { return JSON.parse(item); }
			catch { return null; }
		}).filter(Boolean);

		return new Response(JSON.stringify(entries), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch log for IP' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
