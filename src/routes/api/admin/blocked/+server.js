import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		let cursor = 0;
		const keys = [];
		do {
			const result = await redis.scan(cursor, { match: 'blocked:ip:*', count: 200 });
			cursor = result[0];
			keys.push(...result[1]);
		} while (cursor !== 0);

		if (keys.length === 0) {
			return new Response(JSON.stringify([]), {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Batch-read reason + TTL in one pipeline — 2 reads per key → 1 pipeline round-trip
		const pipeline = redis.pipeline();
		for (const key of keys) {
			pipeline.get(key);
			pipeline.ttl(key);
		}
		const values = await pipeline.exec();

		const blocked = keys.map((key, i) => ({
			ip: key.replace('blocked:ip:', ''),
			reason: String(values[i * 2] ?? 'manual'),
			ttl: Number(values[i * 2 + 1]) > 0 ? Number(values[i * 2 + 1]) : null
		}));

		return new Response(JSON.stringify(blocked), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch blocked IPs' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
