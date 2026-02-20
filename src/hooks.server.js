import { sequence } from '@sveltejs/kit/hooks';

// Basic in-memory rate limiting store
// In a true production app on edge/serverless, use Redis (e.g., Upstash) instead of an in-memory Map
const rateLimit = new Map();

// Max requests per window
const MAX_REQUESTS = 50;
// Window in milliseconds (1 minute)
const WINDOW_MS = 60000;

/**
 * Clean up old entries from the rate limit map
 */
function cleanupRateLimits() {
    const now = Date.now();
    for (const [ip, data] of rateLimit.entries()) {
        if (now - data.resetTime > 0) {
            rateLimit.delete(ip);
        }
    }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

/**
 * Handle HTTP headers for Security and Content Security Policy (CSP)
 * @type {import('@sveltejs/kit').Handle}
 */
const securityHeaders = async ({ event, resolve }) => {
    const response = await resolve(event);

    // Comprehensive Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy
    // Note: SvelteKit requires 'unsafe-inline' for styles sometimes, depending on setup
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'", // required for SvelteKit client-side hydration
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    return response;
};

/**
 * Handle API Rate Limiting
 * @type {import('@sveltejs/kit').Handle}
 */
const apiRateLimiter = async ({ event, resolve }) => {
    // Only apply rate limiting to /api routes
    if (event.url.pathname.startsWith('/api/')) {
        // Fallback IP for development environment if getClientAddress is not available/fails
        let clientIp = 'unknown';
        try {
            clientIp = event.getClientAddress() || event.request.headers.get('x-forwarded-for') || 'unknown';
        } catch (e) {
            // Ignore error when not running in adapter-node or during prerendering
        }

        const now = Date.now();

        let limitData = rateLimit.get(clientIp);

        if (!limitData || now > limitData.resetTime) {
            // New window
            limitData = {
                count: 1,
                resetTime: now + WINDOW_MS
            };
        } else {
            // Existing window
            limitData.count++;
        }

        rateLimit.set(clientIp, limitData);

        // Calculate remaining hits
        const remaining = Math.max(0, MAX_REQUESTS - limitData.count);

        if (limitData.count > MAX_REQUESTS) {
            return new Response(JSON.stringify({
                error: 'Too many requests. Please try again later.'
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': Math.ceil((limitData.resetTime - now) / 1000).toString(),
                    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(limitData.resetTime / 1000).toString()
                }
            });
        }
    }

    return await resolve(event);
};

export const handle = sequence(securityHeaders, apiRateLimiter);
