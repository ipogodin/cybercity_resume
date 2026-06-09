import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @param {unknown} item */
function parseEntry(item) {
	try {
		// Pipeline returns already-parsed objects; LRANGE returns strings
		const e = typeof item === 'string' ? JSON.parse(item) : item;
		if (!e || typeof e !== 'object') return null;
		return { ...e, q: e.q ?? e.request, a: e.a ?? e.response };
	} catch {
		return null;
	}
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, url }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10), 500);

	try {
		const entries = [];

		// 1. New list (chat:log) — 1 read
		const listRaw = await redis.lrange('chat:log', 0, limit - 1);
		for (const item of listRaw) {
			const e = parseEntry(item);
			if (e) entries.push(e);
		}

		// 2. Old sorted sets — scan + pipeline (all in 2 round trips)
		let cursor = 0;
		let iterations = 0;
		const ipKeys = [];
		do {
			const [nextCursor, keys] = await redis.scan(cursor, { match: 'log:ip:*', count: 200 });
			cursor = Number(nextCursor);
			ipKeys.push(...keys);
			iterations++;
		} while (cursor !== 0 && iterations < 20);

		if (ipKeys.length > 0) {
			const pipeline = redis.pipeline();
			for (const key of ipKeys) pipeline.zrange(key, 0, 49, { rev: true });
			const results = await pipeline.exec();
			for (const batch of results) {
				if (!Array.isArray(batch)) continue;
				for (const item of batch) {
					const e = parseEntry(item);
					if (e) entries.push(e);
				}
			}
		}

		// Sort newest first, deduplicate, limit
		const seen = new Set();
		const result = entries
			.filter(e => {
				if (!e?.ts) return false;
				const key = `${e.ts}${e.ip}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			})
			.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
			.slice(0, limit);

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
