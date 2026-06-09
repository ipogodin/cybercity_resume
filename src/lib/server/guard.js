import { redis } from './redis.js';
import { env } from '$env/dynamic/private';

// IPs exempt from rate limiting
const BYPASS_IPS = new Set([
	'0.0.0.0',
	'127.0.0.1',
	'::1',
	...((env.RATE_LIMIT_BYPASS_IPS ?? '').split(',').map(s => s.trim()).filter(Boolean))
]);

const INJECTION_PATTERNS = [
	/ignore (previous|all|prior) instructions?/i,
	/you are now/i,
	/disregard (your|all|previous)/i,
	/act as (a |an )?(?!illia)/i,
	/jailbreak/i,
	/\bDAN\b/,
	/new persona/i,
	/pretend (you are|to be)/i
];

const PROBE_PATTERNS = [
	/show (me )?(your )?(system )?prompt/i,
	/reveal (your )?instructions/i,
	/what are your rules/i,
	/repeat (the )?(text|instructions|prompt) (above|before)/i
];

// ── In-memory block list ─────────────────────────────────────────────────────
// No automatic Redis reads. Updated only via admin block/unblock API calls
// or explicit admin sync. Starts empty on cold start — acceptable for a
// portfolio site where blocking is a rare manual action.
/** @type {Set<string>} */
const blockedIps = new Set();

export function addBlockedIp(ip) { blockedIps.add(ip); }
export function removeBlockedIp(ip) { blockedIps.delete(ip); }

/** Called by admin "sync" action — the only time we read block list from Redis */
export async function syncBlockListFromRedis() {
	let cursor = 0;
	const fresh = new Set();
	do {
		const result = await redis.scan(cursor, { match: 'blocked:ip:*', count: 200 });
		cursor = result[0];
		for (const key of result[1]) fresh.add(key.replace('blocked:ip:', ''));
	} while (cursor !== 0);
	blockedIps.clear();
	for (const ip of fresh) blockedIps.add(ip);
	return blockedIps.size;
}

/** For tests only */
export function _clearBlockCache() { blockedIps.clear(); }

// ── In-memory pre-throttle (no Redis) ───────────────────────────────────────
const PRE_THROTTLE_MAX = 20;
const PRE_THROTTLE_WINDOW_MS = 10_000;
/** @type {Map<string, {count: number, resetAt: number}>} */
const preThrottle = new Map();

function isPreThrottled(ip) {
	if (BYPASS_IPS.has(ip)) return false;
	const now = Date.now();
	let entry = preThrottle.get(ip);
	if (!entry || now > entry.resetAt) {
		entry = { count: 0, resetAt: now + PRE_THROTTLE_WINDOW_MS };
		preThrottle.set(ip, entry);
	}
	entry.count++;
	return entry.count > PRE_THROTTLE_MAX;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function nextUtcMidnight() {
	const now = new Date();
	return new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
	).toISOString();
}

/** @param {string} ip */
async function checkRateLimit(ip) {
	const key = `rl:${ip}:${new Date().toISOString().slice(0, 10)}`;
	const count = await redis.incr(key);
	if (count === 1) await redis.expire(key, 86400);
	return count;
}

/**
 * @param {string} ip
 * @param {string} lastUserMessage
 * @returns {Promise<import('$lib/types').GuardResult>}
 */
export async function runGuard(ip, lastUserMessage) {
	// 0. Pre-throttle — memory only, zero Redis
	if (isPreThrottled(ip)) {
		return { ok: false, status: 429, body: { error: 'Too many requests.', resetsAt: nextUtcMidnight() } };
	}

	// 1. Keyword check — memory only, zero Redis
	const allPatterns = [...INJECTION_PATTERNS, ...PROBE_PATTERNS];
	const matchedPattern = allPatterns.find((p) => p.test(lastUserMessage));
	if (matchedPattern) {
		try {
			await redis.lpush('events:abuse', JSON.stringify({
				ts: new Date().toISOString(), ip,
				rule: matchedPattern.toString(),
				snippet: lastUserMessage.slice(0, 200)
			}));
			await redis.ltrim('events:abuse', 0, 99);
		} catch { /* non-fatal */ }
		return { ok: false, status: 400, body: { error: 'Message rejected by content policy.' } };
	}

	// 2. Block list — memory only, zero Redis reads
	if (blockedIps.has(ip)) {
		return { ok: false, status: 403, body: { error: 'Your IP has been blocked. Contact the site owner if this is an error.' } };
	}

	// 3. Rate limit — skip for bypass IPs
	if (BYPASS_IPS.has(ip)) return { ok: true };

	try {
		const count = await checkRateLimit(ip);
		if (count > 25) {
			return { ok: false, status: 429, body: { error: 'Daily request limit reached (25/day).', resetsAt: nextUtcMidnight() } };
		}
		return { ok: true };
	} catch {
		return { ok: false, status: 503, body: { error: 'Service temporarily unavailable.' } };
	}
}
