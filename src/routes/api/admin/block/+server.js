import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';
import { addBlockedIp } from '$lib/server/guard.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const { ip, reason = 'manual', ttlSeconds } = await request.json();
		if (!ip || typeof ip !== 'string') {
			return new Response(JSON.stringify({ error: 'ip required' }), {
				status: 400, headers: { 'Content-Type': 'application/json' }
			});
		}

		const pipeline = redis.pipeline();
		// Individual key (guard fallback / TTL support)
		if (ttlSeconds && typeof ttlSeconds === 'number') {
			pipeline.set(`blocked:ip:${ip}`, reason, { ex: ttlSeconds });
		} else {
			pipeline.set(`blocked:ip:${ip}`, reason);
		}
		// Hash for O(1) admin listing — no SCAN needed
		pipeline.hset('blocked:ips', { [ip]: reason });
		await pipeline.exec();

		addBlockedIp(ip);

		return new Response(JSON.stringify({ ok: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to block IP' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
