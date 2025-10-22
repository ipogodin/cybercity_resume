<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { education, certifications, additionalTraining } from '$lib/data/education.js';
	
	let cleanup;
	
	onMount(() => {
		cleanup = initKeyboardNavigation();
	});
	
	onDestroy(() => {
		if (cleanup) cleanup();
	});
</script>

<RainEffect enabled={true} intensity={100} speed={2} />

<Scene background="/images/scenes/education_quarter.png" location="education" enableParallax={true}>
	<div class="character-wrapper">
		<Character position="left" scale={5} entrance="left" delay={150} />
	</div>
	
	<div class="education-content">
		<div class="education-container">
			<!-- Header Section -->
			<header class="education-header">
				<h1 class="neon-text-purple title-main">Education Quarter</h1>
				<p class="subtitle">
					<span class="tech-font">Foundation</span> in Applied Mathematics & Cybernetics
				</p>
				<div class="header-divider"></div>
			</header>
			
			<!-- Education Cards -->
			<div class="education-grid">
				{#each education as edu}
					<div class="education-card glass-card">
						<div class="card-header">
							<div class="degree-icon">🎓</div>
							<div class="degree-info">
								<h2 class="degree-name neon-text-purple">{edu.degree}</h2>
								<p class="institution tech-font">{edu.institution}</p>
							</div>
						</div>
						
						<div class="card-body">
							<div class="location-period">
								<span class="location">📍 {edu.location}</span>
								<span class="period">{edu.period}</span>
							</div>
							
							{#if edu.faculty}
								<p class="faculty">
									<strong>Faculty:</strong> {edu.faculty}
								</p>
							{/if}
							
							<p class="description">{edu.description}</p>
							
							{#if edu.highlights && edu.highlights.length > 0}
								<div class="highlights">
									<h3 class="highlights-title tech-font">Key Areas</h3>
									<ul class="highlights-list">
										{#each edu.highlights as highlight}
											<li>
												<span class="highlight-bullet">▹</span>
												{highlight}
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
			
			<!-- Additional Training Section -->
			{#if additionalTraining && additionalTraining.length > 0}
				<section class="training-section">
					<h2 class="section-title neon-text-cyan">Advanced Coursework</h2>
					<div class="training-grid">
						{#each additionalTraining as training}
							<div class="training-card glass-card">
								<h3 class="training-name tech-font">{training.name}</h3>
								<p class="training-description">{training.description}</p>
							</div>
						{/each}
					</div>
				</section>
			{/if}
			
			<!-- Certifications Section (if any) -->
			{#if certifications && certifications.length > 0}
				<section class="certifications-section">
					<h2 class="section-title neon-text-pink">Certifications</h2>
					<div class="certifications-grid">
						{#each certifications as cert}
							<div class="certification-card glass-card">
								<h3 class="cert-name">{cert.name}</h3>
								<p class="cert-issuer tech-font">{cert.issuer}</p>
								<p class="cert-date">{cert.date}</p>
								{#if cert.credentialUrl}
									<a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" class="cert-link btn-neon">
										View Credential
									</a>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</div>
	
	<!-- Navigation Map -->
	<Navigation currentLocation="education" />
</Scene>

<style>
	.character-wrapper {
		position: absolute;
		bottom: -10%;
		left: 0;
		z-index: 2;
		pointer-events: none; /* Allow clicks to pass through */
	}
	
	.education-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 4rem 2rem 8rem 2rem;
		z-index: 1;
		animation: fadeIn 1s ease-out;
		
		/* Custom scrollbar */
		scrollbar-width: thin;
		scrollbar-color: var(--color-neon-purple) rgba(0, 0, 0, 0.3);
	}
	
	.education-content::-webkit-scrollbar {
		width: 8px;
	}
	
	.education-content::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}
	
	.education-content::-webkit-scrollbar-thumb {
		background: var(--color-neon-purple);
		border-radius: 4px;
		box-shadow: 0 0 10px var(--color-glow-purple);
	}
	
	.education-content::-webkit-scrollbar-thumb:hover {
		background: var(--color-neon-cyan);
		box-shadow: 0 0 15px var(--color-glow-cyan);
	}
	
	.education-container {
		max-width: 1000px;
		margin: 0 auto;
	}
	
	/* Header Styles */
	.education-header {
		text-align: center;
		margin-bottom: 3rem;
		animation: slideDown 1s ease-out;
	}
	
	.title-main {
		font-family: 'Orbitron', sans-serif;
		font-size: 4rem;
		font-weight: 900;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 6px;
		text-shadow: 
			0 0 20px var(--color-glow-purple),
			0 0 40px var(--color-glow-purple),
			0 0 60px var(--color-glow-purple);
	}
	
	.subtitle {
		font-family: 'Rajdhani', sans-serif;
		font-size: 1.5rem;
		color: var(--color-text-secondary);
		margin: 0 0 1.5rem 0;
	}
	
	.subtitle .tech-font {
		color: var(--color-neon-cyan);
		font-family: 'Share Tech Mono', monospace;
		font-weight: 700;
		text-shadow: 0 0 10px var(--color-glow-cyan);
	}
	
	.header-divider {
		width: 200px;
		height: 3px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-neon-purple),
			transparent
		);
		margin: 0 auto;
		box-shadow: 0 0 10px var(--color-glow-purple);
		animation: pulse 2s ease-in-out infinite;
	}
	
	/* Education Cards */
	.education-grid {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		animation: fadeInUp 1.2s ease-out 0.3s both;
	}
	
	.education-card {
		padding: 2.5rem;
		transition: all 0.3s ease;
		border: 1px solid rgba(185, 0, 255, 0.3);
	}
	
	.education-card:hover {
		transform: translateY(-5px);
		border-color: var(--color-neon-purple);
		box-shadow: 
			0 0 20px rgba(185, 0, 255, 0.3),
			0 10px 30px rgba(0, 0, 0, 0.3);
	}
	
	.card-header {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
	
	.degree-icon {
		font-size: 3rem;
		line-height: 1;
		filter: drop-shadow(0 0 10px rgba(185, 0, 255, 0.5));
	}
	
	.degree-info {
		flex: 1;
	}
	
	.degree-name {
		font-family: 'Orbitron', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		line-height: 1.3;
	}
	
	.institution {
		font-size: 1.25rem;
		color: var(--color-neon-cyan);
		margin: 0;
		text-shadow: 0 0 5px var(--color-glow-cyan);
	}
	
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.location-period {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: rgba(185, 0, 255, 0.1);
		border-radius: 4px;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.938rem;
	}
	
	.location {
		color: var(--color-text-secondary);
	}
	
	.period {
		color: var(--color-neon-pink);
		font-weight: 700;
		text-shadow: 0 0 5px var(--color-glow-pink);
	}
	
	.faculty {
		color: var(--color-text-secondary);
		font-size: 1rem;
		margin: 0;
	}
	
	.faculty strong {
		color: var(--color-text-primary);
	}
	
	.description {
		color: var(--color-text-secondary);
		font-size: 1.063rem;
		line-height: 1.6;
		margin: 0;
	}
	
	.highlights {
		margin-top: 0.5rem;
	}
	
	.highlights-title {
		font-size: 1rem;
		color: var(--color-neon-cyan);
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0 0 0.75rem 0;
		text-shadow: 0 0 5px var(--color-glow-cyan);
	}
	
	.highlights-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.highlights-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		color: var(--color-text-secondary);
		font-size: 0.938rem;
		line-height: 1.5;
	}
	
	.highlight-bullet {
		color: var(--color-neon-purple);
		font-size: 1.25rem;
		line-height: 1;
		flex-shrink: 0;
	}
	
	/* Training Section */
	.training-section {
		margin-top: 4rem;
		animation: fadeInUp 1.4s ease-out 0.5s both;
	}
	
	.section-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 2rem;
		font-weight: 700;
		text-align: center;
		margin: 0 0 2rem 0;
		text-transform: uppercase;
		letter-spacing: 3px;
	}
	
	.training-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}
	
	.training-card {
		padding: 1.5rem;
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 255, 240, 0.3);
	}
	
	.training-card:hover {
		transform: translateY(-5px);
		border-color: var(--color-neon-cyan);
		box-shadow: 
			0 0 15px rgba(0, 255, 240, 0.3),
			0 5px 20px rgba(0, 0, 0, 0.3);
	}
	
	.training-name {
		font-size: 1.125rem;
		color: var(--color-neon-cyan);
		margin: 0 0 0.75rem 0;
		text-shadow: 0 0 5px var(--color-glow-cyan);
	}
	
	.training-description {
		color: var(--color-text-secondary);
		font-size: 0.938rem;
		line-height: 1.5;
		margin: 0;
	}
	
	/* Certifications Section */
	.certifications-section {
		margin-top: 4rem;
		animation: fadeInUp 1.6s ease-out 0.7s both;
	}
	
	.certifications-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	
	.certification-card {
		padding: 2rem;
		text-align: center;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 0, 110, 0.3);
	}
	
	.certification-card:hover {
		transform: translateY(-5px);
		border-color: var(--color-neon-pink);
		box-shadow: 
			0 0 15px rgba(255, 0, 110, 0.3),
			0 5px 20px rgba(0, 0, 0, 0.3);
	}
	
	.cert-name {
		font-size: 1.25rem;
		color: var(--color-neon-pink);
		margin: 0 0 0.5rem 0;
		text-shadow: 0 0 5px var(--color-glow-pink);
	}
	
	.cert-issuer {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0 0 0.5rem 0;
	}
	
	.cert-date {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin: 0 0 1.5rem 0;
	}
	
	.cert-link {
		font-size: 0.875rem;
		padding: 0.5rem 1.25rem;
	}
	
	/* Animations */
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slideDown {
		from { 
			opacity: 0;
			transform: translateY(-30px);
		}
		to { 
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			box-shadow: 0 0 10px var(--color-glow-purple);
		}
		50% {
			opacity: 0.6;
			box-shadow: 0 0 20px var(--color-glow-purple);
		}
	}
	
	/* Tablet adjustments */
	@media (max-width: 1024px) {
		.character-wrapper {
			display: none;
		}
		
		.education-content {
			padding: 3rem 1.5rem 6rem 1.5rem;
		}
		
		.title-main {
			font-size: 3rem;
			letter-spacing: 4px;
		}
		
		.subtitle {
			font-size: 1.25rem;
		}
		
		.training-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.education-content {
			padding: 2rem 1rem 5rem 1rem;
		}
		
		.education-header {
			margin-bottom: 2rem;
		}
		
		.title-main {
			font-size: 2rem;
			letter-spacing: 2px;
		}
		
		.subtitle {
			font-size: 1rem;
		}
		
		.header-divider {
			width: 150px;
		}
		
		.education-card {
			padding: 1.5rem;
		}
		
		.card-header {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
		
		.degree-name {
			font-size: 1.5rem;
		}
		
		.location-period {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.training-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
