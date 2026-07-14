<script>
	import StarField from '$lib/components/StarField.svelte';

	const experience = [
		{
			company: 'Meta',
			role: 'L5 Software Engineer',
			period: '2025 – present',
			current: true,
			project: 'Tupperware Allocator — Meta\'s internal Kubernetes-like fleet allocation and placement platform',
			highlights: [
				'Drove fleet-rebalancing strategy for Meta\'s large-scale compute allocator, improving AI-training placement efficiency and contributing to $700K+ cost reduction in 2026 with multi-million-dollar annualized potential.',
				'Optimized non-guaranteed capacity allocation across Meta\'s fleet, preventing ~25K task interruptions/hr for high-memory, multi-core workloads averaging ~55 GB RAM and 16 physical CPU cores.',
				'Improved allocator reliability by introducing production observability, placement diagnostics, and interruption-analysis workflows that exposed fleet-level inefficiencies before broad AI-training workload escalation.',
				'Built debugging and diagnostics workflows adopted by on-call engineers, reducing time-to-diagnosis for placement and interruption issues affecting high-value AI workloads.',
				'Created a recurring operational review forum that standardized incident analysis and on-call practices across the team.'
			]
		},
		{
			company: 'Google',
			role: 'Senior Software Engineer (TVC)',
			period: '2024',
			current: false,
			project: 'Google Messages — RCS infrastructure serving 1.6B active users',
			highlights: [
				'Designed and delivered lawful-intercept integration for RCS messaging in partnership with legal and backend infrastructure teams, supporting compliance-sensitive production flows.',
				'Delivered backend optimization for the onboarding of ~300M Apple users into Google\'s RCS infrastructure, improving cross-platform integration readiness at scale.',
				'Identified and resolved edge-case implementation flaws in RCS backend flows; simplified integration paths to reduce operational risk during large-scale customer migration.'
			]
		},
		{
			company: 'Salesforce',
			role: 'Senior Member of Technical Staff',
			period: '2019 – 2023',
			current: false,
			project: 'Revenue Cloud — GraphQL & REST API platform',
			highlights: [
				'Architected and delivered GraphQL API platform capabilities for enterprise customers including Airbnb and Bank of America; designed a modular extension system enabling internal teams to inject custom functionality and revenue-generating filters.',
				'Established testing, monitoring, and release standards for REST and GraphQL APIs; served as security champion and technical mentor across 15–25 engineers, raising delivery quality for customer-facing platform APIs.',
				'Redesigned company-wide phishing-training infrastructure, eliminating critical security gaps and saving ~200 engineering hours/year through process and platform improvements.',
				'Delivered environment-synchronization incident-handling capability, improving operational efficiency for mission-critical customer teams.'
			]
		},
		{
			company: 'Wargaming',
			role: 'Senior Software Development Engineer',
			period: '2018 – 2019',
			current: false,
			project: 'Game platform services',
			highlights: [
				'Rebuilt promotion engine, business-object validation engine, pricing configurability, operation-log storage, and product-definition database structures for Wargaming\'s game platform.',
				'Redesigned Kafka messaging pipeline for BI data flow.'
			]
		},
		{
			company: 'IGT',
			role: 'Software Development Engineer III',
			period: '2016 – 2018',
			current: false,
			project: 'Gaming platform microservices',
			highlights: [
				'Designed low-latency, high-throughput microservices; redesigned a key platform service, reducing latency by 10×.',
				'Migrated OSGI monolith modules to a unified Scala version; delivered a company-wide metrics library.'
			]
		}
	];

	const prior = [
		{
			company: 'Deutsche Bank',
			period: '2015 – 2016',
			highlights: [
				'Optimized large investment fund platform (+20% execution speed).',
				'Led SVN→Git migration reducing dev–QA cycle by 10%; added technical documentation saving tens of engineer-hours per month.'
			]
		},
		{
			company: 'Belleron (via DAXX)',
			period: '2014 – 2015',
			highlights: [
				'Designed Storm-based distributed anti-fraud computation system from scratch for a major bank.',
				'Built bank emulator for load and functional QA testing; designed deployment of 8 system components to AWS.'
			]
		},
		{
			company: 'Alertme (via DataArt)',
			period: '2012 – 2014',
			highlights: [
				'Built high-throughput REST API for smart home startup: scheduling, device management, notifications.',
				'Designed REST-API and database schemas; implemented C++ device communication layer.'
			]
		},
		{
			company: 'Ocado TNA (via DataArt)',
			period: '2012 – 2014',
			highlights: [
				'Time management and attendance system for a major UK retailer with a large workforce.',
				'Extended business logic, DB model design, and requirements clarification.'
			]
		},
		{
			company: 'E-Motion',
			period: '2012',
			highlights: [
				'Call management system for automating call-center operations with metadata-based reporting.',
				'UI rework reducing backend calls by 2.5×; doubled test coverage.'
			]
		},
		{
			company: 'CubicStudio',
			period: '2010 – 2012',
			highlights: [
				'Junior developer on Out of Pawn — a marketplace and catalogue system for a pawnbroker network.'
			]
		}
	];
