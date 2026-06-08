<script>
	import StarField from '$lib/components/StarField.svelte';

	/** @type {'ask' | 'fit'} */
	let mode = $state('ask');
	/** @type {'idle' | 'streaming' | 'rate_limited' | 'blocked'} */
	let chatState = $state('idle');

	/** @type {Array<{role: 'user'|'assistant'|'system', content: string}>} */
	let messages = $state([]);
	let inputText = $state('');
	let jobDescription = $state('');
	let resetsAt = $state('');
	let streamingContent = $state('');
	let pdfError = $state('');

	const MAX_CLIENT_MESSAGES = 10;

	const STARTER_CHIPS = [
		'What did Illia build at Meta?',
		'How did Illia contribute at Google?',
		'What is Illia\'s strongest technical skill?',
		'Tell me about Illia\'s experience with distributed systems.'
	];

	/** @param {'ask'|'fit'} newMode */
	function switchMode(newMode) {
		mode = newMode;
		messages = [];
		inputText = '';
		jobDescription = '';
		streamingContent = '';
		chatState = 'idle';
	}

	/**
	 * @param {string} userText
	 * @param {string} [jd]
	 */
	async function sendMessage(userText, jd) {
		if (!userText.trim() && mode === 'ask') return;
		if (chatState !== 'idle') return;

		/** @type {{role: 'user'|'assistant'|'system', content: string}} */
		const userMsg = { role: /** @type {'user'} */ ('user'), content: userText.trim() };
		messages = [...messages, userMsg];
		inputText = '';
		chatState = 'streaming';
		streamingContent = '';

		// Trim to last 10 messages client-side
		const trimmed = messages.slice(-MAX_CLIENT_MESSAGES);
		// Show context warning if trimmed
		if (messages.length > MAX_CLIENT_MESSAGES && !messages.some(m => m.role === 'system')) {
			messages = [
				{ role: 'system', content: 'Earlier messages not included in this context.' },
				...messages.slice(-MAX_CLIENT_MESSAGES)
			];
		}

		/** @type {Record<string, unknown>} */
		const body = { messages: trimmed, mode };
		if (mode === 'fit' && jd) body.jobDescription = jd;

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: 'Unknown error' }));
				if (res.status === 429) {
					resetsAt = err.resetsAt ?? '';
					chatState = 'rate_limited';
					return;
				}
				if (res.status === 403) {
					messages = [...messages, { role: 'assistant', content: err.error ?? 'Access denied.' }];
					chatState = 'blocked';
					return;
				}
				messages = [...messages, { role: 'assistant', content: err.error ?? 'Something went wrong.' }];
				chatState = 'idle';
				return;
			}

			// Stream response
			const reader = res.body?.getReader();
			if (!reader) { chatState = 'idle'; return; }
			const decoder = new TextDecoder();
			let assistantText = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				assistantText += chunk;
				streamingContent = assistantText;
			}

			messages = [...messages, { role: 'assistant', content: assistantText }];
			streamingContent = '';
			chatState = 'idle';
		} catch {
			messages = [...messages, { role: 'assistant', content: '[Connection error. Please try again.]' }];
			chatState = 'idle';
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage(inputText, jobDescription);
		}
	}

	/** @param {Event & {currentTarget: HTMLInputElement}} e */
	async function handlePdfUpload(e) {
		pdfError = '';
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		if (file.type !== 'application/pdf') {
			pdfError = 'Only PDF files are supported.';
			e.currentTarget.value = '';
			return;
		}
		try {
			const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
			GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await getDocument({ data: arrayBuffer }).promise;
			let text = '';
			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const content = await page.getTextContent();
				text += content.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
			}
			jobDescription = text.trim();
		} catch {
			pdfError = 'Failed to extract text from PDF.';
		}
		e.currentTarget.value = '';
	}

	/** @param {string} iso */
	function formatResetsAt(iso) {
		if (!iso) return '';
		try {
			return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
		} catch {
			return iso;
		}
	}
</script>

