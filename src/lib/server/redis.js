import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

/** @type {Redis | null} */
let _redis = null;

export function getRedis() {
	if (_redis) return _redis;
	if (!env.UPSTASH_REDIS_REST_URL) {
		throw new Error('Missing env var: UPSTASH_REDIS_REST_URL');
	}
	if (!env.UPSTASH_REDIS_REST_TOKEN) {
		throw new Error('Missing env var: UPSTASH_REDIS_REST_TOKEN');
	}
	_redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN
	});
	return _redis;
}

// Proxy that initialises on first use — throws descriptive error if env vars missing
export const redis = new Proxy(/** @type {Redis} */ ({}), {
	get(_, prop) {
		const client = getRedis();
		const value = client[/** @type {keyof Redis} */ (prop)];
		return typeof value === 'function' ? value.bind(client) : value;
	}
});
