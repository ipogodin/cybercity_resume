<script module>
	/** @param {string} text */
	function formatResponse(text) {
		if (!text) return '';
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/✓/g, '<span style="color:#4ade80">✓</span>')
			.replace(/~/g, '<span style="color:#fbbf24">~</span>')
			.replace(/✗/g, '<span style="color:#f87171">✗</span>');
	}
</script>

<script>
	import StarField from '$lib/components/StarField.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	/** @type {'idle' | 'streaming' | 'rate_limited' | 'blocked'} */
	let chatState = $state('idle');

	/** @type {Array<{role: 'user'|'assistant'|'system', content: string}>} */
	let messages = $state([]);
	let inputText = $state('');
	let jobDescription = $state('');
	let attachedImage = $state('');
	let attachedFileName = $state('');
	let resetsAt = $state('');
	let streamingContent = $state('');
	let uploadError = $state('');
	let breakerTrip = $state(false);
	let threadEl = $state(/** @type {HTMLElement|null} */ (null));
	let inputEl = $state(/** @type {HTMLTextAreaElement|null} */ (null));
	let sessionId = '';

	function triggerBreakerTrip() {
		breakerTrip = true;
		setTimeout(() => { breakerTrip = false; }, 2200);
	}

	const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
	const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
	const MAX_CLIENT_MESSAGES = 10;

	const STARTER_CHIPS = [
		'Is Illia a fit for a Staff Backend Engineer role?',
		'What makes Illia stand out as an engineer?',
		'I have a distributed systems role — would Illia be interested?',
		'What did Illia accomplish at Meta and Google?'
	];

	let showContactCta = $state(false);

	onMount(() => {
		// Generate or restore session ID — persists within same browser tab
		const stored = sessionStorage.getItem('chat_session_id');
		if (stored) {
			sessionId = stored;
		} else {
			sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
			sessionStorage.setItem('chat_session_id', sessionId);
		}

		if ($page.url.searchParams.get('from') === 'pdf') {
			const pdf = sessionStorage.getItem('fit_pdf');
			const img = sessionStorage.getItem('fit_image');
			sessionStorage.removeItem('fit_pdf');
			sessionStorage.removeItem('fit_image');
			if (pdf) {
				jobDescription = pdf;
				sendMessage('Please evaluate Illia\'s fit for this position.', { jd: pdf });
			} else if (img) {
				attachedImage = img;
				sendMessage('Please evaluate Illia\'s fit for this position.', { image: img });
			}
			return;
		}

		const q = $page.url.searchParams.get('q');
		if (q) {
			const looksLikeRoleTitle = q.length <= 80 && !q.includes('?') && q.split(' ').length <= 10;
			if (looksLikeRoleTitle) {
				sendMessage(`I'm looking to hire a ${q}. Is Illia a good fit for this role?`);
			} else {
				sendMessage(q);
			}
		} else {
			setTimeout(() => inputEl?.focus(), 100);
		}
	});

	/**
	 * @param {string} userText
	 * @param {{ jd?: string, image?: string }} [attachment]
	 */
	async function sendMessage(userText, attachment) {
		if (!userText.trim()) return;
		if (chatState !== 'idle') return;

		const jd = attachment?.jd || jobDescription || undefined;
		const image = attachment?.image || attachedImage || undefined;

		/** @type {string | Array<{type:string,[key:string]:unknown}>} */
		const content = image
			? [
				{ type: 'text', text: userText.trim() },
				{ type: 'image_url', image_url: { url: image } }
			]
			: userText.trim();

		messages = [...messages, { role: /** @type {'user'} */ ('user'), content }];
		inputText = '';
		attachedImage = '';
		attachedFileName = '';
		chatState = 'streaming';
		streamingContent = '';

		const trimmed = messages.slice(-MAX_CLIENT_MESSAGES);

		if (messages.length > MAX_CLIENT_MESSAGES && !messages.some(m => m.role === 'system')) {
			messages = [
				{ role: 'system', content: 'Earlier messages not included in this context.' },
				...messages.slice(-MAX_CLIENT_MESSAGES)
			];
		}

		/** @type {Record<string, unknown>} */
		const body = { messages: trimmed, mode: 'advocate', sessionId };
		if (jd) body.jobDescription = jd;

		scrollToBottom();

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				if (res.status === 418 && err.code === 'breaker_trip') {
					triggerBreakerTrip();
					messages = [...messages, { role: 'assistant', content: '⚡ Breaker tripped. All systems nominal — that was a test.' }];
					chatState = 'idle';
					return;
				}
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
				if (res.status === 502) {
					triggerBreakerTrip();
					messages = [...messages, { role: 'assistant', content: err.error ?? 'Something blew a fuse on our end. Give it a moment.' }];
					chatState = 'idle';
					return;
				}
				messages = [...messages, { role: 'assistant', content: 'Wiring issue on our end. Try again.' }];
				chatState = 'idle';
				return;
			}

			const reader = res.body?.getReader();
			if (!reader) { chatState = 'idle'; return; }

			const decoder = new TextDecoder();
			let assistantText = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				assistantText += decoder.decode(value, { stream: true });
				streamingContent = assistantText.replace('[CONTACT_CTA]', '');
				scrollToBottom();
			}

			// Strip [CONTACT_CTA] token and show contact card
			if (assistantText.includes('[CONTACT_CTA]')) {
				assistantText = assistantText.replace('[CONTACT_CTA]', '').trimEnd();
				showContactCta = true;
			}
			messages = [...messages, { role: 'assistant', content: assistantText }];
			streamingContent = '';
			chatState = 'idle';
			scrollToBottom();
		} catch {
			triggerBreakerTrip();
			messages = [...messages, { role: 'assistant', content: 'Lost signal in the junction box. Check your connection and try again.' }];
			chatState = 'idle';
		}
	}

	function scrollToBottom() {
		if (threadEl) setTimeout(() => { if (threadEl) threadEl.scrollTop = threadEl.scrollHeight; }, 10);
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage(inputText);
		}
	}

	/** Grow textarea with content, max 5 rows */
	function autoResize() {
		if (!inputEl) return;
		inputEl.style.height = 'auto';
		inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
	}

	/** @param {Event & {currentTarget: HTMLInputElement}} e */
	async function handleFileUpload(e) {
		uploadError = '';
		const file = e.currentTarget.files?.[0];
		if (!file) return;

		if (!ACCEPTED_TYPES.includes(file.type)) {
			uploadError = 'Supported: PDF, PNG, JPG, WEBP.';
			e.currentTarget.value = '';
			return;
		}
		if (file.size > MAX_IMAGE_BYTES) {
			uploadError = 'File too large — 4 MB max.';
			e.currentTarget.value = '';
			return;
		}

		attachedFileName = file.name;
		attachedImage = '';
		jobDescription = '';

		if (file.type === 'application/pdf') {
			try {
				const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
				GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
				const arrayBuffer = await file.arrayBuffer();
				const pdf = await getDocument({ data: arrayBuffer }).promise;
				let text = '';
				for (let i = 1; i <= pdf.numPages; i++) {
					const p = await pdf.getPage(i);
					const content = await p.getTextContent();
					text += content.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
				}
				jobDescription = text.trim();
			} catch {
				uploadError = 'Could not read PDF.';
				attachedFileName = '';
			}
		} else {
			const reader = new FileReader();
			reader.onload = () => { attachedImage = /** @type {string} */ (reader.result); };
			reader.onerror = () => { uploadError = 'Could not read image.'; attachedFileName = ''; };
			reader.readAsDataURL(file);
		}

		e.currentTarget.value = '';
	}

	/** @param {string} iso */
	function formatResetsAt(iso) {
		try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }); }
		catch { return iso; }
	}

	/** Extract display text from a message content (handles multimodal) */
	function msgText(content) {
		if (typeof content === 'string') return content;
		return content.filter(p => p.type === 'text').map(p => p.text).join(' ');
	}
