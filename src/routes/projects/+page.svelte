<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/data/projects.js';
	
	let cleanup;
	
	onMount(() => {
		cleanup = initKeyboardNavigation();
	});
	
	onDestroy(() => {
		if (cleanup) cleanup();
	});
</script>

<RainEffect enabled={true} intensity={120} speed={2.5} />

<Scene background="/images/scenes/projects_alley.png" location="projects" enableParallax={true}>
	<div class="character-wrapper">
		<Character position="right" scale={5} entrance="right" delay={150} />
	</div>
	
	<div class="projects-content">
		<div class="projects-container">
			<!-- Header Section -->
			<header class="projects-header">
				<h1 class="neon-text-pink title-main">Project Showcase</h1>
				<p class="subtitle">
					<span class="tech-font">{projects.length} mission-critical projects</span> across Meta, Google, and enterprise platforms
				</p>
				<div class="header-divider"></div>
			</header>
			
			<!-- Projects Grid -->
			<div class="projects-grid">
				{#each projects as project}
					<ProjectCard {project} />
				{/each}
			</div>
		</div>
	</div>
	
	<!-- Navigation Map -->
	<Navigation currentLocation="projects" />
</Scene>

<style>
	.character-wrapper {
		position: absolute;
		bottom: -60%;
		left: 0;
		z-index: 10; /* Higher to be visible */
		transform: scaleX(-1); /* Mirror the character */
		pointer-events: none; /* Allow clicks to pass through */
	}
	
	.projects-content {
		position: absolute;
		top: 0;
		left: 35%; /* Start content from 35% to leave space for character */
		width: 65%; /* Take only right 65% of space */
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 4rem 2rem 8rem 2rem;
		z-index: 5;
		animation: fadeIn 7s ease-out;
		
		/* Custom scrollbar */
		scrollbar-width: thin;
		scrollbar-color: var(--color-neon-pink) rgba(0, 0, 0, 0.3);
	}
	
	.projects-content::-webkit-scrollbar {
		width: 8px;
	}
	
	.projects-content::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}
	
	.projects-content::-webkit-scrollbar-thumb {
		background: var(--color-neon-pink);
		border-radius: 4px;
		box-shadow: 0 0 10px var(--color-glow-pink);
	}
	
	.projects-content::-webkit-scrollbar-thumb:hover {
		background: var(--color-neon-cyan);
		box-shadow: 0 0 15px var(--color-glow-cyan);
	}
	
	.projects-container {
		max-width: 1400px;
		margin: 0 auto;
	}
	
	/* Header Styles */
	.projects-header {
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
			0 0 20px var(--color-glow-pink),
			0 0 40px var(--color-glow-pink),
			0 0 60px var(--color-glow-pink);
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
			var(--color-neon-pink),
			transparent
		);
		margin: 0 auto;
		box-shadow: 0 0 10px var(--color-glow-pink);
		animation: pulse 2s ease-in-out infinite;
	}
	
	/* Projects Grid */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr); /* Force exactly 2 columns */
		gap: 2rem;
		animation: fadeInUp 1.2s ease-out 0.3s both;
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
			box-shadow: 0 0 10px var(--color-glow-pink);
		}
		50% {
			opacity: 0.6;
			box-shadow: 0 0 20px var(--color-glow-pink);
		}
	}
	
	/* Tablet adjustments */
	@media (max-width: 1024px) {
		.character-wrapper {
			display: none; /* Hide character on tablet/mobile */
		}
		
		.projects-content {
			padding: 3rem 1.5rem 6rem 1.5rem; /* Remove left padding */
		}
		
		.title-main {
			font-size: 3rem;
			letter-spacing: 4px;
		}
		
		.subtitle {
			font-size: 1.25rem;
		}
		
		.projects-grid {
			grid-template-columns: repeat(2, 1fr); /* Keep 2 columns on tablet */
			gap: 1.5rem;
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.projects-content {
			padding: 2rem 1rem 5rem 1rem;
		}
		
		.projects-header {
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
		
		.projects-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>