<svelte:head>
	<title>Chat — Illia Pogodin</title>
	<meta name="description" content="Ask about Illia Pogodin's experience or check job fit." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<StarField />

	<nav>
		<a href="/" class="logo">ip<span>.</span></a>
		<div class="nav-links">
			<a href="/work">work</a>
			<a href="/contact">contact</a>
			<a href="/chat" class="active">chat</a>
		</div>
	</nav>

	<main>
		<div class="chat-container">
			<div class="chat-header">
				<h1>Ask about Illia</h1>
				<div class="mode-toggle">
					<button class:active={mode === 'ask'} onclick={() => switchMode('ask')}>Ask</button>
					<button class:active={mode === 'fit'} onclick={() => switchMode('fit')}>Job Fit</button>
				</div>
			</div>

			{#if mode === 'fit'}
				<div class="jd-panel">
					<label for="jd-input">Paste job description or upload PDF</label>
					<textarea
						id="jd-input"
						bind:value={jobDescription}
						placeholder="Paste the job description here…"
						rows="6"
					></textarea>
					<div class="pdf-row">
						<label for="pdf-upload" class="pdf-btn">Upload PDF</label>
						<input id="pdf-upload" type="file" accept=".pdf" onchange={handlePdfUpload} />
						{#if pdfError}<span class="pdf-error">{pdfError}</span>{/if}
					</div>
				</div>
			{/if}

			<div class="message-thread" id="thread">
				{#if messages.length === 0 && chatState === 'idle'}
					<div class="starter-chips">
						{#each STARTER_CHIPS as chip}
							<button class="chip" onclick={() => sendMessage(chip, jobDescription)}>{chip}</button>
						{/each}
					</div>
				{:else}
					{#each messages as msg}
						{#if msg.role === 'system'}
							<div class="msg-system">{msg.content}</div>
						{:else if msg.role === 'user'}
							<div class="msg msg-user"><div class="bubble">{msg.content}</div></div>
						{:else}
							<div class="msg msg-assistant">
								<div class="bubble">{@html formatResponse(msg.content)}</div>
							</div>
						{/if}
					{/each}
					{#if chatState === 'streaming'}
						<div class="msg msg-assistant">
							<div class="bubble">{@html formatResponse(streamingContent)}<span class="cursor">█</span></div>
						</div>
					{/if}
				{/if}
			</div>

			{#if chatState === 'rate_limited'}
				<div class="rate-limit-banner">
					Daily limit reached (25 requests). Resets at {formatResetsAt(resetsAt)}.
				</div>
			{/if}

			{#if chatState === 'blocked'}
				<div class="blocked-banner">
					Your access has been restricted. Contact the site owner if this is an error.
				</div>
			{/if}

			<div class="input-bar" class:disabled={chatState !== 'idle'}>
				<textarea
					bind:value={inputText}
					placeholder={mode === 'fit' ? 'Ask about the job fit…' : 'Ask about Illia…'}
					rows="1"
					disabled={chatState !== 'idle'}
					onkeydown={handleKeydown}
				></textarea>
				<button
					class="send-btn"
					onclick={() => sendMessage(inputText, jobDescription)}
					disabled={chatState !== 'idle'}
					aria-label="Send message"
				>
					{chatState === 'streaming' ? '…' : '→'}
				</button>
			</div>
		</div>
	</main>

	<a href="/cyberpunk" class="easter-egg" data-sveltekit-preload-data="off">◈ cybercity</a>
</div>

<style>
	:global(html), :global(body) { margin: 0; padding: 0; background: #09090B; color: #FAFAFA; }

	.page { min-height: 100vh; display: flex; flex-direction: column; font-family: 'DM Sans', sans-serif; position: relative; }

	nav {
		position: fixed; top: 0; left: 0; right: 0; z-index: 100;
		display: flex; align-items: center; justify-content: space-between;
		padding: 20px 32px; background: rgba(9,9,11,0.8); backdrop-filter: blur(12px);
	}
	.logo { color: #FAFAFA; text-decoration: none; font-weight: 700; font-size: 18px; font-family: 'Space Grotesk', sans-serif; }
	.logo span { color: #6366F1; }
	.nav-links { display: flex; gap: 32px; }
	.nav-links a { color: #71717A; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
	.nav-links a:hover, .nav-links a.active { color: #FAFAFA; }

	main { flex: 1; display: flex; justify-content: center; padding: 96px 24px 40px; }

	.chat-container {
		width: 100%; max-width: 740px;
		display: flex; flex-direction: column; gap: 16px;
	}

	.chat-header { display: flex; align-items: center; justify-content: space-between; }
	h1 { margin: 0; font-size: 22px; font-family: 'Space Grotesk', sans-serif; color: #FAFAFA; }

	.mode-toggle { display: flex; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 3px; gap: 3px; }
	.mode-toggle button {
		padding: 6px 16px; border: none; border-radius: 6px; cursor: pointer;
		background: transparent; color: #71717A; font-size: 13px; font-weight: 500; transition: all 0.2s;
	}
	.mode-toggle button.active { background: #6366F1; color: #fff; }
	.mode-toggle button:hover:not(.active) { color: #FAFAFA; }

	.jd-panel {
		background: rgba(17,17,19,0.85); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px;
	}
	.jd-panel label { font-size: 12px; color: #71717A; font-weight: 500; }
	.jd-panel textarea {
		background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px; color: #FAFAFA; font-size: 14px; padding: 10px 12px;
		resize: vertical; font-family: inherit; line-height: 1.6;
	}
	.jd-panel textarea:focus { outline: none; border-color: #6366F1; }
	.pdf-row { display: flex; align-items: center; gap: 10px; }
	.pdf-btn {
		padding: 6px 14px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
		border-radius: 6px; color: #6366F1; font-size: 13px; cursor: pointer; transition: all 0.2s;
	}
	.pdf-btn:hover { background: rgba(99,102,241,0.25); }
	#pdf-upload { display: none; }
	.pdf-error { color: #ef4444; font-size: 12px; }

	.message-thread {
		flex: 1; min-height: 300px; max-height: 55vh;
		overflow-y: auto; display: flex; flex-direction: column; gap: 12px;
		padding: 4px 0;
	}
	.message-thread::-webkit-scrollbar { width: 4px; }
	.message-thread::-webkit-scrollbar-track { background: transparent; }
	.message-thread::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

	.starter-chips { display: flex; flex-direction: column; gap: 8px; padding: 8px 0; }
	.chip {
		background: rgba(17,17,19,0.85); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 10px; color: #A1A1AA; font-size: 14px; padding: 12px 16px;
		text-align: left; cursor: pointer; transition: all 0.2s; font-family: inherit;
	}
	.chip:hover { border-color: rgba(99,102,241,0.4); color: #FAFAFA; background: rgba(99,102,241,0.08); }

	.msg { display: flex; }
	.msg-user { justify-content: flex-end; }
	.msg-assistant { justify-content: flex-start; }
	.msg-system { text-align: center; font-size: 11px; color: #52525B; padding: 4px 0; }

	.bubble {
		max-width: 82%; padding: 12px 16px; border-radius: 12px;
		font-size: 15px; line-height: 1.65; white-space: pre-wrap;
	}
	.msg-user .bubble { background: #6366F1; color: #fff; border-bottom-right-radius: 4px; }
	.msg-assistant .bubble {
		background: rgba(17,17,19,0.9); border: 1px solid rgba(255,255,255,0.08);
		color: #E4E4E7; border-bottom-left-radius: 4px;
	}

	.cursor { display: inline-block; animation: blink 1s step-end infinite; }
	@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

	.rate-limit-banner, .blocked-banner {
		padding: 12px 16px; border-radius: 10px;
		font-size: 13px; text-align: center;
	}
	.rate-limit-banner { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #fbbf24; }
	.blocked-banner { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }

	.input-bar {
		display: flex; gap: 10px; align-items: flex-end;
		background: rgba(17,17,19,0.85); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px; padding: 12px;
	}
	.input-bar.disabled { opacity: 0.5; }
	.input-bar textarea {
		flex: 1; background: transparent; border: none; color: #FAFAFA;
		font-size: 15px; font-family: inherit; resize: none; line-height: 1.5;
		max-height: 96px; overflow-y: auto;
	}
	.input-bar textarea:focus { outline: none; }
	.input-bar textarea::placeholder { color: #52525B; }
	.send-btn {
		width: 36px; height: 36px; background: #6366F1; border: none; border-radius: 8px;
		color: #fff; font-size: 16px; cursor: pointer; transition: background 0.2s;
		flex-shrink: 0; display: flex; align-items: center; justify-content: center;
	}
	.send-btn:hover:not(:disabled) { background: #4F46E5; }
	.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

	.easter-egg {
		position: fixed; bottom: 20px; right: 24px;
		font-size: 11px; color: rgba(255,255,255,0.28); text-decoration: none;
		transition: color 0.3s; z-index: 200; letter-spacing: 0.05em;
	}
	.easter-egg:hover { color: rgba(255,255,255,0.6); }

	@media (max-width: 768px) {
		nav { padding: 16px 20px; }
		main { padding: 80px 16px 24px; }
		.bubble { max-width: 92%; font-size: 14px; }
		.message-thread { max-height: 45vh; }
	}
</style>

<script module>
	/** @param {string} text */
	function formatResponse(text) {
		if (!text) return '';
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/•\s/g, '• ')
			.replace(/✓/g, '<span style="color:#4ade80">✓</span>')
			.replace(/~/g, '<span style="color:#fbbf24">~</span>')
			.replace(/✗/g, '<span style="color:#f87171">✗</span>');
	}
</script>
