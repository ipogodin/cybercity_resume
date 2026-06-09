import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, url }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);

	try {
		// Scan for all log keys
		let cursor = 0;
		const allKeys = [];
		do {
			const result = await redis.scan(cursor, { match: 'log:ip:*', count: 200 });
			cursor = result[0];
			allKeys.push(...result[1]);
		} while (cursor !== 0);

		if (allKeys.length === 0) {
			return new Response(JSON.stringify([]), {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Read only `limit` newest entries per key using ZRANGE with proper Redis-level limit
		// This avoids reading the entire sorted set into memory
		const pipeline = redis.pipeline();
		for (const key of allKeys) {
			pipeline.zrange(key, 0, limit - 1, { rev: true });
		}
		const results = await pipeline.exec();

		const allEntries = [];
		for (const raw of results) {
			if (!Array.isArray(raw)) continue;
			for (const item of raw) {
				try { allEntries.push(JSON.parse(String(item))); }
				catch { /* skip malformed */ }
			}
		}

		allEntries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

		return new Response(JSON.stringify(allEntries.slice(0, limit)), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch log' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
