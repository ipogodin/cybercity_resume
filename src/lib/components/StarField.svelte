<script>
	import { onMount } from 'svelte';

	let canvas;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		let W, H, stars = [], raf;
		let mouse = { x: -9999, y: -9999 };

		const LAYERS = [
			{ count: 130, size: 0.8, speed: 0.015, minAlpha: 0.25, maxAlpha: 0.7 },
			{ count: 65,  size: 1.4, speed: 0.04,  minAlpha: 0.35, maxAlpha: 0.85 },
			{ count: 28,  size: 2.2, speed: 0.09,  minAlpha: 0.5,  maxAlpha: 1.0 },
		];

		function buildStars() {
			stars = [];
			for (const layer of LAYERS) {
				for (let i = 0; i < layer.count; i++) {
					stars.push({
						x: Math.random() * W,
						y: Math.random() * H,
						r: layer.size * (0.7 + Math.random() * 0.6),
						baseAlpha: layer.minAlpha + Math.random() * (layer.maxAlpha - layer.minAlpha),
						speed: layer.speed,
						twinkle: Math.random() * Math.PI * 2,
						twinkleSpeed: 0.005 + Math.random() * 0.018,
					});
				}
			}
		}

		function resize() {
			W = canvas.width = window.innerWidth;
			H = canvas.height = window.innerHeight;
			buildStars();
		}

		function draw() {
			ctx.clearRect(0, 0, W, H);
			const ox = mouse.x < 0 ? 0 : mouse.x - W / 2;
			const oy = mouse.y < 0 ? 0 : mouse.y - H / 2;

			for (const s of stars) {
				s.twinkle += s.twinkleSpeed;
				const alpha = s.baseAlpha * (0.72 + 0.28 * Math.sin(s.twinkle));
				const px = ((s.x - ox * s.speed) % W + W) % W;
				const py = ((s.y - oy * s.speed) % H + H) % H;

				ctx.beginPath();
				ctx.arc(px, py, s.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
				ctx.fill();
			}

			raf = requestAnimationFrame(draw);
		}

		const onResize = () => { cancelAnimationFrame(raf); resize(); draw(); };
		const onMove   = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
		const onLeave  = () => { mouse.x = -9999; mouse.y = -9999; };

		window.addEventListener('resize', onResize);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseleave', onLeave);

		resize();
		draw();

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseleave', onLeave);
		};
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
</style>
