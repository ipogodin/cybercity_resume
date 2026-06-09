import { redis } from './redis.js';
import { env } from '$env/dynamic/private';

// IPs exempt from rate limiting: localhost fallback + any in RATE_LIMIT_BYPASS_IPS env var
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

// ── In-memory block list cache ──────────────────────────────────────────────
// Caches the blocked IP set for 30s so we don't hit Redis on every request.
// A new block takes effect within 30s maximum.
let blockCacheTs = 0;
const BLOCK_CACHE_TTL_MS = 30_000;
/** @type {Set<string>} */
let blockCache = new Set();

/** For tests only — resets the in-memory block cache */
export function _clearBlockCache() { blockCacheTs = 0; blockCache = new Set(); }

async function isBlocked(ip) {
	const now = Date.now();
	if (now - blockCacheTs > BLOCK_CACHE_TTL_MS) {
		// Refresh cache: scan all blocked keys
		let cursor = 0;
		const fresh = new Set();
		try {
			do {
				const result = await redis.scan(cursor, { match: 'blocked:ip:*', count: 200 });
				cursor = result[0];
				for (const key of result[1]) {
					fresh.add(key.replace('blocked:ip:', ''));
				}
			} while (cursor !== 0);
			blockCache = fresh;
			blockCacheTs = now;
		} catch {
			// On Redis error, fall back to stale cache rather than crashing
		}
	}
	return blockCache.has(ip);
}

// ── In-memory pre-throttle ───────────────────────────────────────────────────
// Rejects obvious burst traffic before touching Redis.
// 20 req/10s per IP. Resets per window. Stored in module memory (per Vercel instance).
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

function utcDateKey() {
	return new Date().toISOString().slice(0, 10);
}

/** @param {string} ip */
async function checkRateLimit(ip) {
	const key = `rl:${ip}:${utcDateKey()}`;
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
	// 0. Pre-throttle — no Redis touch
	if (isPreThrottled(ip)) {
		return { ok: false, status: 429, body: { error: 'Too many requests.', resetsAt: nextUtcMidnight() } };
	}

	// 1. Keyword pre-check — no Redis touch
	const allPatterns = [...INJECTION_PATTERNS, ...PROBE_PATTERNS];
	const matchedPattern = allPatterns.find((p) => p.test(lastUserMessage));

	if (matchedPattern) {
		try {
			const event = {
				ts: new Date().toISOString(),
				ip,
				rule: matchedPattern.toString(),
				snippet: lastUserMessage.slice(0, 200)
			};
			await redis.lpush('events:abuse', JSON.stringify(event));
			await redis.ltrim('events:abuse', 0, 99);
		} catch {
			// log failure is non-fatal
		}
		return { ok: false, status: 400, body: { error: 'Message rejected by content policy.' } };
	}

	try {
		// 2. Block list — uses in-memory cache (30s TTL), avoids Redis GET per request
		if (await isBlocked(ip)) {
			return {
				ok: false,
				status: 403,
				body: { error: 'Your IP has been blocked. Contact the site owner if this is an error.' }
			};
		}

		// 3. Rate limit — skipped for bypass IPs
		if (BYPASS_IPS.has(ip)) return { ok: true };

		const count = await checkRateLimit(ip);
		if (count > 25) {
			return {
				ok: false,
				status: 429,
				body: { error: 'Daily request limit reached (25/day).', resetsAt: nextUtcMidnight() }
			};
		}

		return { ok: true };
	} catch {
		return { ok: false, status: 503, body: { error: 'Service temporarily unavailable.' } };
	}
}
