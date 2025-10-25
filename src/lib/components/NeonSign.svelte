<script>
	/**
	 * NeonSign Component - Clickable neon signs for navigation
	 * @prop {string} text - Sign text
	 * @prop {string} [direction] - Navigation direction (north, south, east, west)
	 * @prop {string} [destination] - Direct destination location
	 * @prop {string} [color='cyan'] - Neon color (cyan, pink, purple)
	 * @prop {Function} [onclick] - Click handler
	 */
	
	import { navigation } from '$lib/stores/navigation.js';
	
	let { 
		text, 
		direction = null, 
		destination = null,
		color = 'cyan',
		onclick
	} = $props();
	
	function handleClick() {
		if (destination) {
			navigation.navigateTo(destination);
		} else if (direction) {
			navigation.navigateDirection(direction);
		}
		
		if (onclick) {
			onclick();
		}
	}
	
	const colorClass = $derived(`neon-${color}`);
</script>

<button class="neon-sign {colorClass}" onclick={handleClick}>
	<span class="sign-text">{text}</span>
	<span class="sign-glow"></span>
</button>

<style>
	.neon-sign {
		position: relative;
		padding: 1rem 2rem;
		background: transparent;
		border: none;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 3px;
		cursor: pointer;
		overflow: hidden;
		transition: all var(--transition-normal);
		pointer-events: auto;
		-webkit-tap-highlight-color: rgba(0, 255, 240, 0.2);
		touch-action: manipulation;
		z-index: 10;
	}
	
	.sign-text {
		position: relative;
		z-index: 2;
		display: block;
		animation: neon-flicker 3s infinite alternate;
	}
	
	.sign-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		opacity: 0.5;
		filter: blur(10px);
		transition: opacity var(--transition-normal);
	}
	
	.neon-sign:hover .sign-text {
		animation: none;
	}
	
	.neon-sign:hover .sign-glow {
		opacity: 1;
		filter: blur(15px);
	}
	
	.neon-sign:active {
		transform: scale(0.95);
	}
	
	/* Color variants */
	.neon-cyan .sign-text {
		color: var(--color-neon-cyan);
		text-shadow: 
			0 0 5px var(--color-neon-cyan),
			0 0 10px var(--color-neon-cyan),
			0 0 20px var(--color-glow-cyan),
			0 0 40px var(--color-glow-cyan);
	}
	
	.neon-cyan .sign-glow {
		background: var(--color-neon-cyan);
	}
	
	.neon-pink .sign-text {
		color: var(--color-neon-pink);
		text-shadow: 
			0 0 5px var(--color-neon-pink),
			0 0 10px var(--color-neon-pink),
			0 0 20px var(--color-glow-pink),
			0 0 40px var(--color-glow-pink);
	}
	
	.neon-pink .sign-glow {
		background: var(--color-neon-pink);
	}
	
	.neon-purple .sign-text {
		color: var(--color-neon-purple);
		text-shadow: 
			0 0 5px var(--color-neon-purple),
			0 0 10px var(--color-neon-purple),
			0 0 20px var(--color-glow-purple),
			0 0 40px var(--color-glow-purple);
	}
	
	.neon-purple .sign-glow {
		background: var(--color-neon-purple);
	}
	
	/* Flicker animation */
	@keyframes neon-flicker {
		0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
			opacity: 1;
		}
		20%, 24%, 55% {
			opacity: 0.7;
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.neon-sign {
			padding: 1rem 1.5rem;
			font-size: 1rem;
			letter-spacing: 2px;
			min-height: 52px; /* Increased for better touch targets */
			min-width: 280px; /* Consistent width for all buttons */
			width: 100%; /* Take full available width in mobile layout */
			max-width: 320px; /* But don't get too wide */
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}
		
		.sign-text {
			white-space: nowrap; /* Keep text on one line */
			overflow: hidden;
			text-overflow: ellipsis; /* Add ellipsis if text is too long */
		}
	}
</style>
