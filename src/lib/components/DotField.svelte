<script>
	import { onMount } from 'svelte';

	let canvas;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		const SPACING = 28;
		const DOT_R = 1.4;
		const GRAVITY_R = 160;
		const MAX_PULL = 38;

		let W, H, dots = [];
		let mouse = { x: -9999, y: -9999 };
		let raf;

		function resize() {
			W = canvas.width = window.innerWidth;
			H = canvas.height = window.innerHeight;
			buildGrid();
		}

		function buildGrid() {
			dots = [];
			const cols = Math.ceil(W / SPACING) + 2;
			const rows = Math.ceil(H / SPACING) + 2;
			const ox = (W % SPACING) / 2;
			const oy = (H % SPACING) / 2;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					dots.push({ ox: ox + c * SPACING, oy: oy + r * SPACING, x: ox + c * SPACING, y: oy + r * SPACING });
				}
			}
		}

		function draw() {
			ctx.clearRect(0, 0, W, H);
			for (const d of dots) {
				const dx = mouse.x - d.ox;
				const dy = mouse.y - d.oy;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < GRAVITY_R && dist > 0) {
					const strength = Math.pow(1 - dist / GRAVITY_R, 2);
					d.x = d.ox + (dx / dist) * strength * MAX_PULL;
					d.y = d.oy + (dy / dist) * strength * MAX_PULL;
				} else {
					d.x += (d.ox - d.x) * 0.12;
					d.y += (d.oy - d.y) * 0.12;
				}

				const disp = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
				const alpha = 0.10 + 0.28 * (1 - Math.min(disp / MAX_PULL, 1));
				ctx.beginPath();
				ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
				ctx.fill();
			}
			raf = requestAnimationFrame(draw);
		}

		const onResize = () => { cancelAnimationFrame(raf); resize(); draw(); };
		const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
		const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

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
