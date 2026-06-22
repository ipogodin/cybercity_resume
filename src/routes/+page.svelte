<script>
	import StarField from '$lib/components/StarField.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// ── AI fit input ──
	let fitQuery = $state('');
	let fitPdfError = $state('');

	const PLACEHOLDERS = [
		'Staff Software Engineer — is Illia a good fit?',
		'Senior Backend Engineer at a fintech startup…',
		'What did Illia build at Meta?',
		'Does Illia have experience with distributed systems?',
		'Principal Engineer, platform team — check fit',
	];
	let placeholderIndex = $state(0);
	let placeholderText = $state(PLACEHOLDERS[0]);
	let placeholderFading = $state(false);

	onMount(() => {
		const phInterval = setInterval(() => {
			placeholderFading = true;
			setTimeout(() => {
				placeholderIndex = (placeholderIndex + 1) % PLACEHOLDERS.length;
				placeholderText = PLACEHOLDERS[placeholderIndex];
				placeholderFading = false;
			}, 400);
		}, 3500);

		return () => clearInterval(phInterval);
	});

	function submitFitCheck() {
		const q = fitQuery.trim();
		if (!q) return;
		goto(`/chat?q=${encodeURIComponent(q)}`);
	}

	/** @param {KeyboardEvent} e */
	function handleFitKeydown(e) {
		if (e.key === 'Enter') submitFitCheck();
	}

	const ACCEPTED = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];

	/** @param {Event & {currentTarget: HTMLInputElement}} e */
	async function handleHomePdfUpload(e) {
		fitPdfError = '';
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		if (!ACCEPTED.includes(file.type)) {
			fitPdfError = 'Supported: PDF, PNG, JPG, WEBP.';
			e.currentTarget.value = '';
			return;
		}
		if (file.size > 4 * 1024 * 1024) {
			fitPdfError = 'File too large — 4 MB max.';
			e.currentTarget.value = '';
			return;
		}
		try {
			if (file.type === 'application/pdf') {
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
				sessionStorage.setItem('fit_pdf', text.trim());
			} else {
				await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => { sessionStorage.setItem('fit_image', /** @type {string} */ (reader.result)); resolve(null); };
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
			}
			goto('/chat?from=pdf');
		} catch {
			fitPdfError = 'Could not read file.';
		}
		e.currentTarget.value = '';
	}

	// ── Skills ──
	const skills = {
		'Languages': ['Java', 'Scala', 'Python'],
		'Frameworks': ['Spring', 'Kafka', 'Hibernate', 'Liquibase', 'JPA'],
		'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
		'Platform': ['Distributed Systems', 'Fleet Allocation', 'Microservices', 'Kubernetes'],
		'Practices': ['Platform Architecture', 'Observability', 'Reliability', 'TDD', 'API Design']
	};

	// ── Career timeline (proportional widths, 2009–2026) ──
	const timelineSegments = [
		{ label: 'Earlier',    short: '2009–2016', pct: 41, dim: true,  current: false },
		{ label: 'IGT',        short: '2016–18',   pct: 12, dim: false, current: false },
		{ label: 'Wargaming',  short: '2018–19',   pct:  6, dim: false, current: false },
		{ label: 'Salesforce', short: '2019–23',   pct: 24, dim: false, current: false },
		{ label: 'Google',     short: '2024',       pct:  6, dim: false, current: false },
		{ label: 'Meta',       short: '2025–now',  pct: 11, dim: false, current: true  },
	];

	// ── Side projects ──
	const sideProjects = [
		{
			name: 'Dwarfer',
			description: 'Link shortener for everyday use + YouTube GIF platform',
			url: 'https://dwarfer.link',
			label: 'dwarfer.link'
		},
		{
			name: 'Pray Game',
			description: 'Browser-native video game, playable in any tab',
			url: 'https://tea43.github.io/pray-game/',
			label: 'pray-game'
		},
		{
			name: 'Plate Signs',
			description: 'License plates as custom decorative signs',
			url: 'https://platesigns.vercel.app/',
			label: 'platesigns.vercel.app'
		},
		{
			name: 'CyberCity',
			description: 'Cyberpunk interactive version of this resume',
			url: '/cyberpunk',
			label: 'pogodin.ai/cyberpunk',
			noPreload: true,
			reload: true
		},
		{
			name: 'Gigilo',
			description: 'GitHub activity board as a 2D message canvas',
			url: 'https://github.com/ipogodin/gigilo',
			label: 'github/gigilo'
		}
	];
