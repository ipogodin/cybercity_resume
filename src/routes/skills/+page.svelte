<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import SkillGrid from '$lib/components/SkillGrid.svelte';
	import { skillCategories } from '$lib/data/skills.js';
	
	let cleanup;
	
	onMount(() => {
		cleanup = initKeyboardNavigation();
	});
	
	onDestroy(() => {
		if (cleanup) cleanup();
	});
</script>

<RainEffect enabled={true} intensity={100} speed={2} />

<Scene background="/images/scenes/skills_district.png" location="skills" enableParallax={true}>
	<div class="character-wrapper">
		<Character position="right" scale={5} entrance="right" delay={150} />
	</div>
	
	<div class="skills-content">
		<div class="skills-container">
			<!-- Header Section -->
			<header class="skills-header">
				<h1 class="neon-text-cyan title-main">Tech Arsenal</h1>
				<p class="subtitle">
					<span class="tech-font">15 years</span> of battle-tested technologies
				</p>
				<div class="header-divider"></div>
			</header>
			
			<!-- Skills Grid -->
			<div class="skills-wrapper">
				<SkillGrid {skillCategories} showProficiency={true} />
			</div>
		</div>
	</div>
	
	<!-- Navigation Map -->
	<Navigation currentLocation="skills" />
</Scene>

<style>
	.character-wrapper {
		position: absolute;
		bottom: -60%; /* Lower than default 15% */
		right: 0;
		z-index: 2;
	}
	
	.skills-content {
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
		scrollbar-color: var(--color-neon-cyan) rgba(0, 0, 0, 0.3);
	}
	
	.skills-content::-webkit-scrollbar {
		width: 8px;
	}
	
	.skills-content::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}
	
	.skills-content::-webkit-scrollbar-thumb {
		background: var(--color-neon-cyan);
		border-radius: 4px;
		box-shadow: 0 0 10px var(--color-glow-cyan);
	}
	
	.skills-content::-webkit-scrollbar-thumb:hover {
		background: var(--color-neon-pink);
		box-shadow: 0 0 15px var(--color-glow-pink);
	}
	
	.skills-container {
		max-width: 1100px; /* Constrain to fit ~3 columns */
		margin: 0; /* Align to left instead of center */
		margin-left: 2rem; /* Add some spacing from left edge */
	}
	
	/* Header Styles */
	.skills-header {
		text-align: left; /* Align header to left */
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
			0 0 20px var(--color-glow-cyan),
			0 0 40px var(--color-glow-cyan),
			0 0 60px var(--color-glow-cyan);
	}
	
	.subtitle {
		font-family: 'Rajdhani', sans-serif;
		font-size: 1.5rem;
		color: var(--color-text-secondary);
		margin: 0 0 1.5rem 0;
	}
	
	.subtitle .tech-font {
		color: var(--color-neon-pink);
		font-family: 'Share Tech Mono', monospace;
		font-weight: 700;
		text-shadow: 0 0 10px var(--color-glow-pink);
	}
	
	.header-divider {
		width: 200px;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--color-neon-cyan),
			transparent
		);
		margin: 0; /* Align divider to left */
		box-shadow: 0 0 10px var(--color-glow-cyan);
		animation: pulse 2s ease-in-out infinite;
	}
	
	/* Skills Wrapper */
	.skills-wrapper {
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
			box-shadow: 0 0 10px var(--color-glow-cyan);
		}
		50% {
			opacity: 0.6;
			box-shadow: 0 0 20px var(--color-glow-cyan);
		}
	}
	
	/* Tablet adjustments */
	@media (max-width: 1024px) {
		.skills-content {
			padding: 3rem 1.5rem 6rem 1.5rem;
		}
		
		.title-main {
			font-size: 3rem;
			letter-spacing: 4px;
		}
		
		.subtitle {
			font-size: 1.25rem;
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.skills-content {
			padding: 2rem 1rem 5rem 1rem;
		}
		
		.skills-header {
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
	}
</style>
