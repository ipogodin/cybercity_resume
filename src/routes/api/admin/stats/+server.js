import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const today = new Date().toISOString().slice(0, 10);

		// 3 commands total — no SCAN
		const pipeline = redis.pipeline();
		pipeline.get(`daily:requests:${today}`);
		pipeline.hlen('blocked:ips');
		pipeline.llen('events:abuse');
		const [requestsToday, blockedCount, abuseEventsCount] = await pipeline.exec();

		return new Response(JSON.stringify({
			requestsToday: parseInt(String(requestsToday ?? '0'), 10),
			blockedCount: Number(blockedCount ?? 0),
			abuseEventsLast24h: Number(abuseEventsCount ?? 0)
		}), { headers: { 'Content-Type': 'application/json' } });
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
