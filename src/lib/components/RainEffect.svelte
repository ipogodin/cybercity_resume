<script>
	import { onMount, onDestroy } from 'svelte';
	
	/**
	 * RainEffect Component - Canvas-based rain animation
	 * @prop {number} [intensity=100] - Number of rain drops
	 * @prop {number} [speed=2] - Rain fall speed multiplier
	 * @prop {boolean} [enabled=true] - Enable/disable rain effect
	 */
	
	let { intensity = 100, speed = 2, enabled = true } = $props();
	
	let canvas;
	let ctx;
	let animationId;
	let drops = [];
	
	class RainDrop {
		constructor(canvasWidth, canvasHeight) {
			this.x = Math.random() * canvasWidth;
			this.y = Math.random() * canvasHeight - canvasHeight;
			this.length = Math.random() * 20 + 10;
			this.speed = Math.random() * 3 + 2;
			this.opacity = Math.random() * 0.5 + 0.3;
			this.canvasHeight = canvasHeight;
		}
		
		fall(speedMultiplier) {
			this.y += this.speed * speedMultiplier;
			
			// Reset drop when it goes off screen
			if (this.y > this.canvasHeight) {
				this.y = -this.length;
				this.x = Math.random() * canvas.width;
			}
		}
		
		draw(context) {
			context.strokeStyle = `rgba(173, 216, 230, ${this.opacity})`;
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(this.x, this.y);
			context.lineTo(this.x, this.y + this.length);
			context.stroke();
		}
	}
	
	function initRain() {
		if (!canvas || !enabled) return;
		
		ctx = canvas.getContext('2d');
		resizeCanvas();
		
		// Create rain drops
		drops = [];
		for (let i = 0; i < intensity; i++) {
			drops.push(new RainDrop(canvas.width, canvas.height));
		}
		
		animate();
	}
	
	function resizeCanvas() {
		if (!canvas) return;
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		// Recreate drops with new dimensions
		if (drops.length > 0) {
			drops = drops.map(() => new RainDrop(canvas.width, canvas.height));
		}
	}
	
	function animate() {
		if (!ctx || !canvas || !enabled) return;
		
		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Update and draw drops
		drops.forEach(drop => {
			drop.fall(speed);
			drop.draw(ctx);
		});
		
		animationId = requestAnimationFrame(animate);
	}
	
	function stopRain() {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}
	
	onMount(() => {
		initRain();
		window.addEventListener('resize', resizeCanvas);
		
		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	});
	
	onDestroy(() => {
		stopRain();
	});
	
	// Restart rain when enabled changes
	$effect(() => {
		if (enabled) {
			initRain();
		} else {
			stopRain();
			if (ctx && canvas) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	});
</script>

<canvas 
	bind:this={canvas}
	class="rain-canvas"
	class:enabled
	aria-hidden="true"
></canvas>

<style>
	.rain-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: var(--z-rain);
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	
	.rain-canvas.enabled {
		opacity: 1;
	}
</style>
