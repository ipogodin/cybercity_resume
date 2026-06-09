import { requireAdmin } from '$lib/server/adminAuth.js';
import { syncBlockListFromRedis } from '$lib/server/guard.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	const denied = requireAdmin(request);
	if (denied) return denied;

	try {
		const count = await syncBlockListFromRedis();
		return new Response(JSON.stringify({ ok: true, blockedCount: count }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Sync failed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
