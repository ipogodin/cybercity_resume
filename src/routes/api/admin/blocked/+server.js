import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		let cursor = 0;
		const blocked = [];
		do {
			const result = await redis.scan(cursor, { match: 'blocked:ip:*', count: 100 });
			cursor = result[0];
			for (const key of result[1]) {
				const ip = key.replace('blocked:ip:', '');
				const reason = (await redis.get(key)) ?? 'manual';
				const ttl = await redis.ttl(key);
				blocked.push({ ip, reason, ttl: ttl > 0 ? ttl : null });
			}
		} while (cursor !== 0);

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
