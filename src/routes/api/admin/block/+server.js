import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const { ip, reason = 'manual', ttlSeconds } = await request.json();
		if (!ip || typeof ip !== 'string') {
			return new Response(JSON.stringify({ error: 'ip required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const key = `blocked:ip:${ip}`;
		if (ttlSeconds && typeof ttlSeconds === 'number') {
			await redis.set(key, reason, { ex: ttlSeconds });
		} else {
			await redis.set(key, reason);
		}

		return new Response(JSON.stringify({ ok: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to block IP' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