</script>

<svelte:head>
	<title>Illia Pogodin — Software Engineer</title>
</svelte:head>

<StarField />

<div class="site">

	<!-- Navbar -->
	<nav>
		<a href="/" class="logo">ip<span>.</span></a>
		<div class="nav-links">
			<a href="/work">work</a>
			<a href="/contact">contact</a>
			<a href="/chat">chat</a>
		</div>
	</nav>

	<!-- Bento grid -->
	<main class="bento">

		<!-- Hero -->
		<div class="card card-hero">
			<div class="eyebrow">
				<span class="pulse-dot"></span>
				Available for Senior / Staff roles
			</div>
			<h1>Illia<br>Pogodin</h1>
			<p class="hero-title">Software Engineer</p>
			<p class="hero-bio">
				L5 Software Engineer at Meta · 15+ years building distributed, mission-critical platforms.
				Targeting Staff-level roles. Meta · Google · Salesforce.
			</p>
			<div class="btns">
				<a href="/work" class="btn-primary">View Work →</a>
				<a href="/resume.pdf" target="_blank" rel="noopener" class="btn-ghost">Resume PDF</a>
			</div>
		</div>

		<!-- Meta — clickable, links to /work -->
		<a href="/work" class="card card-meta">
			<div class="company-badge current">
				<span class="live-dot"></span>Current
			</div>
			<h3>Meta</h3>
			<p class="role">L5 Software Engineer</p>
			<p class="period accent">2025 – present</p>
			<p class="card-detail">Tupperware Allocator · fleet allocation platform</p>
			<span class="card-arrow">View details →</span>
		</a>

		<!-- Google — clickable, links to /work -->
		<a href="/work" class="card card-google">
			<div class="company-badge past">Previous</div>
			<h3>Google</h3>
			<p class="role">Senior Software Engineer</p>
			<p class="period muted">2024</p>
			<p class="card-detail">Google Messages · RCS · 1.6B users</p>
			<span class="card-arrow">View details →</span>
		</a>

		<!-- AI Chat card — row 3, full width -->
		<div class="card card-chat">
			<div class="chat-card-inner">
				<div class="chat-card-left">
					<div class="chat-ai-badge">
						<span class="ai-dot"></span>
						AI assistant
					</div>
					<p class="chat-card-headline">Ask about Illia's experience<br>or check fit for your role</p>
					<a href="/chat" class="chat-card-link">Open full chat →</a>
				</div>
				<div class="chat-card-right">
					<div class="chat-input-wrap">
						<input
							type="text"
							class="chat-card-input"
							class:placeholder-fading={placeholderFading}
							bind:value={fitQuery}
							placeholder={placeholderText}
							onkeydown={handleFitKeydown}
							aria-label="Ask about Illia or check fit"
						/>
						<div class="chat-card-actions">
							<label for="home-pdf-upload" class="chat-attach-btn" title="Attach job description (PDF or screenshot)">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
									<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.48"/>
								</svg>
							</label>
							<input id="home-pdf-upload" type="file" accept=".pdf,image/png,image/jpeg,image/webp,image/gif" onchange={handleHomePdfUpload} />
							<button class="chat-send-btn" onclick={submitFitCheck} disabled={!fitQuery.trim()} aria-label="Send">→</button>
						</div>
					</div>
					{#if fitPdfError}<p class="fit-pdf-error">{fitPdfError}</p>{/if}
					<p class="chat-card-hint">Attach a job description PDF or screenshot for instant fit analysis</p>
				</div>
			</div>
		</div>

		<!-- Career timeline — row 4, full width -->
		<div class="card card-timeline">
			<div class="tl-header">
				<p class="section-label">Career · 2009 – present</p>
				<a href="/work" class="tl-detail-link">Full history →</a>
			</div>
			<div class="tl-track">
				{#each timelineSegments as seg}
					<div
						class="tl-seg"
						class:tl-seg-dim={seg.dim}
						class:tl-seg-current={seg.current}
						style="flex: {seg.pct}"
						title="{seg.label} · {seg.short}"
					>
						<span class="tl-seg-label">{seg.label}</span>
						<span class="tl-seg-period">{seg.short}</span>
					</div>
				{/each}
			</div>
			<div class="tl-axis">
				<span>2009</span>
				<span>2013</span>
				<span>2016</span>
				<span>2019</span>
				<span>2023</span>
				<span>now</span>
			</div>
		</div>

		<!-- Skills — row 5, col 1-2 -->
		<div class="card card-skills">
			<p class="card-label">Skills</p>
			<div class="tag-groups">
				{#each Object.entries(skills) as [, tags]}
					{#each tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				{/each}
			</div>
		</div>

		<!-- Contact + Location combined — row 5, col 3 -->
		<div class="card card-contact-loc">
			<div class="cl-loc">
				<div class="loc-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18" aria-hidden="true">
						<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
						<circle cx="12" cy="9" r="2.5"/>
					</svg>
				</div>
				<div>
					<p class="loc-name">Seattle, WA</p>
					<p class="loc-sub">Open to Senior / Staff opportunities</p>
				</div>
			</div>
			<div class="cl-divider"></div>
			<p class="contact-email">illia@pogodin.ai</p>
			<p class="contact-phone">206.484.4931</p>
			<div class="social">
				<a href="https://www.linkedin.com/in/ipogodin" target="_blank" rel="noopener" class="social-btn">LinkedIn</a>
				<a href="/resume.pdf" target="_blank" rel="noopener" class="social-btn">Resume</a>
			</div>
		</div>

		<!-- Side Projects — row 6, full width -->
		<div class="card card-side-projects">
			<div class="sp-header">
				<p class="section-label">Side Projects</p>
			</div>
			<div class="sp-grid">
				{#each sideProjects as proj}
					<a
						href={proj.url}
						target={proj.url.startsWith('http') ? '_blank' : undefined}
						rel={proj.url.startsWith('http') ? 'noopener noreferrer' : undefined}
						data-sveltekit-preload-data={proj.noPreload ? 'off' : undefined}
						data-sveltekit-reload={proj.reload ? true : undefined}
						class="sp-item"
					>
						<div class="sp-item-top">
							<p class="sp-name">{proj.name}</p>
							<span class="sp-label">{proj.label}</span>
						</div>
						<p class="sp-desc">{proj.description}</p>
					</a>
				{/each}
			</div>
		</div>

		<!-- Education — row 7, full width, bottom -->
		<div class="card card-edu">
			<p class="section-label">Education</p>
			<p class="edu-degree">M.S. Applied Mathematics</p>
			<p class="edu-school">National University of Ukraine · Faculty of Cybernetics</p>
		</div>

	</main>
</div>

<style>
	:global(body) {
		background: #09090B;
		color: #FAFAFA;
		font-family: 'DM Sans', sans-serif;
		-webkit-font-smoothing: antialiased;
		margin: 0;
		min-height: 100vh;
	}

	h1, h2, h3, .logo, nav a, .eyebrow, .section-label, .card-label,
	.company-badge, .tl-seg-label, .edu-degree, .sp-name,
	.loc-name, .hero-title { font-family: 'Space Grotesk', sans-serif; }

	.site {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		padding-bottom: 60px;
	}

	/* ── Navbar ── */
	nav {
		position: fixed;
		top: 0; left: 0; right: 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22px 44px;
	}
	.logo {
		font-weight: 700;
		font-size: 18px;
		color: #FAFAFA;
		text-decoration: none;
		letter-spacing: -0.02em;
	}
	.logo span { color: #6366F1; }
	.nav-links { display: flex; gap: 32px; }
	.nav-links a {
		color: #71717A;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.02em;
		transition: color 0.2s;
	}
	.nav-links a:hover { color: #FAFAFA; }

	/* ── Bento ── */
	.bento {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		max-width: 1100px;
		margin: 0 auto;
		padding: 104px 32px 0;
	}

	/* ── Card base ── */
	.card {
		background: rgba(17,17,19,0.85);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 14px;
		padding: 28px;
		transition: border-color 0.25s;
		display: block;
	}

	/* Lift effect only for actual links */
	a.card {
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		transition: border-color 0.25s, transform 0.25s;
	}
	a.card:hover {
		border-color: rgba(99,102,241,0.4);
		transform: translateY(-2px);
	}
	.card:not(a):hover {
		border-color: rgba(255,255,255,0.12);
	}

	/* ── Hero ── */
	.card-hero {
		grid-column: 1 / 3;
		grid-row: 1 / 3;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: 380px;
		padding: 44px;
		background:
			radial-gradient(ellipse at 15% 85%, rgba(99,102,241,0.1) 0%, transparent 55%),
			rgba(17,17,19,0.85);
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #6366F1;
		margin-bottom: 16px;
	}
	.pulse-dot {
		width: 6px; height: 6px;
		border-radius: 50%;
		background: #22C55E;
		animation: pulse 2s infinite;
	}
	@keyframes pulse {
		0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
		50% { opacity:0.6; box-shadow: 0 0 0 5px rgba(34,197,94,0); }
	}
	h1 {
		font-size: 54px;
		font-weight: 700;
		line-height: 1.04;
		letter-spacing: -0.035em;
		margin-bottom: 8px;
	}
	.hero-title { font-size: 17px; color: #71717A; font-weight: 400; margin-bottom: 16px; }
	.hero-bio { font-size: 14px; color: #A1A1AA; line-height: 1.75; max-width: 460px; margin-bottom: 32px; }

	.btns { display: flex; gap: 12px; flex-wrap: wrap; }
	.btn-primary {
		background: #FAFAFA; color: #09090B;
		border: none; border-radius: 8px;
		padding: 11px 22px;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 14px; font-weight: 600;
		text-decoration: none;
		transition: opacity 0.2s, transform 0.2s;
		cursor: pointer;
	}
	.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
	.btn-ghost {
		background: transparent; color: #71717A;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 8px; padding: 11px 22px;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 14px; font-weight: 500;
		text-decoration: none;
		transition: border-color 0.2s, color 0.2s;
	}
	.btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #FAFAFA; }

	/* ── Company cards ── */
	.card-meta {
		grid-column: 3; grid-row: 1;
		background:
			radial-gradient(ellipse at 85% 15%, rgba(99,102,241,0.12) 0%, transparent 65%),
			rgba(17,17,19,0.85);
		display: flex;
		flex-direction: column;
	}
	.card-google {
		grid-column: 3; grid-row: 2;
		display: flex;
		flex-direction: column;
	}
	.card-arrow {
		margin-top: auto;
		padding-top: 14px;
		font-size: 12px;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 500;
		color: #6366F1;
		opacity: 0;
		transition: opacity 0.2s;
	}
	a.card:hover .card-arrow { opacity: 1; }

	.company-badge {
		display: inline-flex; align-items: center; gap: 7px;
		border-radius: 6px; padding: 4px 10px;
		font-size: 11px; font-weight: 600;
		letter-spacing: 0.06em; text-transform: uppercase;
		margin-bottom: 14px;
		width: fit-content;
	}
	.company-badge.current {
		background: rgba(99,102,241,0.15);
		border: 1px solid rgba(99,102,241,0.3);
		color: #6366F1;
	}
	.company-badge.past {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		color: #71717A;
	}
	.live-dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: #22C55E; animation: pulse 2s infinite;
	}
	h3 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
	.role { font-size: 13px; color: #71717A; margin-bottom: 4px; }
	.period { font-size: 12px; font-weight: 500; margin-bottom: 6px; }
	.period.accent { color: #6366F1; }
	.period.muted { color: #71717A; }
	.card-detail { font-size: 12px; color: #52525B; }

	/* ── AI Chat card ── */
	.card-chat {
		grid-column: 1 / -1;
		grid-row: 3;
		padding: 28px 32px;
		position: relative;
		overflow: hidden;
		background:
			linear-gradient(#111113, #111113) padding-box,
			linear-gradient(var(--angle, 0deg), rgba(99,102,241,0.7), rgba(139,92,246,0.3), rgba(99,102,241,0.1), rgba(99,102,241,0.7)) border-box;
		border: 1px solid transparent;
		animation: border-spin 4s linear infinite;
	}
	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}
	@keyframes border-spin {
		to { --angle: 360deg; }
	}
	@media (prefers-reduced-motion: reduce) {
		.card-chat {
			animation: none;
			border: 1px solid rgba(99,102,241,0.25);
		}
		.pulse-dot, .live-dot, .ai-dot { animation: none; }
	}

	.chat-card-inner { display: flex; align-items: center; gap: 40px; }
	.chat-card-left { flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; min-width: 220px; }
	.chat-ai-badge {
		display: inline-flex; align-items: center; gap: 7px;
		font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
		color: #818CF8;
	}
	.ai-dot {
		width: 6px; height: 6px; border-radius: 50%; background: #818CF8;
		box-shadow: 0 0 6px rgba(129,140,248,0.8);
		animation: ai-pulse 2s ease-in-out infinite;
	}
	@keyframes ai-pulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.5; transform: scale(0.8); }
	}
	.chat-card-headline {
		font-size: 18px; font-weight: 600; font-family: 'Space Grotesk', sans-serif;
		color: #FAFAFA; line-height: 1.4;
	}
	.chat-card-link { font-size: 13px; color: #6366F1; text-decoration: none; transition: color 0.2s; }
	.chat-card-link:hover { color: #818CF8; }

	.chat-card-right { flex: 1; display: flex; flex-direction: column; gap: 8px; }
	.chat-input-wrap {
		display: flex; align-items: center;
		background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
		border-radius: 10px; overflow: hidden; transition: border-color 0.2s;
	}
	.chat-input-wrap:focus-within { border-color: rgba(99,102,241,0.5); }
	.chat-card-input {
		flex: 1; background: transparent; border: none; outline: none;
		color: #FAFAFA; font-size: 14px; font-family: 'DM Sans', sans-serif;
		padding: 13px 16px;
		transition: opacity 0.35s ease-out;
	}
	.chat-card-input.placeholder-fading::placeholder { opacity: 0; }
	.chat-card-input::placeholder { color: #52525B; transition: opacity 0.35s ease-in; }
	.chat-card-actions { display: flex; align-items: center; padding-right: 6px; }
	.chat-attach-btn {
		display: flex; align-items: center; justify-content: center;
		width: 34px; height: 34px; color: #52525B; cursor: pointer;
		border-radius: 6px; transition: color 0.2s, background 0.2s;
	}
	.chat-attach-btn:hover { color: #A1A1AA; background: rgba(255,255,255,0.06); }
	#home-pdf-upload { display: none; }
	.chat-send-btn {
		width: 34px; height: 34px; background: #6366F1; border: none;
		border-radius: 7px; color: #fff; font-size: 15px; cursor: pointer;
		transition: background 0.2s; display: flex; align-items: center; justify-content: center;
	}
	.chat-send-btn:hover:not(:disabled) { background: #4F46E5; }
	.chat-send-btn:disabled { background: rgba(99,102,241,0.25); cursor: default; }
	.fit-pdf-error { font-size: 12px; color: #f87171; }
	.chat-card-hint { font-size: 12px; color: #3F3F46; }

	/* ── Career Timeline ── */
	.card-timeline { grid-column: 1 / -1; grid-row: 4; padding: 24px 32px; }
	.tl-header {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: 14px;
	}
	.section-label {
		font-size: 11px; font-weight: 600;
		letter-spacing: 0.12em; text-transform: uppercase;
		color: #71717A; margin: 0;
	}
	.tl-detail-link {
		font-size: 12px; font-weight: 500; color: #6366F1;
		text-decoration: none; transition: color 0.2s;
	}
	.tl-detail-link:hover { color: #818CF8; }

	.tl-track {
		display: flex;
		height: 68px;
		gap: 3px;
		border-radius: 10px;
		overflow: hidden;
	}
	.tl-seg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 12px;
		background: rgba(99,102,241,0.35);
		border-radius: 8px;
		overflow: hidden;
		min-width: 0;
		transition: background 0.2s;
		cursor: default;
	}
	.tl-seg-dim {
		background: rgba(255,255,255,0.05);
	}
	.tl-seg-dim:hover { background: rgba(255,255,255,0.09); }
	.tl-seg:not(.tl-seg-dim):not(.tl-seg-current):hover { background: rgba(99,102,241,0.5); }
	.tl-seg-current {
		background: #6366F1;
	}
	.tl-seg-current:hover { background: #4F46E5; }
	.tl-seg-label {
		font-size: 11px; font-weight: 600;
		font-family: 'Space Grotesk', sans-serif;
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
		color: #FAFAFA;
	}
	.tl-seg-period {
		font-size: 10px; color: rgba(255,255,255,0.55);
		white-space: nowrap; overflow: hidden;
		font-family: 'Space Grotesk', sans-serif;
		margin-top: 2px;
	}
	.tl-axis {
		display: flex; justify-content: space-between;
		margin-top: 8px;
		padding: 0 2px;
		font-size: 10px; color: #3F3F46;
		font-family: 'Space Grotesk', sans-serif;
	}

	/* ── Skills — row 5, col 1-2 ── */
	.card-skills { grid-column: 1 / 3; grid-row: 5; }
	.card-label {
		font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
		text-transform: uppercase; color: #71717A; margin-bottom: 14px;
	}
	.tag-groups { display: flex; flex-wrap: wrap; gap: 6px; }
	.tag {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 6px; padding: 4px 10px;
		font-size: 12px; color: #A1A1AA;
		font-family: 'Space Grotesk', sans-serif; font-weight: 500;
	}

	/* ── Contact + Location combined — row 5, col 3 ── */
	.card-contact-loc { grid-column: 3; grid-row: 5; }
	.cl-loc {
		display: flex; align-items: center; gap: 14px;
		margin-bottom: 14px;
	}
	.loc-icon {
		width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
		background: rgba(99,102,241,0.12);
		border: 1px solid rgba(99,102,241,0.2);
		display: flex; align-items: center; justify-content: center;
		color: #6366F1;
	}
	.loc-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; margin-bottom: 2px; }
	.loc-sub { font-size: 12px; color: #71717A; }
	.cl-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 14px; }
	.contact-email { font-size: 13px; color: #6366F1; font-family: 'Space Grotesk', sans-serif; margin-bottom: 4px; }
	.contact-phone { font-size: 13px; color: #71717A; margin-bottom: 14px; }
	.social { display: flex; gap: 8px; flex-wrap: wrap; }
	.social-btn {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 6px; padding: 5px 12px;
		font-size: 12px; color: #71717A;
		font-family: 'Space Grotesk', sans-serif; font-weight: 500;
		text-decoration: none;
		transition: border-color 0.2s, color 0.2s;
	}
	.social-btn:hover { border-color: rgba(255,255,255,0.2); color: #FAFAFA; }

	/* ── Side Projects — row 6, full width ── */
	.card-side-projects { grid-column: 1 / -1; grid-row: 6; }
	.sp-header {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: 16px;
	}
.sp-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 10px;
	}
	.sp-item {
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 10px;
		padding: 16px;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition: border-color 0.2s, background 0.2s, transform 0.2s;
	}
	.sp-item:hover {
		border-color: rgba(99,102,241,0.3);
		background: rgba(99,102,241,0.06);
		transform: translateY(-2px);
	}
	.sp-item-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
	}
	.sp-name {
		font-weight: 600; font-size: 14px;
		font-family: 'Space Grotesk', sans-serif;
	}
	.sp-label {
		font-size: 10px; color: #6366F1;
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
		font-family: 'Space Grotesk', sans-serif;
	}
	.sp-desc { font-size: 12px; color: #71717A; line-height: 1.55; }

	/* ── Education — row 7, full width, bottom ── */
	.card-edu { grid-column: 1 / -1; grid-row: 7; padding: 22px 32px; }
	.edu-degree {
		font-family: 'Space Grotesk', sans-serif; font-weight: 600;
		font-size: 15px; margin-bottom: 4px; margin-top: 0;
	}
	.edu-school { font-size: 13px; color: #71717A; line-height: 1.5; }

/* ── Mobile ── */
	@media (max-width: 768px) {
		nav { padding: 16px 20px; }
		.bento { grid-template-columns: 1fr 1fr; padding: 80px 16px 0; gap: 10px; }

		.card-hero { grid-column: 1 / 3; grid-row: 1; min-height: auto; padding: 28px; }
		h1 { font-size: 36px; }
		.hero-bio { display: none; }

		.card-meta   { grid-column: 1; grid-row: 2; }
		.card-google { grid-column: 2; grid-row: 2; }

		.card-chat { grid-column: 1 / 3; grid-row: 3; padding: 20px; }
		.chat-card-inner { flex-direction: column; gap: 16px; }
		.chat-card-left { min-width: unset; }
		.chat-card-headline { font-size: 16px; }

		.card-timeline { grid-column: 1 / 3; grid-row: 4; padding: 18px 20px; }
		.tl-track { height: 56px; }
		.tl-seg-label { font-size: 10px; }
		.tl-seg-period { display: none; }

		.card-skills      { grid-column: 1 / 3; grid-row: 5; }
		.card-contact-loc { grid-column: 1 / 3; grid-row: 6; }

		.card-side-projects { grid-column: 1 / 3; grid-row: 7; }
		.sp-grid { grid-template-columns: 1fr 1fr; }

		.card-edu { grid-column: 1 / 3; grid-row: 8; }
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.sp-grid { grid-template-columns: repeat(3, 1fr); }
	}
</style>
