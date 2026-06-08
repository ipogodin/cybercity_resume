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
			const result = await redis.scan(cursor, { match: 'log:ip:*', count: 100 });
			cursor = result[0];
			allKeys.push(...result[1]);
		} while (cursor !== 0);

		// Fetch entries from each key
		const allEntries = [];
		for (const key of allKeys) {
			const raw = await redis.zrange(key, 0, -1, { rev: true });
			for (const item of raw) {
				try { allEntries.push(JSON.parse(item)); }
				catch { /* skip malformed */ }
			}
		}

		// Sort newest first and limit
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
