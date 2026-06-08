import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { runGuard } from '$lib/server/guard.js';
import { buildSystemPrompt } from '$lib/server/prompt.js';
import { redis } from '$lib/server/redis.js';

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const MAX_MESSAGES = 10;

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
		// 30-day TTL, reset on each write
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
		return new Response(JSON.stringify({ error: 'Invalid request: messages (array) and mode (ask|fit) required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const ip = locals.clientIp;
	const trimmedMessages = chatRequest.messages.slice(-MAX_MESSAGES);
	const lastUserMessage = [...trimmedMessages].reverse().find((m) => m.role === 'user')?.content ?? '';

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
		const stream = anthropic.messages.stream({
			model: 'claude-sonnet-4-6',
			max_tokens: 800,
			system: systemPrompt,
			messages: trimmedMessages
		});

		const readable = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				try {
					for await (const event of stream) {
						if (
							event.type === 'content_block_delta' &&
							event.delta.type === 'text_delta'
						) {
							const text = event.delta.text;
							fullResponse += text;
							controller.enqueue(encoder.encode(text));
						}
					}
					const finalMsg = await stream.finalMessage();
					usage = {
						input: finalMsg.usage.input_tokens,
						output: finalMsg.usage.output_tokens
					};
				} catch {
					const interrupted = '\n\n[Response interrupted]';
					fullResponse += interrupted;
					controller.enqueue(encoder.encode(interrupted));
				} finally {
					controller.close();
					writeLog(ip, { ...chatRequest, messages: trimmedMessages }, fullResponse, usage, Date.now() - startMs);
				}
			}
		});

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store',
				'X-RateLimit-Remaining': String(Math.max(0, 25 - 1)),
				'X-RateLimit-Reset': new Date(
					Date.UTC(
						new Date().getUTCFullYear(),
						new Date().getUTCMonth(),
						new Date().getUTCDate() + 1
					)
				).toISOString()
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Upstream AI service error' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
