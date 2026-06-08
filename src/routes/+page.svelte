<script>
	import StarField from '$lib/components/StarField.svelte';

	const experience = [
		{
			company: 'Meta', role: 'L5 Software Engineer', period: '2025 – present',
			current: true,
			project: 'Tupperware Allocator — Meta\'s internal Kubernetes-like fleet allocation platform',
			highlights: [
				'$700K+ cost reduction in 2026 via fleet-rebalancing strategy for AI-training placement',
				'Prevented ~25K task interruptions/hr for high-memory, multi-core AI workloads',
				'Introduced production observability and placement diagnostics adopted org-wide'
			]
		},
		{
			company: 'Google', role: 'Senior Software Engineer (TVC)', period: '2024',
			current: false,
			project: 'Google Messages — RCS infrastructure serving 1.6B active users',
			highlights: [
				'Delivered lawful-intercept integration for RCS messaging at compliance-sensitive scale',
				'Backend optimisation for onboarding ~300M Apple users into Google\'s RCS infrastructure'
			]
		},
		{
			company: 'Salesforce', role: 'Senior Member of Technical Staff', period: '2019 – 2023',
			current: false,
			project: 'Revenue Cloud — GraphQL & REST API platform',
			highlights: [
				'Architected GraphQL API platform for Airbnb, Bank of America; built modular extension system',
				'Security champion and technical mentor across 15–25 engineers',
				'Saved ~200 engineering hours/year by redesigning phishing-training infrastructure'
			]
		},
		{
			company: 'Wargaming', role: 'Senior SDE', period: '2018 – 2019',
			current: false,
			project: 'Game platform services',
			highlights: [
				'Rebuilt promotion engine, business-object validation, pricing configurability, and product-definition DB structures'
			]
		},
		{
			company: 'IGT', role: 'SDE III', period: '2016 – 2018',
			current: false,
			project: 'Gaming platform microservices',
			highlights: [
				'Redesigned key platform service, reducing latency by 10×',
				'Migrated OSGI monolith to unified Scala; delivered company-wide metrics library'
			]
		}
	];

	const prior = [
		{ company: 'Deutsche Bank', period: '2015 – 2016', note: 'Investment fund platform optimisation (+20% speed); led SVN→Git migration' },
		{ company: 'Belleron (via DAXX)', period: '2014 – 2015', note: 'Storm-based distributed anti-fraud system from scratch for a major bank' },
		{ company: 'Alertme (via DataArt)', period: '2012 – 2014', note: 'High-throughput REST API for smart home startup (scheduling, devices, notifications)' },
		{ company: 'Ocado TNA (via DataArt)', period: '2012 – 2014', note: 'Time management system for a major UK retailer' },
		{ company: 'E-Motion', period: '2011 – 2012', note: 'Call management system; UI rework cut backend calls by 2.5×' },
		{ company: 'CubicStudio', period: '2009 – 2011', note: 'Junior — pawnbroker marketplace system (Out of Pawn)' }
	];

	const skills = {
		'Languages': ['Java', 'Scala', 'Python'],
		'Frameworks': ['Spring', 'Kafka', 'Hibernate', 'Liquibase', 'JPA'],
		'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
		'Platform': ['Distributed Systems', 'Fleet Allocation', 'Microservices', 'Kubernetes'],
		'Practices': ['Platform Architecture', 'Observability', 'Reliability', 'TDD', 'API Design']
	};
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
				Principal / Staff engineer with 15+ years building distributed, mission-critical platforms.
				Meta · Google · Salesforce.
			</p>
			<div class="btns">
				<a href="/work" class="btn-primary">View Work →</a>
				<a href="/resume.pdf" target="_blank" rel="noopener" class="btn-ghost">Resume PDF</a>
			</div>
		</div>

		<!-- Meta -->
		<div class="card card-meta">
			<div class="company-badge current">
				<span class="live-dot"></span>Current
			</div>
			<h3>Meta</h3>
			<p class="role">L5 Software Engineer</p>
			<p class="period accent">2025 – present</p>
			<p class="card-detail">Tupperware Allocator · fleet allocation platform</p>
		</div>

		<!-- Google -->
		<div class="card card-google">
			<div class="company-badge past">Previous</div>
			<h3>Google</h3>
			<p class="role">Senior Software Engineer</p>
			<p class="period muted">2024</p>
			<p class="card-detail">Google Messages · RCS · 1.6B users</p>
		</div>

		<!-- Career timeline -->
		<div class="card card-timeline">
			<p class="section-label">Career · 2009 – present</p>
			<div class="timeline">
				{#each experience as job}
				<div class="tl-item">
					<p class="tl-company">{job.company}</p>
					<p class="tl-years">{job.period}</p>
					<div class="tl-bar-wrap">
						<div class="tl-bar" style="width:{job.current ? '20%' : job.company === 'Salesforce' ? '65%' : job.company === 'Wargaming' ? '14%' : job.company === 'Google' ? '7%' : '25%'}; opacity:{job.current ? '0.9' : '0.45'}"></div>
					</div>
				</div>
				{/each}
				<div class="tl-item">
					<p class="tl-company">Earlier</p>
					<p class="tl-years">2009 – 2016</p>
					<div class="tl-bar-wrap"><div class="tl-bar" style="width:100%;opacity:0.2"></div></div>
				</div>
			</div>
		</div>

		<!-- Location -->
		<div class="card card-location">
			<div class="loc-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
					<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
					<circle cx="12" cy="9" r="2.5"/>
				</svg>
			</div>
			<div>
				<p class="loc-name">Seattle, WA</p>
				<p class="loc-sub">Open to Senior / Staff opportunities</p>
			</div>
		</div>

		<!-- Education -->
		<div class="card card-edu">
			<p class="section-label">Education</p>
			<p class="edu-degree">M.S. Applied Mathematics</p>
			<p class="edu-school">National University of Ukraine<br>Faculty of Cybernetics</p>
		</div>

		<!-- Skills -->
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

		<!-- Projects count -->
		<div class="card card-projects">
			<p class="card-label">Work</p>
			<p class="proj-count">5+</p>
			<p class="proj-sub">companies at scale</p>
			<a href="/work" class="proj-link">Full history →</a>
		</div>

		<!-- Contact -->
		<div class="card card-contact">
			<p class="card-label">Contact</p>
			<p class="contact-email">illia.pogodin@gmail.com</p>
			<p class="contact-phone">206.484.4931</p>
			<div class="social">
				<a href="https://www.linkedin.com/in/ipogodin" target="_blank" rel="noopener" class="social-btn">LinkedIn</a>
				<a href="/resume.pdf" target="_blank" rel="noopener" class="social-btn">Resume</a>
			</div>
		</div>

	</main>
</div>

<a href="/cyberpunk" class="easter-egg" data-sveltekit-preload-data="off">◈ cybercity</a>

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
	.company-badge, .tl-company, .edu-degree, .proj-count, .proj-link,
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
		transition: border-color 0.25s, transform 0.25s;
	}
	.card:hover {
		border-color: rgba(99,102,241,0.35);
		transform: translateY(-2px);
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
	}
	.card-google { grid-column: 3; grid-row: 2; }

	.company-badge {
		display: inline-flex; align-items: center; gap: 7px;
		border-radius: 6px; padding: 4px 10px;
		font-size: 11px; font-weight: 600;
		letter-spacing: 0.06em; text-transform: uppercase;
		margin-bottom: 14px;
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

	/* ── Timeline ── */
	.card-timeline { grid-column: 1 / 4; grid-row: 3; padding: 28px 32px; }
	.section-label {
		font-size: 11px; font-weight: 600;
		letter-spacing: 0.12em; text-transform: uppercase;
		color: #71717A; margin-bottom: 18px;
	}
	.timeline { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
	.tl-item {
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 10px; padding: 14px 16px;
		transition: border-color 0.2s, background 0.2s;
	}
	.tl-item:hover {
		background: rgba(99,102,241,0.06);
		border-color: rgba(99,102,241,0.2);
	}
	.tl-company { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; margin-bottom: 3px; }
	.tl-years { font-size: 11px; color: #71717A; font-family: 'Space Grotesk', sans-serif; margin-bottom: 8px; }
	.tl-bar-wrap { height: 2px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
	.tl-bar { height: 100%; border-radius: 2px; background: #6366F1; }

	/* ── Location ── */
	.card-location {
		grid-column: 1 / 3; grid-row: 4;
		display: flex; align-items: center; gap: 18px; padding: 22px 28px;
	}
	.loc-icon {
		width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
		background: rgba(99,102,241,0.12);
		border: 1px solid rgba(99,102,241,0.2);
		display: flex; align-items: center; justify-content: center;
		color: #6366F1;
	}
	.loc-name { font-weight: 600; font-size: 16px; margin-bottom: 2px; }
	.loc-sub { font-size: 13px; color: #71717A; }

	/* ── Education ── */
	.card-edu { grid-column: 3; grid-row: 4; padding: 22px 28px; }
	.edu-degree { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; margin-bottom: 4px; }
	.edu-school { font-size: 12px; color: #71717A; line-height: 1.5; }

	/* ── Bottom row ── */
	.card-skills   { grid-column: 1; grid-row: 5; }
	.card-projects { grid-column: 2; grid-row: 5; }
	.card-contact  { grid-column: 3; grid-row: 5; }

	.card-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #71717A; margin-bottom: 14px; }
	.tag-groups { display: flex; flex-wrap: wrap; gap: 6px; }
	.tag {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 6px; padding: 4px 10px;
		font-size: 12px; color: #A1A1AA;
		font-family: 'Space Grotesk', sans-serif; font-weight: 500;
	}
	.proj-count { font-size: 38px; font-weight: 700; line-height: 1; margin-bottom: 2px; }
	.proj-sub { font-size: 13px; color: #71717A; margin-bottom: 14px; }
	.proj-link { font-size: 13px; font-weight: 500; color: #6366F1; text-decoration: none; }
	.proj-link:hover { text-decoration: underline; }
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

	/* ── Easter egg ── */
	.easter-egg {
		position: fixed; bottom: 22px; right: 28px;
		font-size: 11px; font-family: 'Space Grotesk', sans-serif;
		color: rgba(255,255,255,0.28); text-decoration: none;
		letter-spacing: 0.06em; transition: color 0.35s; z-index: 200;
	}
	.easter-egg:hover { color: rgba(99,102,241,0.6); }

	/* ── Mobile ── */
	@media (max-width: 768px) {
		nav { padding: 16px 20px; }
		.bento { grid-template-columns: 1fr 1fr; padding: 80px 16px 0; gap: 10px; }
		.card-hero { grid-column: 1 / 3; grid-row: 1; min-height: auto; padding: 28px; }
		h1 { font-size: 36px; }
		.hero-bio { display: none; }
		.card-meta { grid-column: 1; grid-row: 2; }
		.card-google { grid-column: 2; grid-row: 2; }
		.card-timeline { grid-column: 1 / 3; grid-row: 3; padding: 20px; }
		.timeline { grid-template-columns: repeat(3, 1fr); }
		.card-location { grid-column: 1 / 3; grid-row: 4; }
		.card-edu { grid-column: 1 / 3; grid-row: 5; }
		.card-skills { grid-column: 1 / 3; grid-row: 6; }
		.card-projects { grid-column: 1; grid-row: 7; }
		.card-contact { grid-column: 2; grid-row: 7; }
	}
</style>
