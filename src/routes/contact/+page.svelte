<script>
	import StarField from '$lib/components/StarField.svelte';
</script>

<svelte:head>
	<title>Contact — Illia Pogodin</title>
</svelte:head>

<StarField />

<div class="site">
	<nav>
		<a href="/" class="logo">ip<span>.</span></a>
		<div class="nav-links">
			<a href="/work">work</a>
			<a href="/contact" class="active">contact</a>
		</div>
	</nav>

	<main class="content">
		<header class="page-header">
			<p class="tagline">Google me. Then call me.</p>
			<h1>Get in touch</h1>
		</header>

		<div class="contact-grid">
			<a href="mailto:illia.pogodin@gmail.com" class="card contact-card">
				<p class="contact-label">Email</p>
				<p class="contact-value">illia.pogodin@gmail.com</p>
				<span class="contact-arrow">→</span>
			</a>

			<a href="tel:+12064844931" class="card contact-card">
				<p class="contact-label">Phone</p>
				<p class="contact-value">206.484.4931</p>
				<span class="contact-arrow">→</span>
			</a>

			<a href="https://www.linkedin.com/in/ipogodin" target="_blank" rel="noopener" class="card contact-card">
				<p class="contact-label">LinkedIn</p>
				<p class="contact-value">linkedin.com/in/ipogodin</p>
				<span class="contact-arrow">→</span>
			</a>

			<a href="/resume.pdf" target="_blank" rel="noopener" class="card contact-card">
				<p class="contact-label">Resume</p>
				<p class="contact-value">Download PDF</p>
				<span class="contact-arrow">↓</span>
			</a>
		</div>

		<div class="availability">
			<span class="avail-dot"></span>
			<p>Currently at Meta · Open to Senior / Staff opportunities · Seattle, WA</p>
		</div>
	</main>
</div>

<a href="/cyberpunk" class="easter-egg" data-sveltekit-preload-data="off">◈ cybercity</a>

<style>
	:global(body) {
		background: #09090B; color: #FAFAFA;
		font-family: 'DM Sans', sans-serif;
		-webkit-font-smoothing: antialiased;
		margin: 0; min-height: 100vh;
	}
	h1, .logo, nav a, .contact-label, .tagline { font-family: 'Space Grotesk', sans-serif; }

	.site { position: relative; z-index: 1; min-height: 100vh; }
	nav {
		position: fixed; top: 0; left: 0; right: 0; z-index: 100;
		display: flex; justify-content: space-between; align-items: center;
		padding: 22px 44px;
	}
	.logo { font-weight: 700; font-size: 18px; color: #FAFAFA; text-decoration: none; letter-spacing: -0.02em; }
	.logo span { color: #6366F1; }
	.nav-links { display: flex; gap: 32px; }
	.nav-links a { color: #71717A; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
	.nav-links a:hover, .nav-links a.active { color: #FAFAFA; }

	.content { max-width: 600px; margin: 0 auto; padding: 140px 32px 0; }
	.page-header { margin-bottom: 48px; }
	.tagline { font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6366F1; margin-bottom: 12px; }
	h1 { font-size: 48px; font-weight: 700; letter-spacing: -0.03em; }

	.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
	.card {
		background: rgba(17,17,19,0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 14px; padding: 24px 24px;
		text-decoration: none;
		display: flex; flex-direction: column;
		position: relative;
		transition: border-color 0.25s, transform 0.25s;
	}
	.card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-2px); }
	.contact-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #71717A; margin-bottom: 8px; }
	.contact-value { font-size: 15px; color: #FAFAFA; font-family: 'Space Grotesk', sans-serif; font-weight: 500; }
	.contact-arrow { position: absolute; top: 24px; right: 24px; font-size: 18px; color: #6366F1; opacity: 0; transition: opacity 0.2s; }
	.card:hover .contact-arrow { opacity: 1; }

	.availability {
		display: flex; align-items: center; gap: 10px;
		background: rgba(17,17,19,0.85);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 10px; padding: 16px 20px;
	}
	.avail-dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; animation: pulse 2s infinite; flex-shrink: 0; }
	@keyframes pulse {
		0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
		50% { opacity:0.6; box-shadow: 0 0 0 5px rgba(34,197,94,0); }
	}
	.availability p { font-size: 13px; color: #71717A; }

	.easter-egg {
		position: fixed; bottom: 22px; right: 28px;
		font-size: 11px; font-family: 'Space Grotesk', sans-serif;
		color: rgba(255,255,255,0.28); text-decoration: none;
		letter-spacing: 0.06em; transition: color 0.35s; z-index: 200;
	}
	.easter-egg:hover { color: rgba(99,102,241,0.6); }

	@media (max-width: 768px) {
		nav { padding: 16px 20px; }
		.content { padding: 100px 16px 0; }
		h1 { font-size: 36px; }
		.contact-grid { grid-template-columns: 1fr; }
	}
</style>
