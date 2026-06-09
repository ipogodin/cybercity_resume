import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';
import { removeBlockedIp } from '$lib/server/guard.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const { ip } = await request.json();
		if (!ip || typeof ip !== 'string') {
			return new Response(JSON.stringify({ error: 'ip required' }), {
				status: 400, headers: { 'Content-Type': 'application/json' }
			});
		}

		const pipeline = redis.pipeline();
		pipeline.del(`blocked:ip:${ip}`);
		pipeline.hdel('blocked:ips', ip);
		await pipeline.exec();

		removeBlockedIp(ip);

		return new Response(JSON.stringify({ ok: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to unblock IP' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