</script>

<svelte:head>
	<title>Alex — Illia's Career Assistant</title>
	<meta name="description" content="Talk to Alex, Illia Pogodin's personal career assistant. Ask about his experience or check if he fits your open role." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="shell" class:breaker-trip={breakerTrip}>
	{#if breakerTrip}
		<div class="breaker-overlay" aria-hidden="true">
			<svg class="spark" viewBox="0 0 24 24" fill="none" width="48" height="48">
				<path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
			</svg>
		</div>
	{/if}
	<StarField />

	<!-- Top bar -->
	<header>
		<a href="/" class="logo">ip<span>.</span></a>
		<nav>
			<a href="/work">work</a>
			<a href="/contact">contact</a>
			<a href="/chat" class="active">chat</a>
		</nav>
	</header>

	<!-- Message area -->
	<div class="thread-wrap" bind:this={threadEl}>
		{#if messages.length === 0 && chatState === 'idle'}
			<!-- Empty state -->
			<div class="empty-state">
				<div class="empty-avatar">
					<svg viewBox="0 0 24 24" fill="none" width="28" height="28">
						<circle cx="12" cy="8" r="4" stroke="#6366F1" stroke-width="1.5"/>
						<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round"/>
					</svg>
				</div>
				<h1>Hi, I'm Alex</h1>
				<p>Illia's career assistant — ask me anything, or describe a role and I'll tell you if he's the right fit.</p>
				<div class="chips">
					{#each STARTER_CHIPS as chip}
						<button class="chip" onclick={() => sendMessage(chip)}>{chip}</button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="messages">
				{#each messages as msg}
					{#if msg.role === 'system'}
						<div class="msg-system">{msg.content}</div>
					{:else if msg.role === 'user'}
						<div class="row row-user">
							<div class="bubble bubble-user">{msgText(msg.content)}</div>
						</div>
					{:else}
						<div class="row row-assistant">
							<div class="avatar-sm">
								<svg viewBox="0 0 24 24" fill="none" width="14" height="14">
									<circle cx="12" cy="8" r="4" stroke="#6366F1" stroke-width="1.5"/>
									<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round"/>
								</svg>
							</div>
							<div class="bubble bubble-assistant">{@html formatResponse(String(msg.content))}</div>
						</div>
					{/if}
				{/each}

				{#if chatState === 'streaming'}
					<div class="row row-assistant">
						<div class="avatar-sm">
							<svg viewBox="0 0 24 24" fill="none" width="14" height="14">
								<circle cx="12" cy="8" r="4" stroke="#6366F1" stroke-width="1.5"/>
								<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round"/>
							</svg>
						</div>
						<div class="bubble bubble-assistant">
							{#if streamingContent}
								{@html formatResponse(streamingContent)}<span class="caret"></span>
							{:else}
								<span class="typing-dots"><span></span><span></span><span></span></span>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Contact CTA card -->
	{#if showContactCta}
		<div class="contact-cta">
			<div class="contact-cta-inner">
				<div class="contact-cta-text">
					<strong>Sounds like a match?</strong>
					<span>Reach out to Illia directly.</span>
				</div>
				<div class="contact-cta-actions">
					<a
						href="mailto:illia.pogodin@gmail.com?subject=Engineering%20Opportunity%20%E2%80%94%20Let%27s%20Connect&body=Hi%20Illia%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20I%27d%20love%20to%20discuss%20a%20potential%20opportunity%20with%20you.%0A%0ABest%20regards"
						class="cta-btn cta-email"
						target="_blank" rel="noopener"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
							<polyline points="22,6 12,13 2,6"/>
						</svg>
						Email Illia
					</a>
					<a
						href="https://www.linkedin.com/in/ipogodin"
						class="cta-btn cta-linkedin"
						target="_blank" rel="noopener"
					>
						<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
							<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
							<circle cx="4" cy="4" r="2"/>
						</svg>
						LinkedIn
					</a>
					<button class="cta-dismiss" onclick={() => showContactCta = false} aria-label="Dismiss">✕</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Bottom input area -->
	<div class="composer-wrap">
		{#if chatState === 'rate_limited'}
			<div class="notice notice-warn">Daily limit reached (25/day). Resets at {formatResetsAt(resetsAt)}.</div>
		{/if}
		{#if chatState === 'blocked'}
			<div class="notice notice-err">Your access has been restricted. Contact the site owner.</div>
		{/if}

		<div class="composer" class:is-disabled={chatState !== 'idle'}>
			<!-- Attachment pill inside composer -->
			{#if attachedFileName}
				<div class="attachment-pill">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
						<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.48"/>
					</svg>
					<span>{attachedFileName}</span>
					<button onclick={() => { jobDescription = ''; attachedImage = ''; attachedFileName = ''; }} aria-label="Remove attachment">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12">
							<path d="M18 6L6 18M6 6l12 12"/>
						</svg>
					</button>
				</div>
			{/if}

			<textarea
				bind:this={inputEl}
				bind:value={inputText}
				oninput={autoResize}
				onkeydown={handleKeydown}
				placeholder="Ask about Illia, or describe a role — I'll tell you if it's a match…"
				rows="1"
				disabled={chatState !== 'idle'}
				aria-label="Message input"
			></textarea>

			<div class="composer-actions">
				<label for="file-upload" class="icon-btn" class:disabled={chatState !== 'idle'} title="Attach job description (PDF or image)">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
						<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.48"/>
					</svg>
				</label>
				<input id="file-upload" type="file" accept=".pdf,image/png,image/jpeg,image/webp,image/gif" onchange={handleFileUpload} disabled={chatState !== 'idle'} />

				<button
					class="send-btn"
					onclick={() => sendMessage(inputText)}
					disabled={chatState !== 'idle' || (!inputText.trim() && !attachedFileName)}
					aria-label="Send"
				>
					{#if chatState === 'streaming'}
						<span class="send-spinner"></span>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
							<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
						</svg>
					{/if}
				</button>
			</div>
		</div>

		{#if uploadError}
			<p class="upload-error">{uploadError}</p>
		{:else}
			<p class="composer-hint">Attach a job description PDF or screenshot for fit analysis · Enter to send · Shift+Enter for new line</p>
		{/if}
	</div>
</div>

<a href="/cyberpunk" class="easter-egg" data-sveltekit-preload-data="off">◈ cybercity</a>

<style>
	/* ── Layout ── */
	:global(html), :global(body) {
		height: 100%;
		margin: 0;
		padding: 0;
		background: #09090B;
		color: #F8FAFC;
		font-family: 'DM Sans', sans-serif;
	}

	.shell {
		height: 100dvh;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}

	/* ── Header ── */
	header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 32px;
		border-bottom: 1px solid rgba(255,255,255,0.06);
		background: rgba(9,9,11,0.8);
		backdrop-filter: blur(12px);
		position: relative;
		z-index: 10;
	}
	.logo { color: #F8FAFC; text-decoration: none; font-weight: 700; font-size: 18px; font-family: 'Space Grotesk', sans-serif; }
	.logo span { color: #6366F1; }
	nav { display: flex; gap: 28px; }
	nav a { color: #52525B; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
	nav a:hover, nav a.active { color: #F8FAFC; }

	/* ── Thread ── */
	.thread-wrap {
		flex: 1;
		overflow-y: auto;
		padding: 32px 0 16px;
		scroll-behavior: smooth;
	}
	.thread-wrap::-webkit-scrollbar { width: 4px; }
	.thread-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

	/* ── Empty state ── */
	.empty-state {
		max-width: 560px;
		margin: 60px auto 0;
		padding: 0 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 12px;
	}
	.empty-avatar {
		width: 52px; height: 52px;
		border-radius: 50%;
		background: rgba(99,102,241,0.12);
		border: 1px solid rgba(99,102,241,0.25);
		display: flex; align-items: center; justify-content: center;
		margin-bottom: 4px;
	}
	.empty-state h1 {
		margin: 0;
		font-size: 22px;
		font-weight: 600;
		font-family: 'Space Grotesk', sans-serif;
		color: #F8FAFC;
	}
	.empty-state p {
		margin: 0;
		font-size: 14px;
		color: #52525B;
		line-height: 1.5;
	}
	.chips {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		margin-top: 8px;
	}
	.chip {
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 10px;
		color: #A1A1AA;
		font-size: 14px;
		padding: 11px 16px;
		text-align: left;
		cursor: pointer;
		transition: border-color 0.2s, color 0.2s, background 0.2s;
		font-family: inherit;
	}
	.chip:hover {
		border-color: rgba(99,102,241,0.35);
		color: #F8FAFC;
		background: rgba(99,102,241,0.06);
	}

	/* ── Messages ── */
	.messages {
		max-width: 720px;
		margin: 0 auto;
		padding: 0 24px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.msg-system {
		text-align: center;
		font-size: 11px;
		color: #3F3F46;
		padding: 4px 0;
	}
	.row { display: flex; gap: 10px; align-items: flex-start; }
	.row-user { justify-content: flex-end; }
	.row-assistant { justify-content: flex-start; }

	.avatar-sm {
		flex-shrink: 0;
		margin-top: 4px;
		width: 26px; height: 26px;
		border-radius: 50%;
		background: rgba(99,102,241,0.12);
		border: 1px solid rgba(99,102,241,0.2);
		display: flex; align-items: center; justify-content: center;
	}

	.bubble {
		max-width: 78%;
		line-height: 1.7;
		font-size: 15px;
	}
	.bubble-user {
		background: #4338CA;
		color: #F8FAFC;
		padding: 11px 16px;
		border-radius: 18px 18px 4px 18px;
		white-space: pre-wrap;
	}
	.bubble-assistant {
		color: #E4E4E7;
		padding: 4px 0;
		white-space: pre-wrap;
	}

	/* Blinking caret during streaming */
	.caret {
		display: inline-block;
		width: 2px; height: 1em;
		background: #6366F1;
		margin-left: 2px;
		vertical-align: text-bottom;
		animation: blink 0.9s step-end infinite;
	}
	@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

	/* Three-dot typing indicator */
	.typing-dots {
		display: inline-flex;
		gap: 4px;
		padding: 4px 2px;
	}
	.typing-dots span {
		width: 6px; height: 6px;
		border-radius: 50%;
		background: #52525B;
		animation: dot-bounce 1.2s ease-in-out infinite;
	}
	.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
	.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
	@keyframes dot-bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
	@media (prefers-reduced-motion: reduce) {
		.caret, .typing-dots span { animation: none; }
	}

	/* ── Contact CTA ── */
	.contact-cta {
		flex-shrink: 0;
		padding: 0 24px 8px;
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
	.contact-cta-inner {
		display: flex; align-items: center; justify-content: space-between; gap: 16px;
		background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08));
		border: 1px solid rgba(99,102,241,0.3);
		border-radius: 12px; padding: 14px 18px;
		flex-wrap: wrap;
	}
	.contact-cta-text { display: flex; flex-direction: column; gap: 2px; }
	.contact-cta-text strong { font-size: 14px; color: #F8FAFC; font-weight: 600; }
	.contact-cta-text span { font-size: 12px; color: #71717A; }
	.contact-cta-actions { display: flex; align-items: center; gap: 8px; }
	.cta-btn {
		display: inline-flex; align-items: center; gap: 6px;
		padding: 8px 16px; border-radius: 8px;
		font-size: 13px; font-weight: 600; text-decoration: none;
		transition: opacity 0.2s, transform 0.15s; cursor: pointer; border: none;
	}
	.cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
	.cta-email { background: #6366F1; color: #fff; }
	.cta-linkedin { background: #0A66C2; color: #fff; }
	.cta-dismiss {
		background: none; border: none; color: #52525B; cursor: pointer;
		font-size: 14px; padding: 4px 8px; transition: color 0.2s;
	}
	.cta-dismiss:hover { color: #A1A1AA; }

	/* ── Composer ── */
	.composer-wrap {
		flex-shrink: 0;
		padding: 12px 24px 20px;
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.notice {
		margin-bottom: 10px;
		padding: 10px 14px;
		border-radius: 8px;
		font-size: 13px;
		text-align: center;
	}
	.notice-warn { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); color: #fbbf24; }
	.notice-err  { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.2);  color: #f87171; }

	.composer {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 14px;
		padding: 12px 14px 10px;
		transition: border-color 0.2s;
	}
	.composer:focus-within { border-color: rgba(99,102,241,0.45); }
	.composer.is-disabled { opacity: 0.5; pointer-events: none; }

	.attachment-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: rgba(99,102,241,0.12);
		border: 1px solid rgba(99,102,241,0.25);
		border-radius: 6px;
		padding: 4px 8px;
		font-size: 12px;
		color: #818CF8;
		align-self: flex-start;
	}
	.attachment-pill button {
		background: none;
		border: none;
		color: #818CF8;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		opacity: 0.7;
		transition: opacity 0.2s;
	}
	.attachment-pill button:hover { opacity: 1; }

	.composer textarea {
		background: transparent;
		border: none;
		outline: none;
		resize: none;
		width: 100%;
		color: #F8FAFC;
		font-size: 15px;
		font-family: inherit;
		line-height: 1.6;
		min-height: 24px;
		max-height: 120px;
		overflow-y: auto;
	}
	.composer textarea::placeholder { color: #3F3F46; }

	.composer-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 6px;
	}
	#file-upload { display: none; }

	.icon-btn {
		width: 32px; height: 32px;
		border-radius: 8px;
		display: flex; align-items: center; justify-content: center;
		color: #52525B;
		cursor: pointer;
		transition: color 0.2s, background 0.2s;
	}
	.icon-btn:hover:not(.disabled) { color: #A1A1AA; background: rgba(255,255,255,0.06); }
	.icon-btn.disabled { opacity: 0.35; cursor: not-allowed; }

	.send-btn {
		width: 32px; height: 32px;
		border-radius: 8px;
		background: #6366F1;
		border: none;
		color: #fff;
		cursor: pointer;
		display: flex; align-items: center; justify-content: center;
		transition: background 0.2s, opacity 0.2s;
		flex-shrink: 0;
	}
	.send-btn:hover:not(:disabled) { background: #4F46E5; }
	.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

	.send-spinner {
		width: 14px; height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .send-spinner { animation: none; } }

	.upload-error { margin: 6px 0 0; font-size: 12px; color: #f87171; }
	.composer-hint { margin: 6px 0 0; font-size: 11px; color: #27272A; text-align: center; }

	/* ── Breaker trip error animation ── */
	.breaker-overlay {
		position: fixed;
		inset: 0;
		z-index: 999;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: breaker-flash 2.2s ease-out forwards;
	}
	@keyframes breaker-flash {
		0%   { background: rgba(251,191,36,0.25); }
		5%   { background: rgba(251,191,36,0); }
		10%  { background: rgba(251,191,36,0.18); }
		18%  { background: rgba(251,191,36,0); }
		22%  { background: rgba(251,191,36,0.08); }
		100% { background: rgba(251,191,36,0); }
	}
	.spark {
		animation: spark-pop 2.2s ease-out forwards;
		filter: drop-shadow(0 0 12px #fbbf24);
	}
	@keyframes spark-pop {
		0%   { opacity: 0; transform: scale(0.4) rotate(-20deg); }
		8%   { opacity: 1; transform: scale(1.3) rotate(8deg); }
		18%  { opacity: 1; transform: scale(1) rotate(-4deg); }
		35%  { opacity: 1; transform: scale(1.05) rotate(2deg); }
		60%  { opacity: 0.6; transform: scale(0.9); }
		100% { opacity: 0; transform: scale(0.7); }
	}

	/* Shell flicker during breaker trip */
	.breaker-trip { animation: shell-flicker 2.2s ease-out; }
	@keyframes shell-flicker {
		0%,100% { filter: brightness(1); }
		6%      { filter: brightness(2.2) saturate(0.3); }
		12%     { filter: brightness(0.7); }
		17%     { filter: brightness(1.8) saturate(0.4); }
		25%     { filter: brightness(1); }
	}

	@media (prefers-reduced-motion: reduce) {
		.breaker-overlay, .spark, .breaker-trip { animation: none; }
	}

	/* ── Easter egg ── */
	.easter-egg {
		position: fixed; bottom: 20px; right: 24px;
		font-size: 11px; color: rgba(255,255,255,0.2); text-decoration: none;
		transition: color 0.3s; z-index: 200; letter-spacing: 0.05em;
	}
	.easter-egg:hover { color: rgba(99,102,241,0.5); }

	/* ── Mobile ── */
	@media (max-width: 768px) {
		header { padding: 14px 20px; }
		.messages, .composer-wrap { padding: 0 16px; }
		.messages { padding-top: 0; gap: 20px; }
		.composer-wrap { padding: 10px 16px 16px; }
		.bubble { max-width: 88%; font-size: 14px; }
		.empty-state { margin-top: 32px; }
	}
</style>