</script>

<svelte:head>
	<title>Work — Illia Pogodin</title>
</svelte:head>

<StarField />

<div class="site">
	<nav>
		<a href="/" class="logo">ip<span>.</span></a>
		<div class="nav-links">
			<a href="/work" class="active">work</a>
			<a href="/contact">contact</a>
			<a href="/chat">chat</a>
		</div>
	</nav>

	<main class="content">
		<header class="page-header">
			<h1>Work</h1>
			<p class="page-sub">15+ years of distributed systems, platform engineering, and scale.</p>
		</header>

		<!-- Main experience -->
		<section class="section">
			<p class="section-label">Experience</p>
			<div class="jobs">
				{#each experience as job}
				<article class="job-card" id={job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')} class:current={job.current}>
					<div class="job-header">
						<div class="job-left">
							{#if job.current}
								<span class="badge-current"><span class="live-dot"></span>Current</span>
							{/if}
							<h2>{job.company}</h2>
							<p class="job-role">{job.role}</p>
							<p class="job-project">{job.project}</p>
						</div>
						<div class="job-period">{job.period}</div>
					</div>
					<ul class="highlights">
						{#each job.highlights as h}
							<li>{h}</li>
						{/each}
					</ul>
				</article>
				{/each}
			</div>
		</section>

		<!-- Prior experience -->
		<section class="section" id="prior">
			<p class="section-label">Prior Experience · 2010 – 2016</p>
			<div class="prior-grid">
				{#each prior as job}
				<div class="prior-card">
					<div class="prior-header">
						<p class="prior-company">{job.company}</p>
						<p class="prior-period">{job.period}</p>
					</div>
					<ul class="prior-highlights">
						{#each job.highlights as h}
							<li>{h}</li>
						{/each}
					</ul>
				</div>
				{/each}
			</div>
		</section>

		<!-- Skills -->
		<section class="section">
			<p class="section-label">Technical Skills</p>
			<div class="skills-grid">
				<div class="skill-group">
					<p class="skill-cat">Languages & Stack</p>
					<div class="tags"><span class="tag">Java</span><span class="tag">Scala</span><span class="tag">Python</span><span class="tag">Spring</span><span class="tag">Kafka</span><span class="tag">Hibernate</span><span class="tag">Liquibase</span><span class="tag">JPA</span><span class="tag">JDBC</span></div>
				</div>
				<div class="skill-group">
					<p class="skill-cat">Databases</p>
					<div class="tags"><span class="tag">PostgreSQL</span><span class="tag">MySQL</span><span class="tag">MongoDB</span><span class="tag">Redis</span></div>
				</div>
				<div class="skill-group">
					<p class="skill-cat">Engineering</p>
					<div class="tags"><span class="tag">Distributed Systems</span><span class="tag">Platform Architecture</span><span class="tag">Fleet Allocation</span><span class="tag">Observability</span><span class="tag">Reliability</span><span class="tag">API Design</span><span class="tag">TDD</span><span class="tag">Monitoring</span><span class="tag">Design Patterns</span></div>
				</div>
			</div>
		</section>

		<!-- Education -->
		<section class="section edu-section">
			<p class="section-label">Education</p>
			<div class="edu-card">
				<div>
					<p class="edu-degree">M.S. Applied Mathematics</p>
					<p class="edu-school">National University of Ukraine · Faculty of Cybernetics · Kyiv</p>
				</div>
				<div class="edu-courses">
					<p class="skill-cat">Additional training</p>
					<p class="course-item">Distributed Systems — MIT OpenCourseWare</p>
					<p class="course-item">Algorithms — Stanford / Coursera</p>
					<p class="course-item">Concurrent Programming — EPFL / Coursera</p>
					<p class="course-item">Functional Programming in Scala — EPFL</p>
					<p class="course-item">M101 MongoDB for Developers — 10gen</p>
				</div>
			</div>
		</section>

		<div class="page-footer">
			<a href="/resume.pdf" target="_blank" rel="noopener" class="btn-primary">Download Resume PDF</a>
			<a href="/contact" class="btn-ghost">Get in touch →</a>
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

	h1, h2, .logo, nav a, .section-label, .job-role, .prior-company,
	.edu-degree, .skill-cat, .badge-current { font-family: 'Space Grotesk', sans-serif; }

	.site { position: relative; z-index: 1; min-height: 100vh; padding-bottom: 80px; }

	nav {
		position: fixed; top: 0; left: 0; right: 0; z-index: 100;
		display: flex; justify-content: space-between; align-items: center;
		padding: 22px 44px;
	}
	.logo { font-weight: 700; font-size: 18px; color: #FAFAFA; text-decoration: none; letter-spacing: -0.02em; }
	.logo span { color: #6366F1; }
	.nav-links { display: flex; gap: 32px; }
	.nav-links a { color: #71717A; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.02em; transition: color 0.2s; }
	.nav-links a:hover, .nav-links a.active { color: #FAFAFA; }

	.content { max-width: 840px; margin: 0 auto; padding: 120px 32px 0; }

	.page-header { margin-bottom: 56px; }
	.page-header h1 { font-size: 48px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; }
	.page-sub { font-size: 15px; color: #71717A; }

	.section { margin-bottom: 56px; scroll-margin-top: 100px; }
	.section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #71717A; margin-bottom: 20px; }

	/* ── Job cards ── */
	.jobs { display: flex; flex-direction: column; gap: 16px; }
	.job-card {
		background: rgba(17,17,19,0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 14px; padding: 28px 32px;
		transition: border-color 0.2s;
		scroll-margin-top: 100px;
	}
	.job-card.current { border-color: rgba(99,102,241,0.25); }
	.job-card:hover { border-color: rgba(99,102,241,0.35); }
	.job-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
	.job-left { flex: 1; }
	.badge-current {
		display: inline-flex; align-items: center; gap: 6px;
		background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
		border-radius: 6px; padding: 3px 10px;
		font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
		text-transform: uppercase; color: #6366F1; margin-bottom: 10px;
	}
	.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; animation: pulse 2s infinite; flex-shrink: 0; }
	@keyframes pulse {
		0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
		50% { opacity:0.6; box-shadow: 0 0 0 5px rgba(34,197,94,0); }
	}
	h2 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
	.job-role { font-size: 14px; color: #71717A; margin-bottom: 6px; }
	.job-project { font-size: 12px; color: #52525B; font-style: italic; }
	.job-period { font-size: 13px; color: #6366F1; font-family: 'Space Grotesk', sans-serif; font-weight: 500; white-space: nowrap; padding-top: 2px; }
	.highlights { padding-left: 18px; display: flex; flex-direction: column; gap: 8px; }
	.highlights li { font-size: 14px; color: #A1A1AA; line-height: 1.65; }

	/* ── Prior experience ── */
	.prior-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
	.prior-card {
		background: rgba(17,17,19,0.7);
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 12px; padding: 20px 22px;
		transition: border-color 0.2s;
	}
	.prior-card:hover { border-color: rgba(99,102,241,0.2); }
	.prior-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 10px; }
	.prior-company { font-weight: 600; font-size: 14px; }
	.prior-period { font-size: 11px; color: #52525B; white-space: nowrap; }
	.prior-highlights { padding-left: 16px; display: flex; flex-direction: column; gap: 5px; }
	.prior-highlights li { font-size: 13px; color: #71717A; line-height: 1.5; }

	/* ── Skills ── */
	.skills-grid { display: flex; flex-direction: column; gap: 16px; }
	.skill-group { display: flex; flex-direction: column; gap: 8px; }
	.skill-cat { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #71717A; }
	.tags { display: flex; flex-wrap: wrap; gap: 6px; }
	.tag {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 6px; padding: 5px 11px;
		font-size: 13px; color: #A1A1AA;
		font-family: 'Space Grotesk', sans-serif; font-weight: 500;
	}

	/* ── Education ── */
	.edu-card {
		background: rgba(17,17,19,0.85);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 14px; padding: 28px 32px;
		display: flex; gap: 48px;
	}
	.edu-degree { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 4px; }
	.edu-school { font-size: 13px; color: #71717A; }
	.edu-courses { flex-shrink: 0; }
	.course-item { font-size: 13px; color: #71717A; margin-bottom: 4px; }

	/* ── Footer ── */
	.page-footer { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
	.btn-primary {
		background: #FAFAFA; color: #09090B;
		border: none; border-radius: 8px; padding: 12px 24px;
		font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600;
		text-decoration: none; transition: opacity 0.2s;
	}
	.btn-primary:hover { opacity: 0.88; }
	.btn-ghost {
		background: transparent; color: #71717A;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 8px; padding: 12px 24px;
		font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500;
		text-decoration: none; transition: border-color 0.2s, color 0.2s;
	}
	.btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #FAFAFA; }

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
		.content { padding: 80px 16px 0; }
		.page-header h1 { font-size: 36px; }
		.prior-grid { grid-template-columns: 1fr; }
		.edu-card { flex-direction: column; gap: 24px; }
		.job-header { flex-direction: column; }
		.job-period { align-self: flex-start; }
	}
</style>
