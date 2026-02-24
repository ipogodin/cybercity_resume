# Terminal Commands Upgrade Plan
> Execution-ready plan. Mark desired commands with `[x]` in SELECTION before implementing.
> Last updated: 2026-02-22

---

## The Matrix Blueprint — Design Language to Follow

Before touching any command, understand what makes `matrix` exceptional:

```
Phase 1 — BUILD-UP       text only, escalating urgency, speed=fast
Phase 2 — PROGRESS BARS  anticipation, numbers, slows at the end
Phase 3 — ANOMALY        first sign of trouble, long pause
Phase 4 — CANVAS TAKEOVER  full widget replaced by canvas animation (two sub-phases)
Phase 5 — CRASH OVERLAY  centered horror text, glowing pink, overlay:true
Phase 6 — REBOOT         terminal heals itself — the reward
```

### Design Principles
1. **Narrative arc per command**: setup → escalation → canvas climax → resolution
2. **Each command owns exactly one canvas effect** — no two share the same mechanic
3. **Canvas goes in the MIDDLE** — text before it builds tension, text after is the payoff
4. **Time budget**: 8–14 seconds total including canvas (never more)
5. **Speed tells emotion**: `fast` = machine, `human` = hesitation/thought/weight
6. `delayAfter` is breathing room — longer pauses on pivotal lines

---

## Canvas Effect Reference

All canvas effects below use `type: '<effect-name>'` in the server response.
Each requires a new handler branch in `ContactTerminal.svelte` (see Implementation Notes).

| Command | Canvas Type | Duration | Visual Mechanic |
|---|---|---|---|
| `hack` | `scan-grid` | 4000ms | Radar grid scan → honeypot red alarm |
| `konami` | `pixel-burst` | 2500ms | 8-bit confetti explosion from center |
| `coffee` | `steam-particles` | 3000ms | Warm particles rising upward |
| `quote` | `circuit-pulse` | 2500ms | Circuit traces spreading with light pulses |
| `ping` | `network-pulse` | 4000ms | Nodes light up hop-by-hop with traveling packet |
| `sasha` | `glitch-static` | 1500ms | RGB channel separation + noise scan lines |
| `zhenya` | `typing-bubbles` | 2000ms | Chat "..." bubbles floating upward |
| `donate` | `ukraine-wave` | 3500ms | Blue/yellow flag wave with sunflower particles |
| `rm -rf /` | `file-rain` | 3500ms | File paths fall (red) then fly back up (green) |
| `vim` | `vim-takeover` | 3000ms | Terminal becomes a real-looking vim buffer |
| `git blame` | `blame-waterfall` | 3000ms | Code lines scroll, all highlighted Illia orange |
| `sudo make me a sandwich` | `sandwich-build` | 2500ms | Ingredient layers stack bottom-up with bounce |
| `42` | `galaxy-converge` | 4000ms | Stars drift then snap to form "42" |
| `git log` | `commit-graph` | 3000ms | Branch visualization, commits crowd into chaos |
| `ssh illia@meta.com` | `packet-flow` | 3000ms | SSH packets stream, then CLOSED slams shut |
| `uptime` | `heartbeat-monitor` | 2500ms | EKG line — flat-lines at 50%, recovers |
| `cat /etc/motd` | `text-coalesce` | 3000ms | Particles scatter then coalesce into haiku |

---

## Upgrade Plans for Existing Commands

---

### `hack` — The Honeypot

**Theme:** You try to hack the mainframe. The mainframe lets you think you're winning. Then the script flips — *you're* the one being trapped. Classic honeypot twist.

