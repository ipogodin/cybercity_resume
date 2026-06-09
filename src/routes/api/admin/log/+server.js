import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, url }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10), 500);

	try {
		const parse = (raw) => (Array.isArray(raw) ? raw : [])
			.map(item => { try { return JSON.parse(String(item)); } catch { return null; } })
			.filter(Boolean)
			.map(e => ({ ...e, q: e.q ?? e.request, a: e.a ?? e.response }));

		// 1. New list key (chat:log) — newest first
		const listRaw = await redis.lrange('chat:log', 0, limit - 1);
		const listEntries = parse(listRaw);

		// 2. Old sorted sets: scan for log:ip:* keys (on-demand admin only, acceptable)
		let cursor = 0;
		const ipKeys = [];
		do {
			const result = await redis.scan(cursor, { match: 'log:ip:*', count: 100 });
			cursor = result[0];
			ipKeys.push(...result[1]);
		} while (cursor !== 0);

		let oldEntries = [];
		if (ipKeys.length > 0) {
			const pipeline = redis.pipeline();
			for (const key of ipKeys) pipeline.zrange(key, 0, 99, { rev: true });
			const results = await pipeline.exec();
			for (const raw of results) {
				oldEntries.push(...parse(raw));
			}
		}

		// Merge, deduplicate by ts+ip, sort newest first
		const seen = new Set();
		const all = [...listEntries, ...oldEntries]
			.filter(e => {
				if (!e?.ts) return false;
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
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch log' }), {
			status: 500, headers: { 'Content-Type': 'application/json' }
		});
	}
}
