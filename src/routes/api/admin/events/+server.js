import { requireAdmin } from '$lib/server/adminAuth.js';
import { redis } from '$lib/server/redis.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const raw = await redis.lrange('events:abuse', 0, 99);
		const events = raw.map((item) => {
			try { return JSON.parse(item); }
			catch { return null; }
		}).filter(Boolean);

		return new Response(JSON.stringify(events), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