**Narrative arc:** confidence → progress → triumph → canvas alarm → horror (you're the victim) → humiliation

```js
hack: {
  response: [
    { type: 'system',  text: 'Initializing exploit framework v4.2.0...',          speed: 'fast',  delayAfter: 600  },
    { type: 'info',    text: 'Scanning target: cyber.city (127.0.0.1)',            speed: 'fast',  delayAfter: 400  },
    { type: 'info',    text: 'Open ports: 22/ssh  80/http  443/https  1337/???',   speed: 'fast',  delayAfter: 700  },
    { type: 'success', text: 'Vulnerability found: CVE-2077-31337 (CRITICAL 10.0)',speed: 'fast',  delayAfter: 800  },
    { type: 'system',  text: 'Injecting payload...',                               speed: 'human', delayAfter: 900  },
    { type: 'info',    text: 'Bypassing firewall... [████████████] 100%',          speed: 'fast',  delayAfter: 700  },
    { type: 'success', text: 'Shell established. root@cyber.city:~#',              speed: 'fast',  delayAfter: 600  },
    { type: 'success', text: 'Exfiltrating data...',                               speed: 'human', delayAfter: 400  },
    // ← canvas: the alarm fires
    { type: 'scan-grid', duration: 4000 },
    // ← the flip
    { type: 'error',   text: '⚠ ALERT: Intrusion detected on YOUR system',        speed: 'fast',  delayAfter: 400  },
    { type: 'error',   text: 'Honeypot triggered. Logging attacker...',            speed: 'fast',  delayAfter: 300  },
    { type: 'system',  text: 'Your IP: 192.168.1.1  MAC: DE:AD:BE:EF:CA:FE',      speed: 'fast',  delayAfter: 500  },
    { type: 'system',  text: 'Browser fingerprint: captured.',                     speed: 'fast',  delayAfter: 400  },
    { type: 'system',  text: 'Keystroke dynamics: logged.',                        speed: 'fast',  delayAfter: 400  },
    { type: 'error',   text: 'URANUS protocol engaged. FBI called.',               speed: 'fast',  delayAfter: 600  },
    { type: 'success', text: 'Just kidding. Nice try though. 😈',                  speed: 'human', delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `scan-grid` (4000ms)
**Visual:** A full-terminal radar grid scan that transitions into a red honeypot alarm.

```
Phase 1 — SCAN (0–50%)
  Dark background. Thin green grid lines (#00ff41) draw in from top-left.
  A bright horizontal scanning beam sweeps downward (like a radar sweep).
  Hex addresses flash briefly at random grid intersections: 0xFF4A2C, 0xDEAD...
  All calm, clinical, green — the user still thinks they're winning.

Phase 2 — ALARM (50–80%)
  Grid pulses once white. Then turns red (#ff0040).
  "HONEYPOT DETECTED" types letter by letter in the center (large, red, glowing).
  Scan beam reverses direction — now sweeping upward, hunting.
  Grid lines flicker rapidly (strobe effect at 8fps).

Phase 3 — LOCK (80–100%)
  Red vignette closes in from edges.
  Center shows: "LOGGING ATTACKER..." with blinking cursor.
  Exit: full red flash, then fade to black.
```

---

### `konami` — Full Cheat Code Experience

**Theme:** The most iconic cheat code deserves ceremony. Each button appears one at a time. Then the system breaks open.

**Narrative arc:** recognition → ritual button reveal → canvas explosion → stat patch unlocks

```js
konami: {
  response: [
    { type: 'system',  text: 'Input sequence detected...',                        speed: 'fast',  delayAfter: 400  },
    { type: 'info',    text: '↑',                                                  speed: 'human', delayAfter: 120  },
    { type: 'info',    text: '↑ ↑',                                                speed: 'human', delayAfter: 120  },
    { type: 'info',    text: '↑ ↑ ↓',                                             speed: 'human', delayAfter: 120  },
    { type: 'info',    text: '↑ ↑ ↓ ↓',                                           speed: 'human', delayAfter: 120  },
    { type: 'info',    text: '↑ ↑ ↓ ↓ ← →',                                      speed: 'human', delayAfter: 120  },
    { type: 'info',    text: '↑ ↑ ↓ ↓ ← → ← →',                                 speed: 'human', delayAfter: 120  },
    { type: 'info',    text: '↑ ↑ ↓ ↓ ← → ← → B A',                             speed: 'human', delayAfter: 300  },
    // ← canvas: pixel explosion
    { type: 'pixel-burst', duration: 2500 },
    { type: 'error',   text: '--- CHEAT MODE ACTIVATED ---',                       speed: 'fast',  delayAfter: 500  },
    { type: 'system',  text: 'Patching reality.exe...',                            speed: 'fast',  delayAfter: 600  },
    { type: 'success', text: '✓ Years of experience:    15  →  9000',             speed: 'fast',  delayAfter: 200  },
    { type: 'success', text: '✓ Bugs written:           ???  →  0',               speed: 'fast',  delayAfter: 200  },
    { type: 'success', text: '✓ Stack Overflow tabs:    47   →  ∞',               speed: 'fast',  delayAfter: 200  },
    { type: 'success', text: '✓ Coffee consumed (L):    1200 →  MAX',             speed: 'fast',  delayAfter: 400  },
    { type: 'info',    text: '+30 lives added. Use them wisely.',                  speed: 'human', delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `pixel-burst` (2500ms)
**Visual:** Old-school NES palette confetti explodes from center. Joyful chaos.

```
Phase 1 — CHARGE (0–15%)
  All pixels converge toward center. Canvas darkens.
  A small white circle pulses at the center — building pressure.

Phase 2 — EXPLOSION (15–60%)
  ~200 square "pixels" (8×8px) explode outward in all directions.
  Colors: NES palette — red #D62411, yellow #E8B800, green #00A800,
          cyan #00FFFF, white #FCFCFC, orange #F26122.
  Each pixel travels on a straight vector with slight gravity arc.
  Some larger pixels (16×16) mixed in for variety.

Phase 3 — FLOAT & FADE (60–100%)
  Pixels slow down (friction), drift downward.
  Fade out with alpha decrease.
  Last few pixels linger like embers.
```

---

### `coffee` — The Full Brew

**Theme:** The most universal programmer ritual deserves a full ceremony.

**Narrative arc:** request → canvas steam fills the terminal → ASCII cup reveals → productivity unlocked

```js
coffee: {
  response: [
    { type: 'system',  text: 'Brewing protocol initiated...',                      speed: 'fast',  delayAfter: 400  },
    { type: 'info',    text: 'Water temp: 94°C  [optimal]',                        speed: 'fast',  delayAfter: 300  },
    { type: 'info',    text: 'Grind: medium-coarse  |  Dose: 18g',                 speed: 'fast',  delayAfter: 300  },
    { type: 'system',  text: 'Brewing... [          ] 0%',                         speed: 'fast',  delayAfter: 200  },
    { type: 'system',  text: 'Brewing... [███       ] 30%',                        speed: 'fast',  delayAfter: 200  },
    { type: 'system',  text: 'Brewing... [██████    ] 60%',                        speed: 'fast',  delayAfter: 200  },
    { type: 'system',  text: 'Brewing... [█████████ ] 90%',                        speed: 'fast',  delayAfter: 300  },
    { type: 'success', text: 'Brewing... [██████████] 100%  DONE',                 speed: 'fast',  delayAfter: 300  },
    // ← canvas: the steam
    { type: 'steam-particles', duration: 3000 },
    { type: 'info',    text: '       ) ) )',                                        speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '      ( ( (',                                        speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '    .________.',                                      speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '    |        |]',                                    speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '    \\        /',                                    speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '     `------\'',                                     speed: 'fast',  delayAfter: 300  },
    { type: 'success', text: '☕  Ready. Productivity: +100%',                     speed: 'human', delayAfter: 400  },
    { type: 'info',    text: 'Side effects: strong opinions, fast typing.',         speed: 'human', delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `steam-particles` (3000ms)
**Visual:** Warm steam particles rise from the bottom — the terminal becomes a coffee shop window.

```
Particle system:
  ~60 particles active at any time, new ones spawning from bottom center.
  Colors: amber #FF8C00, cream #FFF8DC, warm white rgba(255,240,200,α).
  Shape: small circles (radius 2–5px), blur applied for softness.
  Movement: upward drift, slow (vy = -0.4 to -0.8px/frame).
  Horizontal: sine wave oscillation (organic float, not straight up).
  Opacity: fade in at birth, fade out at top 30% of canvas.

Phase 1 (0–40%): sparse steam, light density
Phase 2 (40–70%): full steam — maximum particles, warmest colors
Phase 3 (70–100%): steam thins, particles slow, gentle fade out
```

---

### `quote` — The Oracle Consults

**Theme:** The terminal reaches out to a remote oracle. Wisdom must be fetched, not generated.

**Narrative arc:** request → canvas circuit pulses seek the oracle → quote arrives at human speed

```js
quote: {
  response: () => {
    const quotes = [ /* same array */ ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    const match = q.text.match(/^"(.+)"\s*[-—]\s*(.+)$/);
    const body  = match ? `"${match[1]}"` : q.text;
    const attr  = match ? `— ${match[2]}` : '';
    return [
      { type: 'system',        text: 'Querying wisdom database...',    speed: 'fast',  delayAfter: 400 },
      { type: 'info',          text: 'Scanning 10,000 engineers...',   speed: 'fast',  delayAfter: 300 },
      // ← canvas: the oracle connects
      { type: 'circuit-pulse', duration: 2500 },
      { type: 'success',       text: 'Signal acquired.',               speed: 'fast',  delayAfter: 500 },
      { type: 'system',        text: '' },
      { type: 'info',          text: body,                             speed: 'human', delayAfter: 400 },
      { type: 'system',        text: `        ${attr}`,                speed: 'fast',  delayAfter: 0   }
    ];
  }
}
```

#### Canvas Effect: `circuit-pulse` (2500ms)
**Visual:** Circuit board traces grow across the canvas, electrical pulses travel the paths.

```
Trace generation:
  Lines spawn from center, travel only at 0°/90° angles (circuit-style right angles).
  ~20 trace paths, each branching 1–2 times.
  Color: dim cyan rgba(0,255,240,0.3) traces, bright white rgba(255,255,255,0.9) pulses.

Phase 1 (0–40%): traces draw outward from center (growing lines)
Phase 2 (40–80%): traces fully drawn. Bright pulses (dots radius 3px) travel along each trace.
  Multiple pulses per trace, staggered timing, traveling from center outward.
Phase 3 (80–100%): all pulses reach the edges. Canvas brightens. Fade to black.

The overall feeling: a brain/network searching and finding.
```

---

### `ping` — Network Story

**Theme:** A traceroute through CyberCity. Each hop is a neighborhood. The round-trip time tells a story.

**Narrative arc:** resolve → canvas shows packets hopping through the city → summary lands

```js
ping: {
  response: [
    { type: 'system',       text: 'TRACEROUTE cyber.city — max 10 hops',           speed: 'fast', delayAfter: 300 },
    // ← canvas: the route visualization
    { type: 'network-pulse', duration: 4000 },
    { type: 'info',    text: '  1  gateway.local          0.4ms',                   speed: 'fast', delayAfter: 500 },
    { type: 'info',    text: '  2  seattle-core.nw        2.1ms',                   speed: 'fast', delayAfter: 500 },
    { type: 'info',    text: '  3  pacific-spine.net      8.7ms',                   speed: 'fast', delayAfter: 600 },
    { type: 'info',    text: '  4  neon-district.cyber   12.3ms',                   speed: 'fast', delayAfter: 600 },
    { type: 'info',    text: '  5  rain-relay.city       14.0ms',                   speed: 'fast', delayAfter: 700 },
    { type: 'success', text: '  6  cyber.city (127.0.0.1) 0.042ms  ← home',        speed: 'fast', delayAfter: 500 },
    { type: 'system',  text: '' },
    { type: 'info',    text: '6 hops. 0% packet loss. All packets accounted for.',  speed: 'fast', delayAfter: 0   }
  ]
}
```

#### Canvas Effect: `network-pulse` (4000ms)
**Visual:** 6 network nodes appear across the canvas, a packet travels hop by hop.

```
Nodes: 6 circles arranged roughly left-to-right with slight vertical variation.
  Colors: dim (#333) until active, then bright neon cyan with outer glow ring.
  Labels appear above each node: "gateway", "seattle-core", "pacific-spine",
                                  "neon-district", "rain-relay", "HOME ●"

Phase 1 — NODES APPEAR (0–20%): nodes fade in one by one, connected by thin dim lines.

Phase 2 — PACKET TRAVELS (20–90%):
  A bright white dot (packet) travels from node 1 → 2 → 3 → ... → 6.
  Travel along the connecting line: smooth lerp, 500ms per hop.
  Each node it reaches: pulses bright cyan with glow ring expanding outward then fading.
  The line segment behind the packet turns bright cyan (traced route).

Phase 3 — HOME PULSE (90–100%):
  The final node (HOME) pulses with a heartbeat — expand/contract 3 times.
  All lit segments glow gently in unison.
  Fade to black.
```

---

### `sasha` — The Ritual Insult

**Theme:** Profile lookup, a glitch of static that mirrors the irreverence, then the verdict.

**Narrative arc:** lookup → canvas glitch distortion → the judgment, doubled down

```js
sasha: {
  response: [
    { type: 'system',       text: 'Looking up user profile...',       speed: 'fast',  delayAfter: 500  },
    { type: 'system',       text: 'Profile found.',                   speed: 'fast',  delayAfter: 200  },
    // ← canvas: the glitch
    { type: 'glitch-static', duration: 1500 },
    { type: 'info',          text: 'PIDIK.',                          speed: 'human', delayAfter: 1200 },
    { type: 'system',        text: 'Assessment stands.',              speed: 'fast',  delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `glitch-static` (1500ms)
**Visual:** The terminal corrupts. Fast, aggressive, abrasive.

```
Frame-by-frame corruption:
  Each frame: pick 3–8 random horizontal bands (height 4–20px).
  Shift each band left or right by a random amount (5–40px).
  Some bands: apply RGB channel separation (draw same content in red at +3px offset,
              blue at -3px offset, then the real content in white on top).
  Random noise blocks (2×2 to 8×8 px squares) fill with white/gray at random positions (~50/frame).
  Scanline overlay: thin horizontal lines every 4px, 20% opacity, flicker on/off.

Color palette: mostly white noise, neon pink (#ff006e) channel splits, cyan (#00fff0) fragments.

Phase 1 (0–60%):  moderate glitch, recognizable but corrupted
Phase 2 (60–90%): maximum glitch — bands shifting wildly, noise everywhere
Phase 3 (90–100%): rapid calm — glitch fades, static dissipates to black
```

---

### `zhenya` — The Lukewarm Compliment

**Theme:** A relationship database is queried. The evidence is weighed. The result is... mixed.

**Narrative arc:** database query → canvas of chat bubbles (evidence of conversations) → reluctant conclusion

```js
zhenya: {
  response: [
    { type: 'system',         text: 'Querying relationship_db...',          speed: 'fast',  delayAfter: 400  },
    { type: 'info',           text: 'Loading 7 years of evidence...',       speed: 'fast',  delayAfter: 300  },
    // ← canvas: the evidence
    { type: 'typing-bubbles', duration: 2000 },
    { type: 'info',           text: 'Analyzing response patterns...',       speed: 'fast',  delayAfter: 600  },
    { type: 'success',        text: 'Often responds to messages.',          speed: 'human', delayAfter: 600  },
    { type: 'system',         text: '(spelling: inconsistent)',             speed: 'fast',  delayAfter: 0    }
  ]
}
// zhenia command: same response but: '(spelling: trying harder)' at the end
```

#### Canvas Effect: `typing-bubbles` (2000ms)
**Visual:** Chat message bubbles float upward — a timeline of 7 years of conversations.

```
Bubble system: ~15 bubbles spawn from bottom, staggered timing.
  Each bubble: rounded rectangle (border-radius style via arc), varying width (40–120px), height 28px.
  Content inside: either "..." (three dots pulsing) or a single ✓ or ✓✓ (read receipt).
  Some bubbles left-aligned (Zhenya's), some right-aligned (Illia's).

Colors:
  Left bubbles (Zhenya): neon purple rgba(185,0,255,0.7) fill, purple border
  Right bubbles (Illia): dark cyan rgba(0,100,120,0.7) fill, cyan border

Movement:
  Float upward at 0.6–1.0px/frame.
  Gentle horizontal drift (±0.2px/frame, sine-based).
  Spawn with a slight bounce-in scale animation (0.8 → 1.0 over 200ms).
  Fade out when reaching top 20% of canvas.

Timing effect:
  Some bubbles have a longer delay before appearing (simulating reply lag).
  1–2 bubbles with "..." that never resolve — just float up unread.
```

---

### `donate` — The Case Before the Button

**Theme:** The cause is serious. The canvas earns the click.

**Narrative arc:** acknowledgment → canvas: Ukraine flag wave (respectful, beautiful) → impact data → the button

```js
donate: {
  response: [
    { type: 'success',      text: '💙💛 Support Ukraine 💛💙',                       speed: 'human', delayAfter: 600  },
    // ← canvas: the flag
    { type: 'ukraine-wave', duration: 3500 },
    { type: 'system',       text: '' },
    { type: 'system',       text: 'Connecting to Sternenko Fund data feed...',        speed: 'fast',  delayAfter: 500  },
    { type: 'success',      text: 'Feed connected.',                                  speed: 'fast',  delayAfter: 300  },
    { type: 'system',       text: '' },
    { type: 'info',         text: 'Field: Frontline equipment & soldier welfare',     speed: 'fast',  delayAfter: 250  },
    { type: 'info',         text: 'Transparency: 100% — all spending published',      speed: 'fast',  delayAfter: 250  },
    { type: 'info',         text: 'Overhead: near zero — volunteer-run',              speed: 'fast',  delayAfter: 250  },
    { type: 'system',       text: '' },
    { type: 'info',         text: 'ROI: highest verified impact per dollar donated',  speed: 'human', delayAfter: 700  },
    { type: 'system',       text: '' },
    { type: 'donate-button', url: 'https://www.sternenkofund.org/en/donate' }
  ]
}
```

#### Canvas Effect: `ukraine-wave` (3500ms)
**Visual:** The Ukrainian flag — blue sky over golden field — rendered as a living, waving canvas. Respectful. Beautiful.

```
Background: #000814 (deep night sky)

Flag wave:
  Top half: blue sky gradient (#0057B7 → #005BBB), rippling wave edge at boundary.
  Bottom half: golden wheat field (#FFD700 → #FFBA00), mirroring the wave.
  The boundary between blue and gold is a sine wave that animates slowly left-to-right,
  like a flag in gentle wind. Amplitude: 8px. Period: 2s full cycle.

Phase 1 (0–30%): Flag fades in from transparent. Wave begins gentle motion.

Phase 2 (30–70%): Full flag visible. Sunflower particles:
  ~20 small golden circles (r=3px) with 8 petal dots around them — simplified sunflowers.
  They drift slowly rightward across the golden field section.
  Each one slightly different speed. Some fade in/out.

Phase 3 (70–90%): Wave motion slows to near stillness. Canvas holds the full, calm flag.

Phase 4 (90–100%): Gentle fade to black. The flag impression lingers.

Note: No text on canvas. No propaganda. Just the colors and the wheat. Dignity first.
```

---

### `rm -rf /` — The Fake Apocalypse

**Theme:** Files deleting in real-time, then the Guardian fires, and every file comes home.

**Narrative arc:** deletion cascade → canvas of files raining red then flying back green → Guardian victory

```js
'rm -rf /': {
  response: [
    { type: 'system',   text: 'Executing...',                                                speed: 'fast', delayAfter: 300 },
    { type: 'error',    text: 'removed \'/bin/sh\'',                                         speed: 'fast', delayAfter: 80  },
    { type: 'error',    text: 'removed \'/usr/bin/python\'',                                 speed: 'fast', delayAfter: 80  },
    { type: 'error',    text: 'removed \'/home/guest/cybercity/experience/meta.json\'',      speed: 'fast', delayAfter: 80  },
    { type: 'error',    text: 'removed \'/home/guest/cybercity/experience/google.json\'',    speed: 'fast', delayAfter: 80  },
    { type: 'error',    text: 'removed \'/home/guest/cybercity/projects/...\' [47 items]',   speed: 'fast', delayAfter: 80  },
    { type: 'error',    text: 'removed \'/home/guest/cybercity/skills/...\' [230 items]',    speed: 'fast', delayAfter: 80  },
    { type: 'error',    text: 'removed \'/static/resume.pdf\'',                              speed: 'fast', delayAfter: 200 },
    // ← canvas: the guardian fires
    { type: 'file-rain', duration: 3500 },
    { type: 'success',  text: '⚡ SYSTEM GUARDIAN — deletion halted at 73%',                speed: 'fast', delayAfter: 500 },
    { type: 'system',   text: 'Initiating rollback from snapshot...',                        speed: 'fast', delayAfter: 400 },
    { type: 'info',     text: 'Restoring files... [████████████] 100%',                     speed: 'fast', delayAfter: 400 },
    { type: 'success',  text: 'All files restored. resume.pdf: intact.',                     speed: 'fast', delayAfter: 400 },
    { type: 'info',     text: 'Damage assessment: 0 bytes lost. Nice try though. 🛡️',       speed: 'human', delayAfter: 0  }
  ]
}
```

#### Canvas Effect: `file-rain` (3500ms)
**Visual:** File path strings fall like red rain, then reverse and fly back up in green.

```
~30 file path strings drawn as canvas text (fontSize 11px, 'Share Tech Mono').
Paths: /bin/sh, /usr/lib, /etc/passwd, /home/guest/cybercity/experience/meta.json,
       /static/resume.pdf, /usr/bin/node, /home/guest/cybercity/skills/, etc.
Each string assigned random x position, staggered start times.

Phase 1 — DELETION (0–45%):
  Strings fall from top at varying speeds (2–4px/frame).
  Color: neon pink/red rgba(255,0,64,0.9).
  Fade in as they enter from top, fade out as they exit bottom.
  Background: dark, ominous. Red vignette creeping in from edges.

Phase 2 — FREEZE (45–55%):
  Everything stops. All strings freeze in place.
  Single bright white flash fills canvas (the Guardian engaging).
  Text of all strings turns white momentarily.

Phase 3 — RESTORATION (55–100%):
  Strings reverse — now moving upward, back to where they came from.
  Color: bright green #00ff88.
  Speed increases as they rise — optimistic, energetic.
  Background: dark navy returning to normal. Red vignette gone.
  Fade out as they exit top. Last string: /static/resume.pdf fades out last.
```

---

## New Commands

---

### `vim`

**Theme:** The universal programmer trauma. 47 minutes to escape.

```js
vim: {
  response: [
    { type: 'system',      text: 'Opening vim...',                                   speed: 'fast',  delayAfter: 500  },
    // ← canvas: the vim takeover
    { type: 'vim-takeover', duration: 3000 },
    { type: 'info',    text: '~',                                                     speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '~',                                                     speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '~',                                                     speed: 'fast',  delayAfter: 60   },
    { type: 'info',    text: '"[No Name]" -- INSERT --',                              speed: 'fast',  delayAfter: 800  },
    { type: 'error',   text: 'How do I exit this thing',                              speed: 'human', delayAfter: 1000 },
    { type: 'error',   text: ':q',                                                    speed: 'human', delayAfter: 400  },
    { type: 'error',   text: 'E: No write since last change. Add ! to override',     speed: 'fast',  delayAfter: 600  },
    { type: 'error',   text: ':q!',                                                   speed: 'human', delayAfter: 300  },
    { type: 'success', text: 'Vim closed.',                                           speed: 'fast',  delayAfter: 400  },
    { type: 'info',    text: 'Time elapsed: 47 minutes.',                             speed: 'human', delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `vim-takeover` (3000ms)
**Visual:** The terminal literally becomes a vim editor buffer. The takeover is complete.

```
Canvas is styled to look exactly like a terminal vim instance:
Background: #000000 (pure black)

Tildes column:
  '~' characters drawn on the left edge, one per line, 20 lines.
  Color: #5555ff (vim default blue tilde). Font: 14px 'Share Tech Mono'.
  They appear sequentially top to bottom (30ms between each) — the buffer populating.

Cursor:
  Block cursor (█) blinking at top-left (2,1) position.
  White. Blink cycle: 500ms on / 500ms off.

Status bar at bottom:
  Full-width bar with contrasting colors (#cccccc background, #000 text).
  Reads: "-- INSERT --" for first 1000ms.
  Then changes to: "E: Command not found" (the panic).
  Then: "" (empty, just the cursor there — about to :q!).

Phase 1 (0–30%):   tildes appear, cursor blinks — calm, ominous
Phase 2 (30–60%):  '-- INSERT --' status bar, someone is typing (invisible text, cursor moves right slowly)
Phase 3 (60–80%):  status changes to error, cursor jumps to bottom command line
Phase 4 (80–100%): ':q!' types out in status bar area, flash of white, fade to black
```

---

### `git blame`

**Theme:** Every line traced back to its author. No escape.

```js
'git blame': {
  response: [
    { type: 'system',         text: 'Analyzing repository guilt...',                   speed: 'fast',  delayAfter: 500  },
    // ← canvas: the evidence scrolls
    { type: 'blame-waterfall', duration: 3000 },
    { type: 'info',    text: 'a3f2c1d (Illia Pogodin 2024-11-03) Fixed null ptr',     speed: 'fast',  delayAfter: 80   },
    { type: 'info',    text: 'b9e14aa (Illia Pogodin 2024-11-03) Fixed the fix',      speed: 'fast',  delayAfter: 80   },
    { type: 'info',    text: 'c7f99b2 (Illia Pogodin 2024-11-04) Reverted fix',       speed: 'fast',  delayAfter: 80   },
    { type: 'info',    text: 'd0b3312 (Illia Pogodin 2024-11-04) Re-applied fix',     speed: 'fast',  delayAfter: 80   },
    { type: 'info',    text: 'e2218fc (Illia Pogodin 2024-11-05) THIS IS THE FIX',    speed: 'fast',  delayAfter: 80   },
    { type: 'info',    text: 'f11a091 (Illia Pogodin 2025-01-14) Removed the fix',    speed: 'fast',  delayAfter: 300  },
    { type: 'system',  text: '' },
    { type: 'error',   text: 'All 2,847 lines: Illia Pogodin.',                       speed: 'fast',  delayAfter: 400  },
    { type: 'info',    text: 'No one else to blame. This is his house.',               speed: 'human', delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `blame-waterfall` (3000ms)
**Visual:** Endless code lines scroll from right to left, every single one highlighted in Illia's color.

```
~25 rows of text scrolling horizontally from right edge to left edge.
Each row: [hash] [Author Name] [date] [commit message]
Content: randomly assembled from real-looking commit data.
All hashes: 7-char hex strings.
All author names: "Illia Pogodin" (every single one — that's the joke).

Layout per row (Share Tech Mono, 11px):
  hash: dim gray (#555)     — "a3f2c1d "
  name: orange #FF8C00      — "(Illia Pogodin 2024-11-03) " ← this burns bright
  message: light gray #aaa  — "Fixed null ptr"

Rows stagger: each row has a different x-start-offset so they don't all exit simultaneously.
Speed: 1.5–2.5px/frame (faster rows mix with slower ones).

Phase 1 (0–20%): rows fade in from right, canvas populates
Phase 2 (20–80%): full scroll — the waterfall of blame
Phase 3 (80–100%): rows fade out. Last thing visible: one giant "Illia Pogodin" in center, fades.
```

---

### `sudo make me a sandwich`

**Theme:** xkcd #149. Sacred. Non-negotiable.

```js
'sudo make me a sandwich': {
  response: [
    { type: 'system',        text: '[sudo] password for guest: ',    speed: 'fast',  delayAfter: 1200 },
    { type: 'success',       text: 'Authentication successful.',     speed: 'fast',  delayAfter: 400  },
    // ← canvas: the sandwich builds
    { type: 'sandwich-build', duration: 2500 },
    { type: 'success',       text: 'Okay.',                          speed: 'human', delayAfter: 400  },
    { type: 'info',          text: '(see also: xkcd.com/149)',       speed: 'fast',  delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `sandwich-build` (2500ms)
**Visual:** A sandwich assembles layer by layer from the bottom up. Each ingredient slides in, bounces, settles.

```
Canvas: dark background. Sandwich centered, ~220px wide, building upward.

Layers (each slides in from the right, settles with a small bounce):
  1. Bottom bun:  tan rounded rect, height 22px, color #D4A96A
  2. Lettuce:     green wavy line layer, height 14px, color #4CAF50
  3. Tomato:      red rounded rect with slight oval shape, height 16px, #E53935
  4. Cheese:      yellow trapezoid (slightly wider), height 14px, #FFD600
  5. Patty:       dark brown rect with slightly uneven edges, height 20px, #5D4037
  6. Top bun:     tan rounded rect, height 22px, same as bottom but higher arc
                  + 3 white sesame seed dots drawn on top

Each layer entrance:
  Starts at x = canvas.width + 50 (off right edge).
  Slides left to center in ~250ms (ease-out cubic).
  On arrival: small vertical bounce (drops 6px, springs back in 150ms).
  DelayBetween layers: 250ms.

Final state: full sandwich sits centered, glowing slightly.
Phase (80–100%): a gentle golden shimmer sweeps over the sandwich left-to-right.
```

---

### `42`

**Theme:** Deep Thought computed for 7.5 million years. Time compression applied.

```js
42: {
  response: [
    { type: 'system',          text: 'Initializing Deep Thought v2.0...',             speed: 'fast',  delayAfter: 500  },
    { type: 'info',            text: 'Processing Ultimate Question...',                speed: 'fast',  delayAfter: 400  },
    { type: 'info',            text: 'ETA: 7.5 million years',                        speed: 'fast',  delayAfter: 300  },
    { type: 'system',          text: 'Applying time compression...',                  speed: 'fast',  delayAfter: 400  },
    // ← canvas: the universe computes
    { type: 'galaxy-converge', duration: 4000 },
    { type: 'success',         text: 'The answer is: 42',                             speed: 'human', delayAfter: 500  },
    { type: 'system',          text: 'Note: the Question remains unknown.',           speed: 'fast',  delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `galaxy-converge` (4000ms)
**Visual:** A galaxy of stars drifts, then snaps into the numeral "42".

```
Phase 1 — GALAXY (0–50%):
  ~300 white/blue star particles scattered across canvas.
  Each drifts slowly in a random direction (parallax starfield feel).
  Some stars twinkle (alpha oscillation 0.4–1.0 at random periods).
  Colors: #ffffff, #aaaaff, #8888ff (cool whites and blues).
  Background: deep space black.

Phase 2 — CONVERGENCE (50–75%):
  Each star's trajectory gradually bends toward one of two target zones:
    - Stars assigned to '4': converge toward the left-center glyph
    - Stars assigned to '2': converge toward the right-center glyph
  Target positions precomputed as a dot-matrix of "4" and "2" (font-rendered offscreen).
  Easing: cubic ease-in (slow start, fast finish — the gravity pull).

Phase 3 — REVEAL (75–90%):
  Stars snap to their target positions, forming a glowing "42" in the center.
  Stars now glow bright white/gold (#FFD700 tips).
  The "42" pulses: scale 1.0 → 1.05 → 1.0 over 500ms.
  Outer glow: rgba(255,215,0,0.3) radial gradient around each digit.

Phase 4 — HOLD (90–100%):
  "42" holds, glowing. Remaining drifting stars orbit slowly around it.
  Fade to black.
```

---

### `git log`

**Theme:** Commit history that starts with dignity and collapses into entropy.

```js
'git log': {
  response: [
    // ← canvas first: the graph visualization, then the readable commits follow
    { type: 'commit-graph', duration: 3000 },
    { type: 'system',  text: 'commit f9a2c31 (HEAD -> main)',                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'feat: implement distributed consensus algorithm',                speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit d7b1190',                                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'fix: resolve race condition in payment service',                 speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit c43e882',                                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'fix: actually fix it this time',                                 speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit b812aa1',                                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'fix: i have no idea why this works but it does',                 speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit a1c9de4',                                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'wip wip wip',                                                    speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit 9ff0012',                                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'final',                                                          speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit 8d3b771',                                                 speed: 'fast', delayAfter: 60  },
    { type: 'info',    text: 'final FINAL',                                                    speed: 'fast', delayAfter: 60  },
    { type: 'system',  text: 'commit 7a2c109',                                                 speed: 'fast', delayAfter: 200 },
    { type: 'info',    text: 'okay this is actually final for real this time I promise',       speed: 'fast', delayAfter: 0   }
  ]
}
```

#### Canvas Effect: `commit-graph` (3000ms)
**Visual:** A git branch graph drawing itself. Clean at first. Chaos at the end.

```
Draws a vertical git log visualization, top to bottom, ~10 commits.

Main branch: a single vertical cyan line (#00fff0) on left-center.
Each commit: a circle node on the main branch, appearing one at a time (200ms each).

First 4 commits: clean. Single line. Professional spacing.
  Commit message appears to the right of each node in light gray text (12px).

Commit 5–6: a feature branch appears (branch line goes right, 45° angle, then continues down).
  Branch color: neon purple (#b900ff). A node on it. Merges back.

Commit 7–10: spacing between nodes decreases (commits crowding).
  Messages get shorter in the preview text: "fix" / "wip" / "???"
  Branch lines start appearing more chaotically — branches branching, some not merging.
  A merge commit shows two lines converging — but their colors are wrong (glitch).

Final frame:
  The graph is dense, tangled. Lines overlap. Some branch arrows point left (backwards).
  The most recent node flashes: HEAD — bright white glow.
```

---

### `ssh illia@meta.com`

**Theme:** SSH into the mothership. Brief unauthorized glimpse. Then the door slams.

```js
'ssh illia@meta.com': {
  response: [
    { type: 'system',     text: 'Connecting to meta.com (157.240.x.x)...',          speed: 'fast',  delayAfter: 700  },
    { type: 'success',    text: 'SSH handshake complete. TLS 1.3.',                  speed: 'fast',  delayAfter: 400  },
    { type: 'system',     text: '[2FA] Push notification sent to device...',         speed: 'fast',  delayAfter: 1200 },
    { type: 'success',    text: 'Authentication successful.',                        speed: 'fast',  delayAfter: 300  },
    // ← canvas: the network connection
    { type: 'packet-flow', duration: 3000 },
    { type: 'info',       text: 'Welcome to Meta Corp Internal Network.',            speed: 'fast',  delayAfter: 300  },
    { type: 'info',       text: 'Last login: today, as usual.',                     speed: 'fast',  delayAfter: 300  },
    { type: 'system',     text: '' },
    { type: 'error',      text: '⚠ You are not supposed to see this. Logging off.', speed: 'human', delayAfter: 500  },
    { type: 'system',     text: 'Connection closed by remote host.',                 speed: 'fast',  delayAfter: 0    }
  ]
}
```

#### Canvas Effect: `packet-flow` (3000ms)
**Visual:** SSH data packets stream across the canvas through a live network path — then the connection is killed.

```
Two labeled nodes:
  LEFT:  "You" — small cyan terminal icon/circle, left-center
  RIGHT: "Meta Corp" — glowing blue "M" (Meta logo-ish), right-center
  Connected by a thin line (the SSH tunnel).

Phase 1 — HANDSHAKE (0–25%):
  3 packets (small bright rectangles, 8×4px) travel left → right (SYN, SYN-ACK, ACK).
  Each labeled with tiny text: "SYN" / "SYN-ACK" / "ACK".
  Color: cyan #00fff0. The tunnel line glows as they pass through.

Phase 2 — DATA STREAM (25–70%):
  Continuous stream of small packets flowing left → right (sending commands).
  Mixed with return packets right → left (data coming back).
  Different colors: cyan out, green in.
  Packets carry tiny unreadable hex data labels (atmosphere).
  Tunnel glows steadily. Connection feels established, alive.

Phase 3 — TERMINATION (70–100%):
  A large red packet (2× normal size, labeled "RST") fires from the RIGHT node.
  It travels left, consuming/canceling all in-flight packets (they blink out on contact).
  When it hits the left node: the tunnel line flashes red then breaks (gap in the middle).
  Both nodes dim. Canvas fades to black.
```

---

### `uptime`

**Theme:** 15 years, 0 crashes. The machine — and the engineer — just keeps running.

```js
uptime: {
  response: [
    // ← canvas first: the heartbeat is established
    { type: 'heartbeat-monitor', duration: 2500 },
    { type: 'info',    text: ' 23:47:12 up 15 years, 3 months, 14 days',         speed: 'fast',  delayAfter: 200 },
    { type: 'info',    text: ' load average: 0.01, 0.01, 0.00',                  speed: 'fast',  delayAfter: 200 },
    { type: 'system',  text: '' },
    { type: 'info',    text: 'This machine has been coding since 2010.',          speed: 'fast',  delayAfter: 300 },
    { type: 'success', text: 'No crashes. No burnout. No days off.',              speed: 'human', delayAfter: 0   }
  ]
}
```

#### Canvas Effect: `heartbeat-monitor` (2500ms)
**Visual:** A medical EKG monitor — the system has a heartbeat. And it briefly flatlines.

```
Background: deep black. Top-right corner: tiny blinking green dot + "LIVE".
Scrolling EKG line: bright green #00ff88, 2px stroke, scrolling rightward at 2px/frame.

EKG waveform (repeating):
  Flat baseline, then: sharp upward spike (QRS complex), brief plateau, return to baseline.
  Each heartbeat cycle: ~60 frames (1 second at 60fps).
  Two full heartbeats in the first 70% of duration.

Phase 1 (0–70%): two normal heartbeats. Regular, steady. Clean green line.
  Heart rate indicator in top-left: "♥ 64 BPM" (fake display text on canvas).

Phase 2 (70–80%) — FLATLINE:
  The line suddenly goes flat. Pure horizontal.
  A single tone symbol (- - - - - -) on the line.
  Color shifts from green to amber #FFBA00.
  "0 BPM" flashes in the heart rate display. Ominous half-second of silence.

Phase 3 (80–100%) — RECOVERY:
  Line snaps back: one large spike (recovery beat), then resumes normal rhythm.
  Color returns to green. BPM reads "64" again.
  Fade to black. The system lives.
```

---

### `cat /etc/motd`

**Theme:** The message of the day materializes out of the void.

```js
'cat /etc/motd': {
  response: [
    { type: 'system',        text: '--- /etc/motd ---',                         speed: 'fast',  delayAfter: 300 },
    // ← canvas: the text coalesces
    { type: 'text-coalesce', duration: 3000 },
    { type: 'info',          text: '' },
    { type: 'info',          text: '  Write code that lasts.',                  speed: 'human', delayAfter: 400 },
    { type: 'info',          text: '  Ship things that matter.',                speed: 'human', delayAfter: 400 },
    { type: 'info',          text: '  Debug with patience.',                    speed: 'human', delayAfter: 600 },
    { type: 'info',          text: '' },
    { type: 'system',        text: '— /etc/motd, last updated: always',         speed: 'fast',  delayAfter: 0  }
  ]
}
```

#### Canvas Effect: `text-coalesce` (3000ms)
**Visual:** Particles scatter randomly across the canvas, then slowly converge to spell out the three haiku lines.

```
Target: three lines of text, centered on canvas:
  Line 1: "Write code that lasts."
  Line 2: "Ship things that matter."
  Line 3: "Debug with patience."

Each character of the target text is represented by a particle.
  ~80 total particles (one per character, with some extras that never land).
  Particle color: neon cyan #00fff0. Radius: 2px.

Phase 1 — SCATTER (0–20%):
  All particles spawn at random positions across the full canvas.
  They drift slowly in random directions (Brownian motion).
  Canvas: dark. The particles look like noise.

Phase 2 — CONVERGENCE (20–70%):
  Each particle's drift bends toward its target character position.
  Easing: starts slow, accelerates as it gets closer.
  Particles don't teleport — they flow like liquid settling.

Phase 3 — FORMATION (70–90%):
  Particles arrive at their positions. The three lines are now legible.
  Each character glows: small radial gradient around each particle.
  Extra "noise" particles that have no target drift off-screen.

Phase 4 — HOLD & FADE (90–100%):
  The formed text pulses once gently (scale 1.0 → 1.03 → 1.0).
  Fade to black.
```

---

## Implementation Notes

### Frontend changes required (`ContactTerminal.svelte`)
Each new canvas type needs a branch in the `executeCommand` loop, similar to the existing `matrix-rain` handler:

```js
if (line.type === 'scan-grid')           { /* start scan-grid canvas */ }
if (line.type === 'pixel-burst')         { /* start pixel-burst canvas */ }
if (line.type === 'steam-particles')     { /* start steam-particles canvas */ }
if (line.type === 'circuit-pulse')       { /* start circuit-pulse canvas */ }
if (line.type === 'network-pulse')       { /* start network-pulse canvas */ }
if (line.type === 'glitch-static')       { /* start glitch-static canvas */ }
if (line.type === 'typing-bubbles')      { /* start typing-bubbles canvas */ }
if (line.type === 'ukraine-wave')        { /* start ukraine-wave canvas */ }
if (line.type === 'file-rain')           { /* start file-rain canvas */ }
if (line.type === 'vim-takeover')        { /* start vim-takeover canvas */ }
if (line.type === 'blame-waterfall')     { /* start blame-waterfall canvas */ }
if (line.type === 'sandwich-build')      { /* start sandwich-build canvas */ }
if (line.type === 'galaxy-converge')     { /* start galaxy-converge canvas */ }
if (line.type === 'commit-graph')        { /* start commit-graph canvas */ }
if (line.type === 'packet-flow')         { /* start packet-flow canvas */ }
if (line.type === 'heartbeat-monitor')   { /* start heartbeat-monitor canvas */ }
if (line.type === 'text-coalesce')       { /* start text-coalesce canvas */ }
```

All canvas effects use the same overlay div + canvas already in the component:
```html
<!-- Existing matrix overlay reused for all canvas effects -->
<div class="matrix-rain-overlay"> <canvas bind:this={matrixCanvasRef}></canvas> </div>
```

Each canvas renderer function is: `startXxxEffect(canvas, duration)` → returns `stopFn`.
Pattern identical to existing `startMatrixRain()`.

### Server changes required (`+server.js`)
Only add new `type` strings to the response arrays — no new logic needed server-side.
Validation of command input: already present.

---

## SELECTION — Mark `[x]` to implement

### Existing command upgrades
```
[X] hack         — Honeypot + scan-grid canvas
[X] konami       — Button ritual + pixel-burst canvas
[X] coffee       — Brew ceremony + steam-particles canvas
[X] quote        — Oracle ceremony + circuit-pulse canvas
[X] ping         — Traceroute + network-pulse canvas
[X] sasha        — Profile lookup + glitch-static canvas
[X] zhenya       — Relationship DB + typing-bubbles canvas
[X] donate       — Impact buildup + ukraine-wave canvas
[X] rm -rf /     — Cascade deletion + file-rain canvas
```

### New commands
```
[X] vim                        — vim-takeover canvas
[X] git blame                  — blame-waterfall canvas
[X] sudo make me a sandwich    — sandwich-build canvas
[X] 42                         — galaxy-converge canvas
[X] git log                    — commit-graph canvas
[X] ssh illia@meta.com         — packet-flow canvas
[X] uptime                     — heartbeat-monitor canvas
[X] cat /etc/motd              — text-coalesce canvas
```
