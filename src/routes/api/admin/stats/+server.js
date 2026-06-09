import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		// 2 commands total
		const pipeline = redis.pipeline();
		pipeline.hlen('blocked:ips');
		pipeline.llen('events:abuse');
		const [blockedCount, abuseCount] = await pipeline.exec();

		return new Response(JSON.stringify({
			blockedCount: Number(blockedCount ?? 0),
			abuseEvents: Number(abuseCount ?? 0)
		}), { headers: { 'Content-Type': 'application/json' } });
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
