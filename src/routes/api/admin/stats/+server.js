import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const today = new Date().toISOString().slice(0, 10);

	try {
		// Collect all rate-limit keys for today in one SCAN pass
		let cursor = 0;
		const rlKeys = [];
		do {
			const result = await redis.scan(cursor, { match: `rl:*:${today}`, count: 200 });
			cursor = result[0];
			rlKeys.push(...result[1]);
		} while (cursor !== 0);

		// Batch-read all counts in one pipeline instead of N individual GETs
		const ipCounts = new Map();
		if (rlKeys.length > 0) {
			const pipeline = redis.pipeline();
			for (const key of rlKeys) pipeline.get(key);
			const values = await pipeline.exec();
			rlKeys.forEach((key, i) => {
				const ip = key.split(':')[1];
				const count = parseInt(String(values[i] ?? '0'), 10);
				ipCounts.set(ip, (ipCounts.get(ip) ?? 0) + count);
			});
		}

		const requestsToday = [...ipCounts.values()].reduce((a, b) => a + b, 0);
		const uniqueIpsToday = ipCounts.size;

		// Count blocked IPs — just count keys, no per-key reads needed
		let blockedCursor = 0;
		let blockedCount = 0;
		do {
			const result = await redis.scan(blockedCursor, { match: 'blocked:ip:*', count: 200 });
			blockedCursor = result[0];
			blockedCount += result[1].length;
		} while (blockedCursor !== 0);

		const abuseEventsLast24h = await redis.llen('events:abuse');

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
