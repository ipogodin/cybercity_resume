<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation, setTerminalFocused } from '$lib/utils/keyboard.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import ContactTerminal from '$lib/components/ContactTerminal.svelte';
	import { contact, getSocialLinks } from '$lib/data/contact.js';
	
	let cleanup;
	const socialLinks = getSocialLinks();
	
	// Handle terminal focus changes
	function handleTerminalFocusChange(focused) {
		setTerminalFocused(focused);
	}
	
	onMount(() => {
		cleanup = initKeyboardNavigation();
	});
	
	onDestroy(() => {
		if (cleanup) cleanup();
		// Reset terminal focus state on unmount
		setTerminalFocused(false);
	});
</script>

<RainEffect enabled={true} intensity={120} speed={2.5} />

<Scene background="/images/scenes/contact_terminal.png" location="contact" enableParallax={true}>
	<div class="character-wrapper">
		<Character position="center" scale={10} entrance="right" delay={150} />
	</div>
	
	<div class="contact-content">
		<div class="contact-container">
			<!-- Header Section -->
			<header class="contact-header">
				<h1 class="neon-text-cyan title-main">Contact Terminal</h1>
				<p class="subtitle">
					<span class="tech-font">Let's Connect</span> - Open to opportunities
				</p>
				<div class="header-divider"></div>
			</header>
			
			<!-- Terminal Interface -->
			<div class="terminal-wrapper">
				<ContactTerminal {contact} onFocusChange={handleTerminalFocusChange} />
			</div>
			
			<!-- Tagline Section -->
			<div class="tagline-section">
				<p class="tagline">{contact.tagline}</p>
			</div>
		</div>
	</div>
	
	<!-- Navigation Map -->
	<Navigation currentLocation="contact" />
</Scene>

<style>
	.character-wrapper {
		position: absolute;
		bottom: -150%;
		right: 10%;
		transform: translateX(-50%);
		z-index: 2;
		pointer-events: none; /* Allow clicks to pass through */
	}
	
	.contact-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 4rem 2rem 8rem 2rem;
		z-index: 1;
		animation: fadeIn 5s ease-out;
		
		/* Custom scrollbar */
		scrollbar-width: thin;
		scrollbar-color: var(--color-neon-cyan) rgba(0, 0, 0, 0.3);
	}
	
	.contact-content::-webkit-scrollbar {
		width: 8px;
	}
	
	.contact-content::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}
	
	.contact-content::-webkit-scrollbar-thumb {
		background: var(--color-neon-cyan);
		border-radius: 4px;
		box-shadow: 0 0 10px var(--color-glow-cyan);
	}
	
	.contact-content::-webkit-scrollbar-thumb:hover {
		background: var(--color-neon-pink);
		box-shadow: 0 0 15px var(--color-glow-pink);
	}
	
	.contact-container {
		max-width: 1200px;
		margin: 0 auto;
	}
	
	/* Header Styles */
	.contact-header {
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
		color: var(--color-neon-purple);
		font-family: 'Share Tech Mono', monospace;
		font-weight: 700;
		text-shadow: 0 0 10px var(--color-glow-purple);
	}
	
	.header-divider {
		width: 200px;
		height: 3px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-neon-cyan),
			transparent
		);
		margin: 0 auto;
		box-shadow: 0 0 10px var(--color-glow-cyan);
		animation: pulse 2s ease-in-out infinite;
	}
	
	/* Terminal Wrapper */
	.terminal-wrapper {
		margin-bottom: 3rem;
		animation: fadeInUp 1s ease-out 0.3s both; /* First: terminal appears */
	}
	
	/* Contact Cards Grid */
	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
		animation: fadeInUp 1s ease-out 2.5s both; /* Third: cards appear after character */
	}
	
	.contact-card {
		padding: 2rem;
		text-align: center;
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 255, 240, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}
	
	.contact-card:hover {
		transform: translateY(-5px);
		border-color: var(--color-neon-cyan);
		box-shadow: 
			0 0 20px rgba(0, 255, 240, 0.3),
			0 10px 30px rgba(0, 0, 0, 0.3);
	}
	
	.resume-card {
		border-color: rgba(185, 0, 255, 0.3);
	}
	
	.resume-card:hover {
		border-color: var(--color-neon-purple);
		box-shadow: 
			0 0 20px rgba(185, 0, 255, 0.3),
			0 10px 30px rgba(0, 0, 0, 0.3);
	}
	
	.card-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		filter: drop-shadow(0 0 10px rgba(0, 255, 240, 0.5));
	}
	
	.card-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	
	.contact-link {
		font-size: 1.125rem;
		color: var(--color-neon-cyan);
		text-decoration: none;
		word-break: break-word;
		transition: all 0.3s ease;
		text-shadow: 0 0 5px var(--color-glow-cyan);
	}
	
	.contact-link:hover {
		color: var(--color-neon-pink);
		text-shadow: 0 0 10px var(--color-glow-pink);
		transform: scale(1.05);
	}
	
	.card-note {
		margin-top: 0.75rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-style: italic;
	}
	
	/* Tagline Section */
	.tagline-section {
		text-align: center;
		padding: 2rem;
		animation: fadeInUp 1s ease-out 3.5s both; /* Fourth: tagline appears last */
	}
	
	.tagline {
		font-family: 'Rajdhani', sans-serif;
		font-size: 1.25rem;
		line-height: 1.8;
		color: var(--color-text-secondary);
		max-width: 800px;
		margin: 0 auto;
		font-style: italic;
		padding: 1.5rem;
		background: rgba(0, 255, 240, 0.05);
		border-left: 3px solid var(--color-neon-cyan);
		border-radius: 4px;
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
		.character-wrapper {
			display: none;
		}
		
		.contact-content {
			padding: 3rem 1.5rem 6rem 1.5rem;
		}
		
		.title-main {
			font-size: 3rem;
			letter-spacing: 4px;
		}
		
		.subtitle {
			font-size: 1.25rem;
		}
		
		.contact-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.contact-content {
			padding: 2rem 1rem 5rem 1rem;
		}
		
		.contact-header {
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
		
		.contact-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		
		.contact-card {
			min-height: 180px;
			padding: 1.5rem;
		}
		
		.tagline {
			font-size: 1rem;
			padding: 1rem;
		}
	}
</style>
