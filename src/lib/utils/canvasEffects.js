/**
 * canvasEffects.js
 * Canvas-based visual effects for the CyberCity terminal.
 * All effects are self-contained, use pure Canvas API, no external libraries.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Effect 1: scan-grid  (hack command)  4000ms
// ─────────────────────────────────────────────────────────────────────────────
function startScanGrid(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const hexChars = [];
  for (let i = 0; i < 18; i++) {
    hexChars.push({
      x: Math.floor(Math.random() * (w / 30)) * 30,
      y: Math.floor(Math.random() * (h / 30)) * 30,
      val: '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0'),
      alpha: 0,
      life: Math.random()
    });
  }

  const honeypotText = 'HONEYPOT DETECTED';
  const loggingText = 'LOGGING ATTACKER...';

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    if (progress < 0.5) {
      // Phase 1: black bg, green grid, scanning beam, hex addresses
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,255,65,0.3)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Scanning beam sweeps downward
      const phase1Progress = progress / 0.5; // 0→1 in phase 1
      const beamY = phase1Progress * (h + 40) - 20;
      const grad = ctx.createLinearGradient(0, beamY - 20, 0, beamY + 20);
      grad.addColorStop(0, 'rgba(0,255,65,0)');
      grad.addColorStop(0.5, 'rgba(0,255,65,0.6)');
      grad.addColorStop(1, 'rgba(0,255,65,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, beamY - 20, w, 40);

      // Hex addresses near beam
      ctx.font = '9px "Share Tech Mono", monospace';
      hexChars.forEach(hc => {
        const dist = Math.abs(hc.y - beamY);
        if (dist < 60) {
          hc.life += 0.05;
          const a = Math.max(0, 1 - dist / 60);
          ctx.fillStyle = `rgba(0,255,65,${a * 0.8})`;
          ctx.fillText(hc.val, hc.x, hc.y);
          if (hc.life > 1) {
            hc.val = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
            hc.life = 0;
          }
        }
      });

    } else if (progress < 0.8) {
      // Phase 2: red grid, flicker, honeypot text
      const flicker = 0.5 + 0.5 * Math.sin(elapsed * 0.05);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Red grid
      ctx.strokeStyle = `rgba(255,0,64,${0.3 + 0.2 * flicker})`;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Reverse beam sweeps upward
      const phase2Progress = (progress - 0.5) / 0.3;
      const beamY = h - phase2Progress * (h + 40) + 20;
      const grad = ctx.createLinearGradient(0, beamY - 20, 0, beamY + 20);
      grad.addColorStop(0, 'rgba(255,0,64,0)');
      grad.addColorStop(0.5, `rgba(255,0,64,${0.4 + 0.2 * flicker})`);
      grad.addColorStop(1, 'rgba(255,0,64,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, beamY - 20, w, 40);

      // Type HONEYPOT DETECTED
      const typeProgress = (progress - 0.5) / 0.3;
      const charsToShow = Math.floor(typeProgress * honeypotText.length);
      const displayed = honeypotText.slice(0, charsToShow);
      ctx.font = 'bold 24px "Share Tech Mono", monospace';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0040';
      ctx.fillStyle = '#ff0040';
      ctx.textAlign = 'center';
      ctx.fillText(displayed, w / 2, h / 2);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';

    } else {
      // Phase 3: vignette closes in, logging text, fade to black
      const phase3Progress = (progress - 0.8) / 0.2;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Red radial vignette from edges
      const innerRadius = (1 - phase3Progress) * Math.min(w, h) * 0.7;
      const outerRadius = Math.min(w, h) * 1.5;
      const vig = ctx.createRadialGradient(w / 2, h / 2, innerRadius, w / 2, h / 2, outerRadius);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(0.5, `rgba(100,0,0,${0.3 + 0.4 * phase3Progress})`);
      vig.addColorStop(1, `rgba(150,0,0,${0.7 + 0.3 * phase3Progress})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      // Logging text
      const typeProgress = Math.min(1, phase3Progress * 3);
      const charsToShow = Math.floor(typeProgress * loggingText.length);
      const displayed = loggingText.slice(0, charsToShow);
      const cursor = Math.floor(elapsed / 500) % 2 === 0 ? '█' : '';
      ctx.font = 'bold 20px "Share Tech Mono", monospace';
      ctx.fillStyle = `rgba(255,0,64,${1 - phase3Progress * 0.5})`;
      ctx.textAlign = 'center';
      ctx.fillText(displayed + cursor, w / 2, h / 2);
      ctx.textAlign = 'left';

      // Fade to black at very end
      if (phase3Progress > 0.8) {
        const fadeAlpha = (phase3Progress - 0.8) / 0.2;
        ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        ctx.fillRect(0, 0, w, h);
      }
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 2: pixel-burst  (konami command)  2500ms
// ─────────────────────────────────────────────────────────────────────────────
function startPixelBurst(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const nesPalette = ['#D62411', '#E8B800', '#00A800', '#00FFFF', '#FCFCFC', '#F26122'];
  const pixels = [];
  for (let i = 0; i < 200; i++) {
    pixels.push({
      x: w / 2,
      y: h / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16,
      size: Math.random() < 0.5 ? 8 : 16,
      color: nesPalette[Math.floor(Math.random() * nesPalette.length)],
      alpha: 1
    });
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    if (progress < 0.15) {
      // Charge phase
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      const pulseRadius = 5 + (progress / 0.15) * 15 + Math.sin(elapsed / 100) * 3;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(elapsed / 80)})`;
      ctx.fill();

    } else if (progress < 0.6) {
      // Explosion phase
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, w, h);

      pixels.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });

    } else {
      // Float & fade phase
      const fadeProgress = (progress - 0.6) / 0.4;
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, w, h);

      pixels.forEach(p => {
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - fadeProgress);

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });
      ctx.globalAlpha = 1;
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 3: steam-particles  (coffee command)  3000ms
// ─────────────────────────────────────────────────────────────────────────────
function startSteamParticles(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const colors = ['#FF8C00', '#FFF8DC', '#FFD700', '#FFA500'];
  const particles = [];

  function spawnParticle() {
    return {
      x: w / 2 + (Math.random() - 0.5) * 60,
      y: h,
      vy: -(0.5 + Math.random() * 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 3,
      alpha: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      born: Date.now()
    };
  }

  for (let i = 0; i < 60; i++) {
    const p = spawnParticle();
    p.y = h - Math.random() * h; // stagger initial positions
    particles.push(p);
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, w, h);

    // Spawn density varies
    const density = progress < 0.5 ? progress / 0.5 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
    if (Math.random() < density * 0.3) {
      particles.push(spawnParticle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = (Date.now() - p.born) / 1000;

      p.y += p.vy;
      p.x += Math.sin(elapsed / 400 + p.phase) * 0.4;

      // Fade in at birth, fade out in top 30%
      if (age < 0.5) {
        p.alpha = age / 0.5;
      } else if (p.y < h * 0.3) {
        p.alpha = Math.max(0, p.y / (h * 0.3));
      } else {
        p.alpha = 1;
      }

      if (p.y < -10) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.alpha * 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 4: circuit-pulse  (quote command)  2500ms
// ─────────────────────────────────────────────────────────────────────────────
function startCircuitPulse(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  // Generate circuit traces from center
  const traces = [];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
  for (let i = 0; i < 20; i++) {
    const points = [[w / 2, h / 2]];
    let cx = w / 2, cy = h / 2;
    const numSegs = 3 + Math.floor(Math.random() * 3);
    let lastDir = dirs[i % dirs.length];

    for (let s = 0; s < numSegs; s++) {
      // Only 0° or 90° turns
      const horizontal = Math.random() < 0.5;
      const segLen = 40 + Math.random() * 40;
      if (horizontal) {
        cx += (Math.random() < 0.5 ? 1 : -1) * segLen;
      } else {
        cy += (Math.random() < 0.5 ? 1 : -1) * segLen;
      }
      // Clamp to canvas
      cx = Math.max(10, Math.min(w - 10, cx));
      cy = Math.max(10, Math.min(h - 10, cy));
      points.push([cx, cy]);
    }

    traces.push({
      points,
      totalLength: 0,
      pulseOffset: Math.random()
    });

    // Compute total length
    let tl = 0;
    for (let p = 1; p < points.length; p++) {
      const dx = points[p][0] - points[p-1][0];
      const dy = points[p][1] - points[p-1][1];
      tl += Math.sqrt(dx*dx + dy*dy);
    }
    traces[traces.length - 1].totalLength = tl;
  }

  function getPointOnTrace(trace, frac) {
    const target = frac * trace.totalLength;
    let acc = 0;
    for (let p = 1; p < trace.points.length; p++) {
      const dx = trace.points[p][0] - trace.points[p-1][0];
      const dy = trace.points[p][1] - trace.points[p-1][1];
      const segLen = Math.sqrt(dx*dx + dy*dy);
      if (acc + segLen >= target) {
        const t = (target - acc) / segLen;
        return [
          trace.points[p-1][0] + dx * t,
          trace.points[p-1][1] + dy * t
        ];
      }
      acc += segLen;
    }
    return trace.points[trace.points.length - 1];
  }

  function drawTrace(trace, frac) {
    const target = frac * trace.totalLength;
    let acc = 0;
    ctx.beginPath();
    ctx.moveTo(trace.points[0][0], trace.points[0][1]);
    for (let p = 1; p < trace.points.length; p++) {
      const dx = trace.points[p][0] - trace.points[p-1][0];
      const dy = trace.points[p][1] - trace.points[p-1][1];
      const segLen = Math.sqrt(dx*dx + dy*dy);
      if (acc + segLen >= target) {
        const t = (target - acc) / segLen;
        ctx.lineTo(
          trace.points[p-1][0] + dx * t,
          trace.points[p-1][1] + dy * t
        );
        break;
      }
      ctx.lineTo(trace.points[p][0], trace.points[p][1]);
      acc += segLen;
    }
    ctx.stroke();
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, w, h);

    if (progress < 0.4) {
      // Phase 1: traces draw progressively
      const drawFrac = progress / 0.4;
      ctx.strokeStyle = 'rgba(0,255,240,0.4)';
      ctx.lineWidth = 1.5;
      traces.forEach(trace => {
        drawTrace(trace, drawFrac);
      });

    } else if (progress < 0.8) {
      // Phase 2: traces fully drawn, pulses travel along them
      ctx.strokeStyle = 'rgba(0,255,240,0.4)';
      ctx.lineWidth = 1.5;
      traces.forEach(trace => drawTrace(trace, 1));

      const phaseP = (progress - 0.4) / 0.4;
      traces.forEach((trace, ti) => {
        // Multiple pulses staggered
        for (let pulse = 0; pulse < 3; pulse++) {
          const pulseFrac = ((phaseP + trace.pulseOffset + pulse * 0.33) % 1);
          const [px, py] = getPointOnTrace(trace, pulseFrac);
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,255,240,0.3)';
          ctx.fill();
        }
      });

    } else {
      // Phase 3: bright radial gradient from center, fade to black
      const phaseP = (progress - 0.8) / 0.2;
      ctx.strokeStyle = 'rgba(0,255,240,0.3)';
      ctx.lineWidth = 1;
      traces.forEach(trace => drawTrace(trace, 1));

      const rg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.min(w,h)/2);
      rg.addColorStop(0, `rgba(255,255,255,${phaseP * 0.8})`);
      rg.addColorStop(0.5, `rgba(0,255,240,${phaseP * 0.3})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = `rgba(0,0,0,${phaseP})`;
      ctx.fillRect(0, 0, w, h);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 5: network-pulse  (ping command)  4000ms
// ─────────────────────────────────────────────────────────────────────────────
function startNetworkPulse(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const labels = ['gateway', 'seattle-core', 'pacific-spine', 'neon-district', 'rain-relay', 'HOME ●'];
  const nodes = labels.map((label, i) => ({
    x: (w * 0.1) + i * (w * 0.8 / 5),
    y: h * 0.4 + Math.sin(i * 1.1) * h * 0.12,
    label,
    active: false,
    pulseRadius: 0,
    pulseAlpha: 0
  }));

  const HOP_DURATION = 500; // ms per hop
  const TRAVEL_START = duration * 0.2;

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, w, h);

    if (progress < 0.2) {
      // Phase 1: nodes fade in
      const fadeP = progress / 0.2;
      ctx.strokeStyle = `rgba(255,255,255,${0.15 * fadeP})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i+1].x, nodes[i+1].y);
        ctx.stroke();
      }
      nodes.forEach((node, i) => {
        const nodeFade = Math.min(1, fadeP * nodes.length - i);
        if (nodeFade <= 0) return;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,80,90,${nodeFade})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(0,255,240,${0.5 * nodeFade})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = `rgba(0,255,240,${0.7 * nodeFade})`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 24);
        ctx.textAlign = 'left';
      });

    } else if (progress < 0.9) {
      // Phase 2: packet travels node to node
      const travelElapsed = elapsed - TRAVEL_START;
      const currentHop = Math.floor(travelElapsed / HOP_DURATION);
      const hopFrac = (travelElapsed % HOP_DURATION) / HOP_DURATION;

      // Mark active nodes
      for (let i = 0; i <= Math.min(currentHop, nodes.length - 1); i++) {
        nodes[i].active = true;
      }

      // Draw connections
      for (let i = 0; i < nodes.length - 1; i++) {
        const isTraversed = i < currentHop;
        ctx.strokeStyle = isTraversed ? 'rgba(0,255,240,0.7)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = isTraversed ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i+1].x, nodes[i+1].y);
        ctx.stroke();
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        const isActive = i <= currentHop;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(0,255,240,0.3)' : 'rgba(0,40,50,0.8)';
        ctx.fill();
        ctx.strokeStyle = isActive ? '#00fff0' : 'rgba(0,255,240,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (isActive) {
          // Pulsing glow ring
          const ringR = 10 + 15 * ((elapsed / 500) % 1);
          const ringA = 1 - ((elapsed / 500) % 1);
          ctx.beginPath();
          ctx.arc(node.x, node.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,255,240,${ringA * 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = isActive ? '#00fff0' : 'rgba(0,255,240,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 24);
        ctx.textAlign = 'left';
      });

      // Traveling dot
      if (currentHop < nodes.length - 1) {
        const fromNode = nodes[currentHop];
        const toNode = nodes[currentHop + 1];
        if (fromNode && toNode) {
          const dotX = fromNode.x + (toNode.x - fromNode.x) * hopFrac;
          const dotY = fromNode.y + (toNode.y - fromNode.y) * hopFrac;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fill();
        }
      }

    } else {
      // Phase 3: HOME pulses, all segments glow, fade to black
      const phaseP = (progress - 0.9) / 0.1;
      const homePulse = Math.sin(phaseP * Math.PI * 6);

      // All connections glow
      ctx.strokeStyle = 'rgba(0,255,240,0.8)';
      ctx.lineWidth = 2;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i+1].x, nodes[i+1].y);
        ctx.stroke();
      }

      nodes.forEach((node, i) => {
        const isHome = i === nodes.length - 1;
        const r = isHome ? 10 + Math.abs(homePulse) * 8 : 10;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHome ? 'rgba(0,255,240,0.6)' : 'rgba(0,255,240,0.2)';
        ctx.fill();
        ctx.strokeStyle = '#00fff0';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = '#00fff0';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 24);
        ctx.textAlign = 'left';
      });

      ctx.fillStyle = `rgba(0,0,0,${phaseP})`;
      ctx.fillRect(0, 0, w, h);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 6: glitch-static  (sasha command)  1500ms
// ─────────────────────────────────────────────────────────────────────────────
function startGlitchStatic(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, w, h);

    let intensity, numBands;
    if (progress < 0.6) {
      intensity = 1;
      numBands = 3 + Math.floor(Math.random() * 2);
    } else if (progress < 0.9) {
      intensity = 1;
      numBands = 6 + Math.floor(Math.random() * 3);
    } else {
      intensity = 1 - (progress - 0.9) / 0.1;
      numBands = Math.max(1, Math.floor((1 - (progress - 0.9) / 0.1) * 5));
    }

    if (intensity > 0) {
      // Glitch bands
      for (let b = 0; b < numBands; b++) {
        const by = Math.random() * h;
        const bh = 4 + Math.random() * 16;
        const bw = 80 + Math.random() * 80;
        const bx = Math.random() * (w - bw);
        const shift = (Math.random() - 0.5) * 30;
        const gray = Math.floor(Math.random() * 200 + 55);

        ctx.fillStyle = `rgba(${gray},${gray},${gray},${0.4 * intensity})`;
        ctx.fillRect(bx + shift, by, bw, bh);

        // RGB split
        ctx.fillStyle = `rgba(255,0,0,${0.3 * intensity})`;
        ctx.fillRect(bx + shift + 3, by, bw, 2);
        ctx.fillStyle = `rgba(0,0,255,${0.3 * intensity})`;
        ctx.fillRect(bx + shift - 3, by + bh - 2, bw, 2);
      }

      // Noise dots
      const noiseDots = Math.floor(50 * intensity);
      for (let n = 0; n < noiseDots; n++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        const ng = Math.floor(Math.random() * 255);
        ctx.fillStyle = `rgba(${ng},${ng},${ng},${0.6 * intensity})`;
        ctx.fillRect(nx, ny, 2, 2);
      }

      // Scanlines
      ctx.fillStyle = `rgba(0,0,0,${0.15 * intensity})`;
      for (let sl = 0; sl < h; sl += 4) {
        ctx.fillRect(0, sl, w, 1);
      }
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 7: typing-bubbles  (zhenya command)  2000ms
// ─────────────────────────────────────────────────────────────────────────────
function startTypingBubbles(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const bubbleTexts = ['...', '...', '✓', '...', '✓✓', '...', '✓', '...', '...', '✓✓', '...', '✓', '...', '✓✓', '...'];
  const bubbles = bubbleTexts.map((text, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const bw = 60 + Math.random() * 60;
    return {
      side,
      x: side === 'left' ? w * 0.1 : w * 0.9 - bw,
      y: h + 20,
      vy: -(0.7 + Math.random() * 0.3),
      delay: Math.random() * 800,
      width: bw,
      height: 28,
      text,
      phase: Math.random() * Math.PI * 2,
      spawnTime: startTime + Math.random() * 800,
      alpha: 1
    };
  });

  function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const now = Date.now();

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, w, h);

    bubbles.forEach(bubble => {
      if (now < bubble.spawnTime) return;
      if (bubble.y < -bubble.height) return;

      bubble.y += bubble.vy;
      bubble.x += Math.sin(elapsed / 500 + bubble.phase) * 0.3;

      const alpha = bubble.y < h * 0.2 ? Math.max(0, bubble.y / (h * 0.2)) : 1;

      ctx.globalAlpha = alpha;

      roundRect(bubble.x, bubble.y, bubble.width, bubble.height, 8);
      ctx.fillStyle = bubble.side === 'left' ? 'rgba(185,0,255,0.7)' : 'rgba(0,100,120,0.7)';
      ctx.fill();

      ctx.font = '11px "Share Tech Mono", monospace';
      ctx.fillStyle = bubble.side === 'left' ? '#e0b4ff' : '#00fff0';
      ctx.textAlign = 'center';
      ctx.fillText(bubble.text, bubble.x + bubble.width / 2, bubble.y + bubble.height / 2 + 4);
      ctx.textAlign = 'left';
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 8: ukraine-wave  (donate command)  3500ms
// ─────────────────────────────────────────────────────────────────────────────
function startUkraineWave(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  // Sunflower particles
  const sunflowers = [];
  for (let i = 0; i < 20; i++) {
    sunflowers.push({
      x: Math.random() * w,
      y: h * 0.5 + Math.random() * h * 0.45,
      vx: 0.2 + Math.random() * 0.5,
      r: 3,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    let globalAlpha = 1;
    if (progress < 0.3) {
      globalAlpha = progress / 0.3;
    } else if (progress > 0.9) {
      globalAlpha = (1 - progress) / 0.1;
    }

    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = globalAlpha;

    // Draw blue top section (above wave)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);

    // Wave boundary: right edge going down to wave
    const waveAmplitude = progress > 0.7 ? 8 * (1 - (progress - 0.7) / 0.2) : 8;
    // Draw the wave top: go right along top, then down the right side to wave at w
    const waveYAtRight = h / 2 + Math.sin(elapsed / 600 + w / 60) * waveAmplitude;
    ctx.lineTo(w, waveYAtRight);

    // Wave path from right to left
    for (let x = w; x >= 0; x -= 2) {
      const waveY = h / 2 + Math.sin(elapsed / 600 + x / 60) * waveAmplitude;
      ctx.lineTo(x, waveY);
    }
    ctx.closePath();

    const blueGrad = ctx.createLinearGradient(0, 0, 0, h / 2);
    blueGrad.addColorStop(0, '#0057B7');
    blueGrad.addColorStop(1, '#0066CC');
    ctx.fillStyle = blueGrad;
    ctx.fill();

    // Draw gold bottom section (below wave)
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, h / 2 + Math.sin(elapsed / 600 + w / 60) * waveAmplitude);
    for (let x = w; x >= 0; x -= 2) {
      const waveY = h / 2 + Math.sin(elapsed / 600 + x / 60) * waveAmplitude;
      ctx.lineTo(x, waveY);
    }
    ctx.closePath();

    const goldGrad = ctx.createLinearGradient(0, h / 2, 0, h);
    goldGrad.addColorStop(0, '#FFD700');
    goldGrad.addColorStop(1, '#FFC200');
    ctx.fillStyle = goldGrad;
    ctx.fill();

    // Sunflower particles in bottom half (phase 2)
    if (progress > 0.3 && progress < 0.9) {
      const sfAlpha = progress < 0.4 ? (progress - 0.3) / 0.1 : progress > 0.8 ? (0.9 - progress) / 0.1 : 1;
      ctx.globalAlpha = globalAlpha * sfAlpha;
      sunflowers.forEach(sf => {
        sf.x += sf.vx;
        if (sf.x > w + 10) sf.x = -10;

        // Center
        ctx.beginPath();
        ctx.arc(sf.x, sf.y, sf.r, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5E00';
        ctx.fill();

        // Petals
        for (let p = 0; p < 6; p++) {
          const angle = (p / 6) * Math.PI * 2 + sf.phase;
          const px = sf.x + Math.cos(angle) * sf.r * 2.5;
          const py = sf.y + Math.sin(angle) * sf.r * 2.5;
          ctx.beginPath();
          ctx.arc(px, py, sf.r * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700';
          ctx.fill();
        }
      });
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 9: file-rain  (rm -rf / command)  3500ms
// ─────────────────────────────────────────────────────────────────────────────
function startFileRain(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const filePaths = [
    '/bin/sh', '/usr/bin/python', '/etc/passwd',
    '/home/guest/cybercity/experience/meta.json',
    '/home/guest/cybercity/projects/',
    '/home/guest/cybercity/skills/',
    '/static/resume.pdf',
    '/usr/lib/node_modules/',
    '/home/guest/cybercity/education/',
    '/var/log/system.log'
  ];

  const strings = [];
  for (let i = 0; i < 25; i++) {
    strings.push({
      text: filePaths[Math.floor(Math.random() * filePaths.length)],
      x: Math.random() * w,
      y: -(Math.random() * 200),
      vy: 2 + Math.random() * 2,
      alpha: 0,
      frozen: false,
      phase: 'falling',
      color: 'rgba(255,0,64,0.9)'
    });
  }

  let flashAlpha = 0;

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = progress < 0.55 ? 'rgba(10,14,39,0.85)' : 'rgba(10,14,39,0.9)';
    ctx.fillRect(0, 0, w, h);

    if (progress < 0.45) {
      // Phase 1: strings fall with red color, red vignette
      strings.forEach(s => {
        s.y += s.vy;
        s.alpha = Math.min(1, s.alpha + 0.05);
        s.color = 'rgba(255,0,64,0.9)';

        ctx.font = '11px "Share Tech Mono", monospace';
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fillText(s.text, s.x, s.y);
      });

      // Red vignette
      const vigProgress = progress / 0.45;
      const vg = ctx.createRadialGradient(w/2, h/2, Math.min(w,h) * 0.3 * (1 - vigProgress * 0.5), w/2, h/2, Math.min(w,h));
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(0.6, `rgba(100,0,0,${0.1 * vigProgress})`);
      vg.addColorStop(1, `rgba(180,0,0,${0.4 * vigProgress})`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

    } else if (progress < 0.55) {
      // Phase 2: freeze, white flash, text turns white
      if (!strings[0].frozen) {
        strings.forEach(s => { s.frozen = true; s.color = '#ffffff'; });
      }

      flashAlpha = progress < 0.5 ? (progress - 0.45) / 0.05 : 1 - (progress - 0.5) / 0.05;

      strings.forEach(s => {
        ctx.font = '11px "Share Tech Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = s.alpha;
        ctx.fillText(s.text, s.x, s.y);
      });

      ctx.globalAlpha = Math.max(0, flashAlpha);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

    } else {
      // Phase 3: strings reverse, go upward, turn green
      strings.forEach(s => {
        if (s.frozen) {
          s.frozen = false;
          s.vy = -s.vy * 1.5;
          s.color = '#00ff88';
        }
        s.y += s.vy;
        s.vy *= 1.01; // accelerate upward
        s.alpha = Math.max(0, s.y > 0 ? Math.min(1, s.alpha) : s.alpha - 0.05);

        ctx.font = '11px "Share Tech Mono", monospace';
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillText(s.text, s.x, s.y);
      });
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 10: vim-takeover  (vim command)  3000ms
// ─────────────────────────────────────────────────────────────────────────────
function startVimTakeover(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const lineHeight = 20;
  const numTildes = 20;

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Tildes appearing sequentially
    const tildesToShow = Math.min(numTildes, Math.floor(elapsed / 30));
    ctx.font = '14px "Share Tech Mono", monospace';
    ctx.fillStyle = '#5555ff';
    for (let i = 0; i < tildesToShow; i++) {
      ctx.fillText('~', 8, (i + 1) * lineHeight);
    }

    // Block cursor blinking at line 1, col 2
    const cursorOn = Math.floor(elapsed / 500) % 2 === 0;
    if (cursorOn) {
      ctx.fillStyle = '#ffffff';
      ctx.fillText('█', 20, lineHeight);
    }

    // Status bar at bottom
    const statusH = 20;
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, h - statusH, w, statusH);

    ctx.font = '13px "Share Tech Mono", monospace';
    ctx.fillStyle = '#000000';

    let statusText = '';
    if (progress < 0.33) {
      statusText = '-- INSERT --';
    } else if (progress < 0.66) {
      statusText = 'E: Command not found';
    } else if (progress < 0.8) {
      // :q! types out
      const typeP = (progress - 0.66) / 0.14;
      const quitStr = ':q!';
      const charsToShow = Math.floor(typeP * quitStr.length);
      statusText = quitStr.slice(0, charsToShow);
    } else {
      // White flash then fade
      const flashP = (progress - 0.8) / 0.2;
      ctx.globalAlpha = Math.max(0, flashP < 0.3 ? flashP / 0.3 : 1 - (flashP - 0.3) / 0.7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    if (statusText) {
      ctx.fillStyle = '#000000';
      ctx.fillText(statusText, 6, h - statusH + 14);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 11: blame-waterfall  (git blame command)  3000ms
// ─────────────────────────────────────────────────────────────────────────────
function startBlameWaterfall(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const messages = [
    'Fixed null ptr', 'Fixed the fix', 'Reverted fix', 'Re-applied fix',
    'THIS IS THE FIX', 'Removed the fix', 'temp', 'wip', 'fix', 'cleanup', 'refactor'
  ];

  function randomHash() {
    return Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7, '0');
  }

  function randomDate() {
    const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const d = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `2024-${m}-${d}`;
  }

  const rows = [];
  for (let i = 0; i < 25; i++) {
    rows.push({
      hash: randomHash(),
      date: randomDate(),
      message: messages[Math.floor(Math.random() * messages.length)],
      x: w + Math.random() * w, // staggered start
      y: 15 + (i % 20) * 18,
      speed: 1.5 + Math.random()
    });
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, w, h);

    let rowAlpha = 1;
    if (progress < 0.2) rowAlpha = progress / 0.2;
    else if (progress > 0.8) rowAlpha = (1 - progress) / 0.2;

    ctx.font = '11px "Share Tech Mono", monospace';

    rows.forEach(row => {
      row.x -= row.speed;
      if (row.x < -600) row.x = w + Math.random() * 200;

      ctx.globalAlpha = rowAlpha;

      // hash
      ctx.fillStyle = '#555555';
      const hashText = row.hash + ' ';
      ctx.fillText(hashText, row.x, row.y);

      const hashW = ctx.measureText(hashText).width;

      // author + date
      const authorText = `(Illia Pogodin ${row.date}) `;
      ctx.fillStyle = '#FF8C00';
      ctx.fillText(authorText, row.x + hashW, row.y);

      const authorW = ctx.measureText(authorText).width;

      // message
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText(row.message, row.x + hashW + authorW, row.y);
    });

    // Final Illia Pogodin text
    if (progress > 0.8) {
      const showP = (progress - 0.8) / 0.15;
      const hideP = progress > 0.95 ? (progress - 0.95) / 0.05 : 0;
      ctx.globalAlpha = Math.max(0, Math.min(1, showP) - hideP);
      ctx.font = 'bold 28px "Share Tech Mono", monospace';
      ctx.fillStyle = '#FF8C00';
      ctx.textAlign = 'center';
      ctx.fillText('Illia Pogodin', w / 2, h / 2);
      ctx.textAlign = 'left';
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 12: sandwich-build  (sudo make me a sandwich command)  2500ms
// ─────────────────────────────────────────────────────────────────────────────
function startSandwichBuild(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const SW = 220, SX = (w - SW) / 2;
  const baseY = h * 0.75;

  const layers = [
    { label: 'Bottom Bun', color: '#D4A96A', height: 22, type: 'bun-bottom' },
    { label: 'Lettuce',    color: '#4CAF50', height: 14, type: 'lettuce' },
    { label: 'Tomato',     color: '#E53935', height: 16, type: 'plain' },
    { label: 'Cheese',     color: '#FFD600', height: 14, type: 'cheese' },
    { label: 'Patty',      color: '#5D4037', height: 20, type: 'plain' },
    { label: 'Top Bun',    color: '#D4A96A', height: 22, type: 'bun-top' }
  ];

  // Precompute target Y positions (building upward)
  let cumulativeH = 0;
  const layerData = layers.map((layer, i) => {
    const targetY = baseY - cumulativeH - layer.height;
    cumulativeH += layer.height;
    return { ...layer, targetY, startProgress: (i + 1) / 7 };
  });

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function drawLayer(layer, currentX, currentY, alpha) {
    ctx.globalAlpha = alpha;
    const lw = layer.type === 'cheese' ? SW + 8 : SW;
    const lx = currentX - (lw - SW) / 2;

    if (layer.type === 'bun-bottom' || layer.type === 'bun-top') {
      // Rounded rect
      const r = layer.type === 'bun-top' ? 10 : 5;
      ctx.beginPath();
      ctx.moveTo(lx + r, currentY);
      ctx.lineTo(lx + lw - r, currentY);
      ctx.arcTo(lx + lw, currentY, lx + lw, currentY + r, r);
      ctx.lineTo(lx + lw, currentY + layer.height - r);
      ctx.arcTo(lx + lw, currentY + layer.height, lx + lw - r, currentY + layer.height, r);
      ctx.lineTo(lx + r, currentY + layer.height);
      ctx.arcTo(lx, currentY + layer.height, lx, currentY + layer.height - r, r);
      ctx.lineTo(lx, currentY + r);
      ctx.arcTo(lx, currentY, lx + r, currentY, r);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();

      if (layer.type === 'bun-top') {
        // Sesame seeds
        ctx.fillStyle = '#FFFFFF';
        [[lw * 0.3, layer.height * 0.4], [lw * 0.5, layer.height * 0.3], [lw * 0.7, layer.height * 0.4]].forEach(([ox, oy]) => {
          ctx.beginPath();
          ctx.ellipse(lx + ox, currentY + oy, 4, 2.5, -0.3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

    } else if (layer.type === 'lettuce') {
      // Wavy lettuce
      ctx.beginPath();
      ctx.moveTo(lx, currentY + layer.height);
      for (let x = 0; x <= lw; x += 10) {
        ctx.lineTo(lx + x, currentY + Math.sin((x / lw) * Math.PI * 4) * 4);
      }
      ctx.lineTo(lx + lw, currentY + layer.height);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();

    } else {
      ctx.fillStyle = layer.color;
      ctx.fillRect(lx, currentY, lw, layer.height);
    }

    ctx.globalAlpha = 1;
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(10,14,39,0.9)';
    ctx.fillRect(0, 0, w, h);

    layerData.forEach((layer, i) => {
      if (progress < layer.startProgress) return;

      const layerProgress = Math.min(1, (progress - layer.startProgress) / (1 / 7 * 0.8));
      const eased = easeOut(Math.min(1, layerProgress * 1.5));

      // Slide in from right, then bounce
      let currentX, currentY;
      const bounceProgress = Math.max(0, layerProgress - 0.67) / 0.33;
      const bounce = Math.sin(bounceProgress * Math.PI) * 6 * Math.max(0, 1 - bounceProgress);

      if (eased < 1) {
        currentX = SX + (1 - eased) * (w + 50);
      } else {
        currentX = SX;
      }
      currentY = layer.targetY - bounce;

      drawLayer(layer, currentX, currentY, Math.min(1, layerProgress * 3));
    });

    // Golden shimmer sweep when all layers done
    if (progress > 6 / 7) {
      const sweepP = (progress - 6 / 7) / (1 / 7);
      const sweepX = SX + sweepP * (SW + 40) - 20;
      const shimmer = ctx.createLinearGradient(sweepX - 20, 0, sweepX + 20, 0);
      shimmer.addColorStop(0, 'rgba(255,215,0,0)');
      shimmer.addColorStop(0.5, 'rgba(255,215,0,0.5)');
      shimmer.addColorStop(1, 'rgba(255,215,0,0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(sweepX - 20, baseY - cumulativeH, 40, cumulativeH);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 13: galaxy-converge  (42 command)  4000ms
// ─────────────────────────────────────────────────────────────────────────────
function startGalaxyConverge(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const starColors = ['#ffffff', '#aaaaff', '#8888ff', '#ccccff'];

  // Pixel font patterns for "4" and "2" (5 wide x 7 tall grid)
  const FOUR = [
    [0,0,0,1,0],
    [0,0,1,1,0],
    [0,1,0,1,0],
    [1,0,0,1,0],
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0]
  ];
  const TWO = [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,1,1,1,1]
  ];

  const CELL = 10;
  const DIGIT_W = 5 * CELL, DIGIT_H = 7 * CELL;
  const GAP = 20;
  const TOTAL_W = DIGIT_W * 2 + GAP;
  const OFFSET_X = (w - TOTAL_W) / 2;
  const OFFSET_Y = (h - DIGIT_H) / 2;

  // Build target positions
  const targets = [];
  FOUR.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell) targets.push({ x: OFFSET_X + ci * CELL + CELL / 2, y: OFFSET_Y + ri * CELL + CELL / 2 });
    });
  });
  TWO.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell) targets.push({ x: OFFSET_X + DIGIT_W + GAP + ci * CELL + CELL / 2, y: OFFSET_Y + ri * CELL + CELL / 2 });
    });
  });

  // Stars — some assigned to targets, rest are noise
  const stars = [];
  targets.forEach((target, i) => {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      alpha: 0.4 + Math.random() * 0.6,
      twinklePhase: Math.random() * Math.PI * 2,
      target,
      isNoise: false,
      size: 1.5
    });
  });

  // Extra noise particles
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      alpha: 0.2 + Math.random() * 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      target: null,
      isNoise: true,
      size: 1
    });
  }

  function cubicEaseIn(t) { return t * t * t; }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    stars.forEach(star => {
      if (progress < 0.5) {
        // Phase 1: drift
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;

        const twinkle = 0.5 + 0.5 * Math.sin(elapsed / 300 + star.twinklePhase);
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

      } else if (progress < 0.75) {
        // Phase 2: converge to targets
        const phaseP = (progress - 0.5) / 0.25;
        if (star.target) {
          const eased = cubicEaseIn(phaseP);
          star.x = star.x + (star.target.x - star.x) * eased * 0.08;
          star.y = star.y + (star.target.y - star.y) * eased * 0.08;
        } else {
          star.x += star.vx;
          star.y += star.vy;
        }
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

      } else if (progress < 0.9) {
        // Phase 3: snap to target, glow
        if (star.target) {
          const snapP = (progress - 0.75) / 0.15;
          star.x += (star.target.x - star.x) * 0.2;
          star.y += (star.target.y - star.y) * 0.2;

          // Glow
          const pulse = 0.7 + 0.3 * Math.sin(elapsed / 150);
          ctx.globalAlpha = pulse;
          const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 6);
          grd.addColorStop(0, '#ffffff');
          grd.addColorStop(0.4, '#aaffff');
          grd.addColorStop(1, 'rgba(0,255,240,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Noise drifts off
          star.vx *= 1.02;
          star.vy *= 1.02;
          star.x += star.vx;
          star.y += star.vy;
          ctx.globalAlpha = Math.max(0, star.alpha * (1 - (progress - 0.75) / 0.15));
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // Phase 4: hold and fade
        if (star.target) {
          star.x += (star.target.x - star.x) * 0.1;
          star.y += (star.target.y - star.y) * 0.1;
          const fadeAlpha = (1 - (progress - 0.9) / 0.1) * 0.9;
          ctx.globalAlpha = fadeAlpha;
          ctx.fillStyle = '#aaffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 14: commit-graph  (git log command)  3000ms
// ─────────────────────────────────────────────────────────────────────────────
function startCommitGraph(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const MAIN_X = w * 0.25;
  const BRANCH_X = w * 0.38;
  const TOP_Y = 20;
  const COMMIT_SPACING_NORMAL = 28;

  const messages = [
    'feat: distributed consensus',
    'fix: race condition in payments',
    'refactor: clean architecture',
    'docs: update API spec',
    'feat: new payment flow',   // branch start
    'fix: branch edge case',    // branch
    'fix',
    'wip',
    '???',
    'HEAD'
  ];

  const commits = messages.map((msg, i) => {
    const isBranch = i === 4 || i === 5;
    const isChaos = i >= 6;
    const spacing = isChaos ? Math.max(12, COMMIT_SPACING_NORMAL - (i - 6) * 4) : COMMIT_SPACING_NORMAL;

    let yPos = TOP_Y;
    // Calculate y based on cumulative spacing
    let acc = TOP_Y;
    for (let j = 0; j < i; j++) {
      const prevIsChaos = j >= 6;
      const prevSpacing = prevIsChaos ? Math.max(12, COMMIT_SPACING_NORMAL - (j - 6) * 4) : COMMIT_SPACING_NORMAL;
      acc += prevSpacing;
    }
    yPos = acc;

    return {
      msg,
      x: isBranch ? BRANCH_X : MAIN_X,
      y: yPos,
      color: isBranch ? '#b900ff' : i === 9 ? '#ffffff' : '#00fff0',
      isBranch,
      isChaos,
      isHead: i === 9,
      visible: false,
      revealTime: i < 4 ? i * 200 : i < 6 ? i * 200 : (i * 200) + (i - 6) * 50
    };
  });

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, w, h);

    // Determine visible commits
    commits.forEach(c => {
      if (elapsed >= c.revealTime) c.visible = true;
    });

    const visibleCommits = commits.filter(c => c.visible);

    // Draw main branch line
    if (visibleCommits.length > 0) {
      const lastMain = visibleCommits.filter(c => !c.isBranch).slice(-1)[0];
      if (lastMain) {
        ctx.beginPath();
        ctx.moveTo(MAIN_X, TOP_Y);
        ctx.lineTo(MAIN_X, lastMain.y);
        ctx.strokeStyle = '#00fff0';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw feature branch if visible
    const branchCommits = visibleCommits.filter(c => c.isBranch);
    if (branchCommits.length > 0) {
      // Branch out from commit 3 (index 3)
      const branchStart = commits[3];
      const branchEnd = commits[branchCommits.length > 1 ? 5 : 4];

      ctx.beginPath();
      ctx.moveTo(MAIN_X, branchStart.y);
      ctx.lineTo(BRANCH_X, branchStart.y + 20);
      ctx.lineTo(BRANCH_X, branchEnd.y);
      ctx.strokeStyle = '#b900ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Merge back if both branch commits visible
      if (branchCommits.length >= 2 && visibleCommits.length > 5) {
        ctx.beginPath();
        ctx.moveTo(BRANCH_X, commits[5].y);
        ctx.lineTo(MAIN_X, commits[5].y + 20);
        ctx.strokeStyle = '#b900ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Chaos branches
    if (progress > 0.65) {
      for (let i = 6; i < visibleCommits.length; i++) {
        if (commits[i] && commits[i].visible) {
          const randX = MAIN_X + (Math.sin(i * 7.3) * 40);
          ctx.beginPath();
          ctx.moveTo(MAIN_X, commits[i].y - 10);
          ctx.lineTo(randX, commits[i].y + 5);
          ctx.strokeStyle = `rgba(255,50,50,0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw commit nodes
    visibleCommits.forEach((commit, i) => {
      const r = commit.isHead ? 8 : 6;

      if (commit.isHead) {
        // Glowing HEAD
        const pulse = 0.5 + 0.5 * Math.sin(elapsed / 200);
        ctx.shadowBlur = 15 + pulse * 10;
        ctx.shadowColor = '#ffffff';
      }

      ctx.beginPath();
      ctx.arc(commit.x, commit.y, r, 0, Math.PI * 2);
      ctx.fillStyle = commit.color;
      ctx.fill();
      ctx.strokeStyle = commit.isHead ? '#ffffff' : commit.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Message
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.fillStyle = commit.isChaos ? '#ff5555' : '#aaaaaa';
      ctx.fillText(commit.msg, commit.x + 16, commit.y + 4);
    });

    // Fade to black at end
    if (progress > 0.9) {
      ctx.fillStyle = `rgba(0,0,0,${(progress - 0.9) / 0.1})`;
      ctx.fillRect(0, 0, w, h);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 15: packet-flow  (ssh command)  3000ms
// ─────────────────────────────────────────────────────────────────────────────
function startPacketFlow(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const LEFT_X = w * 0.1, RIGHT_X = w * 0.9, MID_Y = h / 2;
  const TUNNEL_Y = MID_Y;

  // Track which noise packets have been consumed by RST
  const streamPackets = [];
  let rstFired = false;
  let rstX = RIGHT_X;
  let rstPacket = null;
  let tunnelBroken = false;
  let brokenX = -1;

  function drawNode(x, y, label, color, dim) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = dim ? 'rgba(0,40,80,0.5)' : color === '#00fff0' ? 'rgba(0,60,80,0.8)' : 'rgba(0,20,80,0.8)';
    ctx.fill();
    ctx.strokeStyle = dim ? 'rgba(100,100,100,0.4)' : color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 10px "Share Tech Mono", monospace';
    ctx.fillStyle = dim ? 'rgba(150,150,150,0.5)' : color;
    ctx.textAlign = 'center';
    ctx.fillText(label === 'Meta Corp' ? 'M' : label[0], x, y + 4);
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.fillText(label, x, y + 34);
    ctx.textAlign = 'left';
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, w, h);

    if (progress < 0.25) {
      // Phase 1: SYN, SYN-ACK, ACK handshake
      ctx.strokeStyle = 'rgba(0,255,240,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(LEFT_X + 20, TUNNEL_Y);
      ctx.lineTo(RIGHT_X - 20, TUNNEL_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawNode(LEFT_X, MID_Y, 'You', '#00fff0', false);
      drawNode(RIGHT_X, MID_Y, 'Meta Corp', '#0055ff', false);

      const packets = [
        { label: 'SYN',     startFrac: 0,    dir: 1 },
        { label: 'SYN-ACK', startFrac: 0.08, dir: -1 },
        { label: 'ACK',     startFrac: 0.16, dir: 1 }
      ];

      packets.forEach(pkt => {
        const pFrac = progress / 0.25;
        const pktFrac = Math.max(0, Math.min(1, (pFrac - pkt.startFrac) / 0.08));
        if (pktFrac <= 0) return;

        const fromX = pkt.dir === 1 ? LEFT_X + 22 : RIGHT_X - 22;
        const toX = pkt.dir === 1 ? RIGHT_X - 22 : LEFT_X + 22;
        const px = fromX + (toX - fromX) * pktFrac;

        ctx.fillStyle = '#00fff0';
        ctx.fillRect(px - 4, TUNNEL_Y - 2, 8, 4);
        ctx.font = '9px "Share Tech Mono", monospace';
        ctx.fillStyle = '#00fff0';
        ctx.textAlign = 'center';
        ctx.fillText(pkt.label, px, TUNNEL_Y - 8);
        ctx.textAlign = 'left';
      });

    } else if (progress < 0.7) {
      // Phase 2: stream of packets both directions
      ctx.strokeStyle = 'rgba(0,255,240,0.6)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00fff0';
      ctx.beginPath();
      ctx.moveTo(LEFT_X + 20, TUNNEL_Y);
      ctx.lineTo(RIGHT_X - 20, TUNNEL_Y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      drawNode(LEFT_X, MID_Y, 'You', '#00fff0', false);
      drawNode(RIGHT_X, MID_Y, 'Meta Corp', '#0055ff', false);

      // Generate stream packets based on time
      const streamElapsed = elapsed - duration * 0.25;
      const PACKET_INTERVAL = 200;
      const tunnelLen = RIGHT_X - LEFT_X - 44;

      for (let t = 0; t < streamElapsed; t += PACKET_INTERVAL) {
        const pFrac = (streamElapsed - t) / (duration * 0.45);
        if (pFrac < 0 || pFrac > 1) continue;

        // L→R
        const lrX = LEFT_X + 22 + pFrac * tunnelLen;
        const lrHex = Math.floor(Math.random() * 0xFF).toString(16).padStart(2, '0').toUpperCase() + Math.floor(Math.random() * 0xFF).toString(16).padStart(2, '0').toUpperCase();
        if (lrX < RIGHT_X - 22) {
          ctx.fillStyle = '#00fff0';
          ctx.fillRect(lrX - 3, TUNNEL_Y - 4, 6, 4);
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillStyle = 'rgba(0,255,240,0.6)';
          ctx.textAlign = 'center';
          ctx.fillText('0x' + lrHex, lrX, TUNNEL_Y - 8);
          ctx.textAlign = 'left';
        }

        // R→L (offset timing)
        const rlFrac = ((streamElapsed - t + PACKET_INTERVAL / 2) % (duration * 0.45)) / (duration * 0.45);
        const rlX = RIGHT_X - 22 - rlFrac * tunnelLen;
        if (rlX > LEFT_X + 22 && rlFrac >= 0 && rlFrac <= 1) {
          ctx.fillStyle = '#00ff88';
          ctx.fillRect(rlX - 3, TUNNEL_Y + 2, 6, 4);
          const rlHex = Math.floor(t / 100 * 37 % 256).toString(16).padStart(2, '0').toUpperCase();
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillStyle = 'rgba(0,255,136,0.6)';
          ctx.textAlign = 'center';
          ctx.fillText('0x' + rlHex, rlX, TUNNEL_Y + 14);
          ctx.textAlign = 'left';
        }
      }

    } else {
      // Phase 3: RST packet, tunnel breaks
      const phase3P = (progress - 0.7) / 0.3;

      if (!rstPacket) {
        rstX = RIGHT_X - 22;
        rstPacket = true;
      }

      rstX -= 4;
      if (rstX < LEFT_X + 22) rstX = LEFT_X + 22;

      // Draw tunnel (broken if RST has passed)
      if (!tunnelBroken) {
        ctx.strokeStyle = 'rgba(0,255,240,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(LEFT_X + 20, TUNNEL_Y);
        ctx.lineTo(RIGHT_X - 20, TUNNEL_Y);
        ctx.stroke();
      } else {
        // Draw with gap
        ctx.strokeStyle = 'rgba(255,50,50,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(LEFT_X + 20, TUNNEL_Y - 3);
        ctx.lineTo(brokenX - 10, TUNNEL_Y + 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(brokenX + 10, TUNNEL_Y - 3);
        ctx.lineTo(RIGHT_X - 20, TUNNEL_Y + 3);
        ctx.stroke();
      }

      // RST packet
      ctx.fillStyle = '#ff0040';
      ctx.fillRect(rstX - 8, TUNNEL_Y - 4, 16, 8);
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('RST', rstX, TUNNEL_Y - 8);
      ctx.textAlign = 'left';

      if (rstX <= LEFT_X + 25) {
        tunnelBroken = true;
        brokenX = LEFT_X + 40;

        // Flash red
        ctx.fillStyle = `rgba(255,0,64,${0.3 * (1 - phase3P)})`;
        ctx.fillRect(0, 0, w, h);
      }

      const dim = tunnelBroken;
      drawNode(LEFT_X, MID_Y, 'You', '#00fff0', dim);
      drawNode(RIGHT_X, MID_Y, 'Meta Corp', '#0055ff', dim);

      // Fade to black
      if (phase3P > 0.7) {
        ctx.fillStyle = `rgba(0,0,0,${(phase3P - 0.7) / 0.3})`;
        ctx.fillRect(0, 0, w, h);
      }
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 16: heartbeat-monitor  (uptime command)  2500ms
// ─────────────────────────────────────────────────────────────────────────────
function startHeartbeatMonitor(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const MID_Y = h * 0.5;
  const AMPLITUDE = 50;
  const yBuffer = new Array(w).fill(MID_Y);
  let bufferPos = 0;
  let frameCount = 0;
  let beatPhase = 0;

  // Heartbeat waveform generator
  function getHeartbeatY(frame) {
    const cycle = frame % 80;
    if (cycle < 35) return MID_Y; // baseline
    if (cycle < 38) return MID_Y - (cycle - 35) / 3 * AMPLITUDE * 1.2; // rise
    if (cycle < 40) return MID_Y - AMPLITUDE * 1.2 + (cycle - 38) / 2 * AMPLITUDE * 0.4; // small plateau
    if (cycle < 43) return MID_Y - AMPLITUDE * 0.8 + (cycle - 40) / 3 * AMPLITUDE * 1.5; // spike down
    if (cycle < 60) return MID_Y + (AMPLITUDE * 0.7) * Math.exp(-(cycle - 43) * 0.4); // decay
    return MID_Y;
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    frameCount++;
    let lineColor = '#00ff88';
    let bpm = '64 BPM';
    let isFlat = false;
    let recovering = false;

    if (progress > 0.7 && progress < 0.8) {
      // Flat line
      isFlat = true;
      lineColor = '#FFBA00';
      bpm = '0 BPM';
    } else if (progress > 0.8 && progress < 0.9) {
      // Recovery spike
      recovering = true;
      lineColor = '#00ff88';
      bpm = '64 BPM';
    }

    // Generate next y value
    let nextY;
    if (isFlat) {
      nextY = MID_Y;
    } else if (recovering && (frameCount % 80) < 5) {
      nextY = MID_Y - AMPLITUDE * 1.5;
    } else {
      nextY = getHeartbeatY(frameCount);
    }

    yBuffer[bufferPos] = nextY;
    bufferPos = (bufferPos + 1) % w;

    // Draw EKG line (scrolling from right to left)
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    for (let i = 0; i < w; i++) {
      const bufIdx = (bufferPos + i) % w;
      const y = isFlat && i < w - 5 ? MID_Y : yBuffer[bufIdx];
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();

    if (isFlat) {
      // Dashed flat line indicator
      ctx.font = '16px "Share Tech Mono", monospace';
      ctx.fillStyle = '#FFBA00';
      ctx.textAlign = 'center';
      ctx.fillText('- - - - -', w / 2, MID_Y - 20);
      ctx.textAlign = 'left';
    }

    // Top-left BPM
    ctx.font = '12px "Share Tech Mono", monospace';
    ctx.fillStyle = lineColor;
    ctx.fillText('♥ ' + bpm, 10, 20);

    // Top-right LIVE blinking dot
    const blinkOn = Math.floor(elapsed / 600) % 2 === 0;
    ctx.fillStyle = blinkOn ? '#00ff88' : 'rgba(0,255,136,0.2)';
    ctx.beginPath();
    ctx.arc(w - 30, 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE', w - 38, 18);
    ctx.textAlign = 'left';

    // Fade to black at very end
    if (progress > 0.9) {
      ctx.fillStyle = `rgba(0,0,0,${(progress - 0.9) / 0.1})`;
      ctx.fillRect(0, 0, w, h);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect 17: text-coalesce  (cat /etc/motd command)  3000ms
// ─────────────────────────────────────────────────────────────────────────────
function startTextCoalesce(canvas, duration) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const startTime = Date.now();
  let rafId;

  const lines = [
    'Write code that lasts.',
    'Ship things that matter.',
    'Debug with patience.'
  ];

  const FONT_SIZE = 16;
  const LINE_HEIGHT = 30;
  const FONT = `${FONT_SIZE}px "Share Tech Mono", monospace`;

  // Measure character positions
  ctx.font = FONT;
  const targets = [];

  lines.forEach((line, li) => {
    const lineW = ctx.measureText(line).width;
    const lineX = (w - lineW) / 2;
    const lineY = h / 2 - ((lines.length - 1) * LINE_HEIGHT) / 2 + li * LINE_HEIGHT;

    for (let ci = 0; ci < line.length; ci++) {
      const charX = lineX + ctx.measureText(line.slice(0, ci)).width + ctx.measureText(line[ci]).width / 2;
      targets.push({
        char: line[ci],
        tx: charX,
        ty: lineY
      });
    }
  });

  // Create particles, one per target + noise
  const particles = targets.map(t => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    target: t,
    isNoise: false,
    char: t.char
  }));

  // Extra noise particles
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      target: null,
      isNoise: true,
      char: String.fromCharCode(33 + Math.floor(Math.random() * 93))
    });
  }

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(rafId);
      return;
    }
    const progress = elapsed / duration;

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = FONT;

    particles.forEach(p => {
      if (progress < 0.2) {
        // Phase 1: Brownian motion, all look like noise
        p.x += p.vx + (Math.random() - 0.5) * 0.5;
        p.y += p.vy + (Math.random() - 0.5) * 0.5;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.fillStyle = 'rgba(0,255,240,0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(p.char, p.x, p.y);

      } else if (progress < 0.7) {
        // Phase 2: converge toward targets
        const phaseP = (progress - 0.2) / 0.5;
        if (p.target) {
          // Cubic ease-in attraction
          const dx = p.target.tx - p.x;
          const dy = p.target.ty - p.y;
          const speed = 0.02 + phaseP * phaseP * 0.08;
          p.vx = p.vx * 0.9 + dx * speed;
          p.vy = p.vy * 0.9 + dy * speed;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = `rgba(0,255,240,${0.4 + phaseP * 0.5})`;
        ctx.textAlign = 'center';
        ctx.fillText(p.char, p.x, p.y);

      } else if (progress < 0.9) {
        // Phase 3: at target positions, glow
        const phaseP = (progress - 0.7) / 0.2;
        if (p.target) {
          p.x += (p.target.tx - p.x) * 0.2;
          p.y += (p.target.ty - p.y) * 0.2;

          // Glow radial
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00fff0';
          ctx.fillStyle = `rgba(0,255,240,${0.7 + 0.3 * phaseP})`;
          ctx.textAlign = 'center';
          ctx.fillText(p.char, p.x, p.y);
          ctx.shadowBlur = 0;
        } else {
          // Noise drifts off
          p.vx *= 1.02;
          p.vy *= 1.02;
          p.x += p.vx;
          p.y += p.vy;
          ctx.fillStyle = `rgba(0,255,240,${Math.max(0, 0.3 * (1 - phaseP))})`;
          ctx.textAlign = 'center';
          ctx.fillText(p.char, p.x, p.y);
        }

      } else {
        // Phase 4: gentle pulse, fade to black
        const phaseP = (progress - 0.9) / 0.1;
        if (p.target) {
          p.x += (p.target.tx - p.x) * 0.1;
          p.y += (p.target.ty - p.y) * 0.1;
          ctx.globalAlpha = Math.max(0, 1 - phaseP);
          ctx.shadowBlur = 6 + Math.sin(elapsed / 100) * 3;
          ctx.shadowColor = '#00fff0';
          ctx.fillStyle = '#00fff0';
          ctx.textAlign = 'center';
          ctx.fillText(p.char, p.x, p.y);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      ctx.textAlign = 'left';
    });

    rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────────────────────────────────────

export function startCanvasEffect(canvas, type, duration) {
  if (!canvas) return () => {};
  canvas.width = canvas.offsetWidth || 580;
  canvas.height = canvas.offsetHeight || 300;

  switch (type) {
    case 'scan-grid':         return startScanGrid(canvas, duration);
    case 'pixel-burst':       return startPixelBurst(canvas, duration);
    case 'steam-particles':   return startSteamParticles(canvas, duration);
    case 'circuit-pulse':     return startCircuitPulse(canvas, duration);
    case 'network-pulse':     return startNetworkPulse(canvas, duration);
    case 'glitch-static':     return startGlitchStatic(canvas, duration);
    case 'typing-bubbles':    return startTypingBubbles(canvas, duration);
    case 'ukraine-wave':      return startUkraineWave(canvas, duration);
    case 'file-rain':         return startFileRain(canvas, duration);
    case 'vim-takeover':      return startVimTakeover(canvas, duration);
    case 'blame-waterfall':   return startBlameWaterfall(canvas, duration);
    case 'sandwich-build':    return startSandwichBuild(canvas, duration);
    case 'galaxy-converge':   return startGalaxyConverge(canvas, duration);
    case 'commit-graph':      return startCommitGraph(canvas, duration);
    case 'packet-flow':       return startPacketFlow(canvas, duration);
    case 'heartbeat-monitor': return startHeartbeatMonitor(canvas, duration);
    case 'text-coalesce':     return startTextCoalesce(canvas, duration);
    default:
      console.warn(`[canvasEffects] Unknown effect type: "${type}"`);
      return () => {};
  }
}
