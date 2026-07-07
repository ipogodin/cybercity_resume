import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import { runGuard } from '$lib/server/guard.js';
import { buildSystemPrompt } from '$lib/server/prompt.js';
import { redis } from '$lib/server/redis.js';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const MAX_MESSAGES = 10;
const MODEL = 'gpt-4o';

// Secret test triggers — each simulates a different error path.
// Hard to guess in natural conversation. Never logged or stored.
const TEST_TRIGGERS = {
	'ohm-my':    'breaker_trip',   // 418 — animation + recovery message
	'grnd-fault': 'fuse_blown',    // 502 — pre-stream server error
	'arc-flash':  'token_limit',   // 200 stream — hits token limit mid-response
	'pipe-burst': 'stream_error',  // 200 stream — dies mid-stream
	'volt-drop':  'rate_limit',    // 429 — daily limit reached
};

/** @param {string} msg */
function detectTestTrigger(msg) {
	const lower = msg.toLowerCase();
	for (const [word, code] of Object.entries(TEST_TRIGGERS)) {
		if (lower.includes(word)) return code;
	}
	return null;
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export function _validateChatRequest(body) {
	if (!body || typeof body !== 'object') return null;
	if (!Array.isArray(body.messages)) return null;
	if (!body.mode) body.mode = 'advocate'; // default
	return /** @type {import('$lib/types').ChatRequest} */ (body);
}

async function saveLead(ip, email, question) {
	try {
		await redis.lpush('leads:all', JSON.stringify({
			ts: new Date().toISOString(),
			ip,
			email,
			q: question.slice(0, 300)
		}));
		await redis.ltrim('leads:all', 0, 199);
	} catch { /* non-fatal */ }
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request, locals }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const chatRequest = _validateChatRequest(body);
	if (!chatRequest) {
		return new Response(
			JSON.stringify({ error: 'Invalid request: "messages" must be an array' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const ip = locals.clientIp;
	const trimmedMessages = chatRequest.messages.slice(-MAX_MESSAGES);

	const lastMsg = [...trimmedMessages].reverse().find((m) => m.role === 'user');
	const lastUserMessage = Array.isArray(lastMsg?.content)
		? lastMsg.content.filter(p => p.type === 'text').map(p => p.text).join(' ')
		: (lastMsg?.content ?? '');

	// Detect and save email addresses left by visitors (fire-and-forget)
	const emails = lastUserMessage.match(EMAIL_RE);
	if (emails && chatRequest.mode === 'advocate') {
		for (const email of emails) saveLead(ip, email, lastUserMessage);
	}

	// Secret test triggers — simulate error paths without touching real infrastructure
	const testCode = detectTestTrigger(lastUserMessage);
	if (testCode) {
		if (testCode === 'breaker_trip') {
			return new Response(
				JSON.stringify({ error: 'breaker_trip', code: 'breaker_trip' }),
				{ status: 418, headers: { 'Content-Type': 'application/json' } }
			);
		}
		if (testCode === 'fuse_blown') {
			return new Response(
				JSON.stringify({ error: 'Something blew a fuse on our end. Give it a moment.', code: 'fuse_blown' }),
				{ status: 502, headers: { 'Content-Type': 'application/json' } }
			);
		}
		if (testCode === 'rate_limit') {
			const nextMidnight = new Date(
				Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1)
			).toISOString();
			return new Response(
				JSON.stringify({ error: 'Daily request limit reached (25/day).', resetsAt: nextMidnight }),
				{ status: 429, headers: { 'Content-Type': 'application/json' } }
			);
		}
		if (testCode === 'token_limit') {
			// Simulate stream that hits token limit mid-response
			const encoder = new TextEncoder();
			const readable = new ReadableStream({
				start(controller) {
					const partial = 'Illia has extensive experience with distributed systems, having worked across Meta, Google, and Salesforce on high-scale platforms serving billions of users. At Meta he led the Tupperware rebalancer';
					controller.enqueue(encoder.encode(partial));
					const notice = '\n\n*The circuit hit its limit mid-thought — ask me to continue.*';
					controller.enqueue(encoder.encode(notice));
					controller.close();
				}
			});
			return new Response(readable, {
				headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
			});
		}
		if (testCode === 'stream_error') {
			// Simulate stream that dies mid-response
			const encoder = new TextEncoder();
			const readable = new ReadableStream({
				start(controller) {
					controller.enqueue(encoder.encode('Illia brings 15+ years of backend engineering experience, with deep expertise in'));
					const msg = '\n\n*Lost signal in the junction box. The partial answer above is what made it through.*';
					controller.enqueue(encoder.encode(msg));
					controller.close();
				}
			});
			return new Response(readable, {
				headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
			});
		}
	}

	const guardResult = await runGuard(ip, lastUserMessage);
	if (!guardResult.ok) {
		return new Response(JSON.stringify(guardResult.body), {
			status: guardResult.status,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const systemPrompt = buildSystemPrompt(chatRequest.mode, chatRequest.jobDescription);

	const startMs = Date.now();
	let fullResponse = '';
	let usage = { input: 0, output: 0 };

	try {
		const stream = await openai.chat.completions.create({
			model: MODEL,
			max_tokens: 800,
			messages: [{ role: 'system', content: systemPrompt }, ...trimmedMessages],
			stream: true,
			stream_options: { include_usage: true }
		});

		const readable = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				let tokenLimitHit = false;
				try {
					for await (const chunk of stream) {
						const text = chunk.choices[0]?.delta?.content ?? '';
						const finishReason = chunk.choices[0]?.finish_reason;

						if (finishReason === 'length') tokenLimitHit = true;

						if (text) {
							fullResponse += text;
							controller.enqueue(encoder.encode(text));
						}
						if (chunk.usage) {
							usage = {
								input: chunk.usage.prompt_tokens,
								output: chunk.usage.completion_tokens
							};
						}
					}

					if (tokenLimitHit) {
						const notice = '\n\n*The circuit hit its limit mid-thought — ask me to continue.*';
						fullResponse += notice;
						controller.enqueue(encoder.encode(notice));
					}
				} catch {
					const msg = fullResponse.length > 0
						? '\n\n*Lost signal in the junction box. The partial answer above is what made it through.*'
						: '\n\n*The pipes burst before anything got through. Try again in a moment.*';
					fullResponse += msg;
					controller.enqueue(encoder.encode(msg));
				} finally {
					controller.close();
					// Fire-and-forget log — 2 writes, keeps last 500 entries
					const lastMsg = trimmedMessages.slice().reverse().find(m => m.role === 'user');
					const question = Array.isArray(lastMsg?.content)
						? lastMsg.content.filter(p => p.type === 'text').map(p => p.text).join(' ')
						: (lastMsg?.content ?? '');
					redis.lpush('chat:log', JSON.stringify({
						ts: new Date().toISOString(),
						ip,
						sid: chatRequest.sessionId ?? null,
						mode: chatRequest.mode,
						q: question.slice(0, 500),
						a: fullResponse.slice(0, 1000)
					})).then(() => redis.ltrim('chat:log', 0, 499)).catch(() => {});
				}
			}
		});

		const nextMidnight = new Date(
			Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1)
		).toISOString();

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store',
				'X-RateLimit-Remaining': String(Math.max(0, 25 - 1)),
				'X-RateLimit-Reset': nextMidnight
			}
		});
	} catch {
		return new Response(
			JSON.stringify({ error: 'Something blew a fuse on our end. Give it a moment.', code: 'fuse_blown' }),
			{ status: 502, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
