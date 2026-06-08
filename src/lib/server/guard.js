import { redis } from './redis.js';
import { env } from '$env/dynamic/private';

// IPs exempt from rate limiting: always includes localhost fallback + any in RATE_LIMIT_BYPASS_IPS env var
const BYPASS_IPS = new Set([
	'0.0.0.0',  // npm run dev fallback (no x-forwarded-for header locally)
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

function nextUtcMidnight() {
	const now = new Date();
	const midnight = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
	);
	return midnight.toISOString();
}

function utcDateKey() {
	const now = new Date();
	return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

/** @param {string} ip */
async function checkRateLimit(ip) {
	const key = `rl:${ip}:${utcDateKey()}`;
	const count = await redis.incr(key);
	// Set 24h TTL on first increment
	if (count === 1) {
		await redis.expire(key, 86400);
	}
	return count;
}

/**
 * @param {string} ip
 * @param {string} lastUserMessage
 * @returns {Promise<import('$lib/types').GuardResult>}
 */
export async function runGuard(ip, lastUserMessage) {
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
		// 2. Block list check — no INCR
		const blocked = await redis.get(`blocked:ip:${ip}`);
		if (blocked) {
			return {
				ok: false,
				status: 403,
				body: { error: 'Your IP has been blocked. Contact the site owner if this is an error.' }
			};
		}

		// 3. Rate limit — skipped for bypass IPs (localhost + explicitly whitelisted)
		if (BYPASS_IPS.has(ip)) return { ok: true };

		const count = await checkRateLimit(ip);
		if (count > 25) {
			return {
				ok: false,
				status: 429,
				body: {
					error: 'Daily request limit reached (25/day).',
					resetsAt: nextUtcMidnight()
				}
			};
		}

		return { ok: true };
	} catch {
		return { ok: false, status: 503, body: { error: 'Service temporarily unavailable.' } };
	}
}
