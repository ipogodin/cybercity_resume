import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, url }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);

	try {
		// Read from both sources and merge:
		// - chat:log  → new list (LPUSH, newest first)
		// - log:all   → old sorted set (ZADD, score=timestamp)
		const pipeline = redis.pipeline();
		pipeline.lrange('chat:log', 0, limit - 1);
		pipeline.zrange('log:all', 0, limit - 1, { rev: true });
		const [listRaw, zsetRaw] = await pipeline.exec();

		const parse = (raw) => (Array.isArray(raw) ? raw : [])
			.map(item => { try { return JSON.parse(String(item)); } catch { return null; } })
			.filter(Boolean);

		const listEntries = parse(listRaw);
		const zsetEntries = parse(zsetRaw).map(e => ({
			...e,
			q: e.q ?? e.request,    // normalise old field names
			a: e.a ?? e.response
		}));

		// Merge and sort newest first, deduplicate by ts+ip
		const seen = new Set();
		const all = [...listEntries, ...zsetEntries]
			.filter(e => {
				const key = `${e.ts}${e.ip}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			})
			.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
			.slice(0, limit);

		return new Response(JSON.stringify(all), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to fetch log' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
