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
	<!-- Glitch frame corners -->
	<span class="corner top-left">╔</span>
	<span class="corner top-right">╗</span>
	<span class="corner bottom-left">╚</span>
	<span class="corner bottom-right">╝</span>
	
	<!-- Glitch border lines -->
	<span class="border-line top"></span>
	<span class="border-line right"></span>
	<span class="border-line bottom"></span>
	<span class="border-line left"></span>
	
	<!-- Scanline overlay -->
	<span class="scanlines"></span>
	
	<!-- Glitch effect layers -->
	<span class="glitch-layer" aria-hidden="true">{text}</span>
	<span class="glitch-layer" aria-hidden="true">{text}</span>
	
	<span class="sign-text">{text}</span>
</button>

<style>
	.neon-sign {
		position: relative;
		padding: 1.25rem 2.5rem;
		background: rgba(10, 14, 39, 0.75);
		border: none;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 3px;
		cursor: pointer;
		overflow: hidden;
		transition: all var(--transition-fast);
		pointer-events: auto;
		-webkit-tap-highlight-color: rgba(0, 255, 240, 0.2);
		touch-action: manipulation;
		z-index: 10;
		backdrop-filter: blur(8px);
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
	}
	
	/* Glitch frame corners */
	.corner {
		position: absolute;
		font-family: 'Courier New', monospace;
		font-size: 1.5rem;
		font-weight: bold;
		line-height: 1;
		z-index: 3;
		animation: corner-glitch 5s infinite;
	}
	
	.corner.top-left {
		top: -2px;
		left: -2px;
	}
	
	.corner.top-right {
		top: -2px;
		right: -2px;
	}
	
	.corner.bottom-left {
		bottom: -2px;
		left: -2px;
	}
	
	.corner.bottom-right {
		bottom: -2px;
		right: -2px;
	}
	
	@keyframes corner-glitch {
		0%, 90%, 100% {
			opacity: 1;
			transform: translate(0, 0);
		}
		91% {
			opacity: 0.8;
			transform: translate(-2px, 1px);
		}
		92% {
			opacity: 1;
			transform: translate(1px, -1px);
		}
		93% {
			opacity: 0.9;
			transform: translate(0, 0);
		}
	}
	
	/* Border lines */
	.border-line {
		position: absolute;
		background: currentColor;
		z-index: 2;
		opacity: 0.6;
	}
	
	.border-line.top,
	.border-line.bottom {
		height: 2px;
		left: 16px;
		right: 16px;
	}
	
	.border-line.left,
	.border-line.right {
		width: 2px;
		top: 16px;
		bottom: 16px;
	}
	
	.border-line.top {
		top: 0;
		animation: line-glitch-horizontal 6s infinite;
	}
	
	.border-line.bottom {
		bottom: 0;
		animation: line-glitch-horizontal 6s infinite 3s;
	}
	
	.border-line.left {
		left: 0;
		animation: line-glitch-vertical 7s infinite;
	}
	
	.border-line.right {
		right: 0;
		animation: line-glitch-vertical 7s infinite 3.5s;
	}
	
	@keyframes line-glitch-horizontal {
		0%, 94%, 100% {
			opacity: 0.6;
			transform: scaleX(1);
		}
		95% {
			opacity: 0.3;
			transform: scaleX(0.95);
		}
		96% {
			opacity: 1;
			transform: scaleX(1.05);
		}
		97% {
			opacity: 0.6;
			transform: scaleX(1);
		}
	}
	
	@keyframes line-glitch-vertical {
		0%, 92%, 100% {
			opacity: 0.6;
			transform: scaleY(1);
		}
		93% {
			opacity: 0.3;
			transform: scaleY(0.95);
		}
		94% {
			opacity: 1;
			transform: scaleY(1.05);
		}
		95% {
			opacity: 0.6;
			transform: scaleY(1);
		}
	}
	
	/* Scanline overlay */
	.scanlines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 255, 240, 0.03) 2px,
			rgba(0, 255, 240, 0.03) 4px
		);
		pointer-events: none;
		opacity: 0.5;
		animation: scanline-move 8s linear infinite;
	}
	
	@keyframes scanline-move {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(20px);
		}
	}
	
	/* Glitch text layers */
	.glitch-layer {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		text-align: center;
		z-index: 4;
		opacity: 0;
		pointer-events: none;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 3px;
	}
	
	.glitch-layer:nth-child(6) {
		animation: glitch-1 4s infinite;
	}
	
	.glitch-layer:nth-child(7) {
		animation: glitch-2 4s infinite 2s;
	}
	
	@keyframes glitch-1 {
		0%, 96%, 100% {
			opacity: 0;
		}
		97% {
			opacity: 0.8;
			transform: translate(calc(-50% - 3px), calc(-50% + 2px));
			clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
		}
		98% {
			opacity: 0.8;
			transform: translate(calc(-50% + 3px), calc(-50% - 2px));
			clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
		}
		99% {
			opacity: 0;
		}
	}
	
	@keyframes glitch-2 {
		0%, 94%, 100% {
			opacity: 0;
		}
		95% {
			opacity: 0.7;
			transform: translate(calc(-50% + 2px), calc(-50% + 3px));
			clip-path: polygon(0 20%, 100% 20%, 100% 80%, 0 80%);
		}
		96% {
			opacity: 0.7;
			transform: translate(calc(-50% - 2px), calc(-50% - 3px));
			clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
		}
		97% {
			opacity: 0;
		}
	}
	
	.sign-text {
		position: relative;
		z-index: 5;
		display: block;
		transition: all var(--transition-fast);
	}
	
	/* Hover effects */
	.neon-sign:hover {
		box-shadow: 
			inset 0 0 30px rgba(0, 0, 0, 0.6),
			0 0 20px currentColor;
	}
	
	.neon-sign:hover .corner {
		animation: corner-glitch-fast 0.3s infinite;
	}
	
	@keyframes corner-glitch-fast {
		0%, 50%, 100% {
			opacity: 1;
			transform: translate(0, 0);
		}
		25% {
			opacity: 0.7;
			transform: translate(-2px, 2px);
		}
		75% {
			opacity: 0.7;
			transform: translate(2px, -2px);
		}
	}
	
	.neon-sign:hover .border-line {
		opacity: 1;
		box-shadow: 0 0 10px currentColor;
	}
	
	.neon-sign:hover .scanlines {
		opacity: 0.8;
		animation-duration: 2s;
	}
	
	.neon-sign:active {
		transform: scale(0.98);
	}
	
	.neon-sign:active .sign-text {
		transform: scale(0.96);
	}
	
	/* Color variants */
	.neon-cyan {
		color: var(--color-neon-cyan);
	}
	
	.neon-cyan .sign-text {
		text-shadow: 
			0 0 5px var(--color-neon-cyan),
			0 0 10px var(--color-neon-cyan),
			0 0 20px var(--color-glow-cyan),
			0 0 40px var(--color-glow-cyan);
	}
	
	.neon-cyan .glitch-layer {
		color: var(--color-neon-cyan);
		text-shadow: 
			-2px 0 var(--color-neon-pink),
			2px 0 var(--color-neon-purple);
	}
	
	.neon-pink {
		color: var(--color-neon-pink);
	}
	
	.neon-pink .sign-text {
		text-shadow: 
			0 0 5px var(--color-neon-pink),
			0 0 10px var(--color-neon-pink),
			0 0 20px var(--color-glow-pink),
			0 0 40px var(--color-glow-pink);
	}
	
	.neon-pink .glitch-layer {
		color: var(--color-neon-pink);
		text-shadow: 
			-2px 0 var(--color-neon-cyan),
			2px 0 var(--color-neon-purple);
	}
	
	.neon-purple {
		color: var(--color-neon-purple);
	}
	
	.neon-purple .sign-text {
		text-shadow: 
			0 0 5px var(--color-neon-purple),
			0 0 10px var(--color-neon-purple),
			0 0 20px var(--color-glow-purple),
			0 0 40px var(--color-glow-purple);
	}
	
	.neon-purple .glitch-layer {
		color: var(--color-neon-purple);
		text-shadow: 
			-2px 0 var(--color-neon-cyan),
			2px 0 var(--color-neon-pink);
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
			overflow: hidden;
		}
		
		.sign-text {
			white-space: nowrap; /* Keep text on one line */
			overflow: hidden;
			text-overflow: ellipsis; /* Add ellipsis if text is too long */
		}
		
		/* Smaller corners on mobile */
		.corner {
			font-size: 1.25rem;
		}
		
		/* Adjust glitch layers font size */
		.glitch-layer {
			font-size: 1rem;
			letter-spacing: 2px;
		}
		
		/* Reduce animation intensity on mobile for performance */
		.neon-sign:hover .corner {
			animation: corner-glitch 5s infinite;
		}
		
		.scanlines {
			opacity: 0.3;
		}
	}
	
	/* Accessibility - reduce motion */
	@media (prefers-reduced-motion: reduce) {
		.corner,
		.border-line,
		.scanlines,
		.glitch-layer {
			animation: none !important;
		}
		
		.glitch-layer {
			display: none;
		}
	}
</style>
