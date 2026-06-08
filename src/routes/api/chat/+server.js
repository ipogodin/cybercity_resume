import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import { runGuard } from '$lib/server/guard.js';
import { buildSystemPrompt } from '$lib/server/prompt.js';
import { redis } from '$lib/server/redis.js';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const MAX_MESSAGES = 10;
const MODEL = 'gpt-4o';

export function _validateChatRequest(body) {
	if (!body || typeof body !== 'object') return null;
	if (!Array.isArray(body.messages)) return null;
	if (!body.mode || !['ask', 'fit'].includes(body.mode)) return null;
	return /** @type {import('$lib/types').ChatRequest} */ (body);
}

async function writeLog(ip, request, response, usage, durationMs) {
	try {
		const key = `log:ip:${ip}`;
		const entry = JSON.stringify({
			ts: new Date().toISOString(),
			ip,
			mode: request.mode,
			type: request.requestType ?? 'message',
			request: (request.messages.at(-1)?.content ?? '').slice(0, 500),
			response: response.slice(0, 500),
			tokens: usage,
			durationMs
		});
		const score = Date.now();
		await redis.zadd(key, { score, member: entry });
		await redis.expireat(key, Math.floor((Date.now() + 2_592_000_000) / 1000));
	} catch {
		// log failure is non-fatal
	}
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
			JSON.stringify({ error: 'Invalid request: messages (array) and mode (ask|fit) required' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const ip = locals.clientIp;
	const trimmedMessages = chatRequest.messages.slice(-MAX_MESSAGES);
	const lastUserMessage =
		[...trimmedMessages].reverse().find((m) => m.role === 'user')?.content ?? '';

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
				try {
					for await (const chunk of stream) {
						const text = chunk.choices[0]?.delta?.content ?? '';
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
				} catch {
					const interrupted = '\n\n[Response interrupted]';
					fullResponse += interrupted;
					controller.enqueue(encoder.encode(interrupted));
				} finally {
					controller.close();
					writeLog(
						ip,
						{ ...chatRequest, messages: trimmedMessages },
						fullResponse,
						usage,
						Date.now() - startMs
					);
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
		return new Response(JSON.stringify({ error: 'Upstream AI service error' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
