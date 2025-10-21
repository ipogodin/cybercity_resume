<script>
	import { onMount, onDestroy } from 'svelte';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import { goto } from '$app/navigation';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import { experience, getFeaturedExperience } from '$lib/data/experience.js';
	
	let selectedCompany = $state(null);
	let showModal = $state(false);
	let cleanup;
	
	onMount(() => {
		cleanup = initKeyboardNavigation();
	});
	
	onDestroy(() => {
		if (cleanup) cleanup();
	});
	
	// Get featured companies (Meta, Google) for prominent display
	const featuredCompanies = getFeaturedExperience();
	const otherCompanies = experience.filter(exp => !exp.featured);
	
	function selectCompany(company) {
		console.log('🏢 Selected company:', company.company);
		selectedCompany = company;
		showModal = true;
		console.log('📝 Modal state:', { showModal, hasCompany: !!selectedCompany });
	}
	
	function closeModal() {
		console.log('❌ Closing modal');
		showModal = false;
		setTimeout(() => {
			selectedCompany = null;
		}, 300);
	}
</script>

<!-- Rain Effect -->
<RainEffect enabled={true} intensity={100} speed={2} />

<!-- Main Scene -->
<Scene background="/images/scenes/experience_avenue.png" location="experience" enableParallax={true}>
	<!-- Character -->
	<Character position="left" scale={1.2} delay={800} />
	
	<!-- Experience Buildings -->
	<div class="experience-content">
		<div class="avenue-title">
			<h1 class="neon-text-pink">Experience Avenue</h1>
			<p class="tech-font">15 Years of Building at Scale</p>
		</div>
		
		<!-- Featured Companies - Large Buildings -->
		<div class="featured-buildings">
			{#each featuredCompanies as company}
				<button 
					class="building featured-building" 
					onclick={() => selectCompany(company)}
					style="--neon-color: {company.neonColor}"
				>
					<div class="building-facade">
						<div class="company-logo">
							<span class="company-initial">{company.company[0]}</span>
						</div>
						<h2 class="company-name neon-text">{company.company}</h2>
						<p class="company-role">{company.role}</p>
						<p class="company-period tech-font">{company.period}</p>
						<div class="building-windows"></div>
					</div>
					<div class="building-glow"></div>
				</button>
			{/each}
		</div>
		
		<!-- Other Companies - Smaller Buildings -->
		<div class="other-buildings">
			{#each otherCompanies as company}
				<button 
					class="building small-building" 
					onclick={() => selectCompany(company)}
					style="--neon-color: {company.neonColor}"
				>
					<div class="building-facade">
						<h3 class="company-name">{company.company}</h3>
						<p class="company-period tech-font">{company.period}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
	
	<!-- Navigation Map -->
	<Navigation currentLocation="experience" />
</Scene>

<!-- Experience Detail Modal -->
<Modal bind:isOpen={showModal} onClose={closeModal}>
	{#if selectedCompany}
		<ExperienceCard experience={selectedCompany} expanded={true} />
	{/if}
</Modal>

<style>
	.experience-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		overflow-y: auto;
	}
	
	.avenue-title {
		text-align: center;
		margin-top: 2rem;
		animation: fadeInDown 0.8s ease-out;
	}
	
	.avenue-title h1 {
		font-size: 3rem;
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
		letter-spacing: 4px;
	}
	
	.avenue-title p {
		margin: 0.5rem 0 0 0;
		font-size: 1.25rem;
		color: var(--color-text-secondary);
	}
	
	/* Featured Buildings - Meta & Google */
	.featured-buildings {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin: 2rem 0;
		animation: fadeIn 1s ease-out 0.3s backwards;
		position: relative;
		z-index: 10;
	}
	
	.building {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		position: relative;
		transition: transform 0.3s ease-out;
		z-index: 10;
		pointer-events: auto;
	}
	
	.building:hover {
		transform: translateY(-10px) scale(1.05);
		z-index: 20;
	}
	
	.featured-building {
		width: 300px;
	}
	
	.building-facade {
		background: rgba(10, 14, 39, 0.9);
		border: 2px solid var(--neon-color, var(--color-neon-cyan));
		border-radius: 8px;
		padding: 2rem;
		position: relative;
		backdrop-filter: blur(10px);
		box-shadow: 
			inset 0 0 20px rgba(0, 255, 240, 0.1),
			0 0 30px var(--neon-color, var(--color-neon-cyan));
		transition: all 0.3s ease-out;
	}
	
	.building:hover .building-facade {
		box-shadow: 
			inset 0 0 30px rgba(0, 255, 240, 0.2),
			0 0 50px var(--neon-color, var(--color-neon-cyan));
	}
	
	.company-logo {
		width: 80px;
		height: 80px;
		margin: 0 auto 1rem;
		background: var(--neon-color, var(--color-neon-cyan));
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 20px var(--neon-color, var(--color-neon-cyan));
	}
	
	.company-initial {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--color-bg-primary);
		font-family: 'Orbitron', sans-serif;
	}
	
	.company-name {
		margin: 0;
		font-size: 1.75rem;
		color: var(--neon-color, var(--color-neon-cyan));
		text-shadow: 0 0 10px var(--neon-color, var(--color-neon-cyan));
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	
	.company-role {
		margin: 0.5rem 0;
		font-size: 1rem;
		color: var(--color-text-secondary);
	}
	
	.company-period {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}
	
	.building-windows {
		margin-top: 1.5rem;
		height: 120px;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 20px,
			rgba(0, 255, 240, 0.1) 20px,
			rgba(0, 255, 240, 0.1) 22px
		);
		opacity: 0.5;
	}
	
	.building-glow {
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 20px;
		background: radial-gradient(
			ellipse at center,
			var(--neon-color, var(--color-neon-cyan)),
			transparent
		);
		opacity: 0.3;
		filter: blur(10px);
	}
	
	/* Other Buildings - Smaller */
	.other-buildings {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		margin: 1rem 0;
		animation: fadeIn 1s ease-out 0.6s backwards;
		position: relative;
		z-index: 10;
	}
	
	.small-building {
		width: 220px;
		min-height: 120px;
	}
	
	.small-building .building-facade {
		padding: 1.5rem 1rem;
		min-height: 120px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
	}
	
	.small-building .company-name {
		font-size: 1rem;
		line-height: 1.3;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
	}
	
	.small-building .company-period {
		font-size: 0.75rem;
	}
	
	/* Animations */
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
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
	
	/* Mobile Responsive */
	@media (max-width: 768px) {
		.experience-content {
			padding: 1rem;
		}
		
		.avenue-title h1 {
			font-size: 2rem;
		}
		
		.avenue-title p {
			font-size: 1rem;
		}
		
		.featured-buildings {
			flex-direction: column;
			align-items: center;
			gap: 2rem;
		}
		
		.featured-building {
			width: 100%;
			max-width: 300px;
		}
		
		.small-building {
			width: 150px;
		}
	}
</style>
