import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const today = new Date().toISOString().slice(0, 10);

	try {
		// Scan for today's rate limit keys
		let cursor = 0;
		const ipCounts = new Map();
		do {
			const result = await redis.scan(cursor, { match: `rl:*:${today}`, count: 100 });
			cursor = result[0];
			const keys = result[1];
			for (const key of keys) {
				const ip = key.split(':')[1];
				const count = parseInt(await redis.get(key) ?? '0', 10);
				ipCounts.set(ip, (ipCounts.get(ip) ?? 0) + count);
			}
		} while (cursor !== 0);

		const requestsToday = [...ipCounts.values()].reduce((a, b) => a + b, 0);
		const uniqueIpsToday = ipCounts.size;

		// Count blocked IPs
		let blockedCursor = 0;
		let blockedCount = 0;
		do {
			const result = await redis.scan(blockedCursor, { match: 'blocked:ip:*', count: 100 });
			blockedCursor = result[0];
			blockedCount += result[1].length;
		} while (blockedCursor !== 0);

		// Count recent abuse events (approximate — list length)
		const abuseEventsLast24h = await redis.llen('events:abuse');

		// Top 10 IPs
		const topIps = [...ipCounts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
			.map(([ip, count]) => ({ ip, count, lastSeen: today }));

		return new Response(
			JSON.stringify({ requestsToday, uniqueIpsToday, blockedCount, abuseEventsLast24h, topIps }),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
