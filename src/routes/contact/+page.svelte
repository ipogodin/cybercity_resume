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
				<p class="tagline">
					{contact.tagline}
					<a 
						href="https://www.google.com/search?q=Illia+Pogodin" 
						target="_blank" 
						rel="noopener noreferrer"
						class="google-link"
						title="Google me"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
							<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
							<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
							<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
						</svg>
					</a>
				</p>
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
		white-space: pre-line; /* Allows \n to create line breaks */
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	
	.google-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		transition: all var(--transition-fast);
		flex-shrink: 0;
		text-decoration: none;
		cursor: pointer;
	}
	
	.google-link:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.4);
		transform: translateY(-2px) scale(1.1);
		box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
	}
	
	.google-link svg {
		display: block;
		width: 24px;
		height: 24px;
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
			flex-direction: column;
		}
		
		.google-link {
			margin-top: 0.5rem;
		}
	}
</style>
