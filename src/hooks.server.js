import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */
const ipExtractor = async ({ event, resolve }) => {
	event.locals.clientIp =
		event.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0';
	return resolve(event);
};

/** @type {import('@sveltejs/kit').Handle} */
const securityHeaders = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data:",
		"connect-src 'self' https://api.anthropic.com",
		"frame-ancestors 'none'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);

	return response;
};

export const handle = sequence(ipExtractor, securityHeaders);
