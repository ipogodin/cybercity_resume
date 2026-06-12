# CyberCity Resume — CLAUDE.md

> Context file for AI coding assistants. Read this first before any work on this project.  
> **Last updated:** February 22, 2026

> **⚠️ DOCUMENTATION RULE:** Every change made to this project must be reflected in documentation.  
> After completing any code change, feature, fix, or refactor — update **this file (`CLAUDE.md`)** and the relevant file(s) in **`docs/`** to keep them accurate and in sync with the actual codebase.

---

## Project Overview

**CyberCity Resume** is an interactive cyberpunk-themed resume portfolio for **Illia Pogodin**.  
The visual metaphor is a rainy neon city — the main page is a "hub" with neon signs pointing N/S/E/W to resume sections navigable by keyboard (WASD / arrow keys) or by clicking signs.

- **Status:** ✅ All 15 implementation stages complete. Production-ready.
- **Deployed on:** Vercel
- **Stack:** SvelteKit 2 + Svelte 5 (runes) + TypeScript + Vite 7
- **Version:** 1.0.9
- **Runtime:** Node.js 22 (`@sveltejs/adapter-vercel`, `nodejs22.x`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 (Svelte 5 with runes — `$state`, `$derived`, `$props`) |
| Hosting | Vercel (`@sveltejs/adapter-vercel`) |
| Styling | CSS with custom animations, CSS variables, no CSS-in-JS |
| Rain effect | Canvas API (`RainEffect.svelte`) |
| Fonts | Orbitron, Rajdhani, Share Tech Mono (Google Fonts) |
| Images | AI-generated cyberpunk scenes (Midjourney/DALL-E style) |
| Character | Animated `.webm` video (transparent background, autoplay loop) |
| Audio | MP3 files, user opt-in, persisted in `localStorage` |

---

## Color Palette & Design

- **Background:** Dark navy `#0a0e27`, `#1a1d3f`
- **Neon Cyan:** `#00fff0` — CSS var `--color-neon-cyan`
- **Neon Pink:** `#ff006e` — CSS var `--color-neon-pink`
- **Neon Purple:** `#b900ff` — CSS var `--color-neon-purple`
- **Fonts:** `Orbitron` (headings), `Rajdhani` (body), `Share Tech Mono` (terminal/tech)
- **Mobile breakpoint:** 768px | **Tablet:** 1024px

---

## Navigation Graph

```
             Projects (/projects)
                  ↑ N
                  |
Skills (/skills) ←W— Hub (/) —E→ Contact (/contact)
                  |
                  ↓ S
           Experience (/experience)
                  |
                  ↓ S
           Education (/education)  [accessible from Skills → South]
```

**Navigation store** (`src/lib/stores/navigation.js`):
```js
hub:        { north: 'projects', east: 'contact', south: 'experience', west: 'skills' }
experience: { north: 'hub' }
skills:     { east: 'hub', south: 'education' }
projects:   { south: 'hub' }
education:  { north: 'skills' }
contact:    { west: 'hub' }
```

**Keyboard shortcuts:**
- Arrow keys or WASD → directional navigation
- `ESC` → return to hub
- `Backspace` → browser back
- Terminal input captures keys when focused; `ESC` unfocuses terminal

---

## File Structure

```
/
├── src/
│   ├── app.html                      # HTML shell, meta tags, OG tags
│   ├── app.css                       # CSS variables (colors, z-index, fonts, base)
│   ├── app.d.ts                      # TypeScript ambient declarations
│   ├── hooks.server.js               # Server hooks (minimal)
│   ├── styles/
│   │   ├── cyberpunk.css             # Neon text/border utility classes
│   │   └── animations.css            # Shared keyframe animations
│   ├── lib/
│   │   ├── index.ts                  # Re-exports lib barrel
│   │   ├── components/
│   │   │   ├── Scene.svelte          # Full-screen background image + parallax + vignette + scanlines
│   │   │   ├── Character.svelte      # Animated character (.webm video or image fallback)
│   │   │   ├── Navigation.svelte     # Holographic radar D-pad (top-right)
│   │   │   ├── NeonSign.svelte       # Clickable neon sign (hub page)
│   │   │   ├── RainEffect.svelte     # Canvas rain animation
│   │   │   ├── AudioToggle.svelte    # Rain+audio toggle (bottom-right, localStorage persist)
│   │   │   ├── LoadingScreen.svelte  # First-visit cyberpunk loading animation
│   │   │   ├── Modal.svelte          # Generic modal overlay
│   │   │   ├── ExperienceCard.svelte # Company detail card (used inside Modal)
│   │   │   ├── ProjectCard.svelte    # Project tile card
│   │   │   ├── SkillGrid.svelte      # Grid of skill categories with proficiency bars
│   │   │   └── ContactTerminal.svelte# Full interactive terminal UI (Easter egg commands)
│   │   ├── data/
│   │   │   ├── index.js              # Barrel: re-exports all data modules
│   │   │   ├── config.js             # App config: version, feature flags, timing constants
│   │   │   ├── experience.js         # Work history array (6 companies)
│   │   │   ├── skills.js             # skillCategories array (10 categories)
│   │   │   ├── projects.js           # Projects array (8 projects)
│   │   │   ├── education.js          # Education, certifications, additionalTraining
│   │   │   └── contact.js            # Contact info object + social links helpers
│   │   ├── stores/
│   │   │   └── navigation.js         # navigationGraph + location state
│   │   └── utils/
│   │       ├── keyboard.js           # Global keyboard listener + setTerminalFocused()
│   │       └── transitions.js        # Shared transition helpers
│   └── routes/
│       ├── +layout.svelte            # Root layout: loading screen, AudioToggle, Google Fonts
│       ├── +page.svelte              # Hub page (main_hub_scene.png, neon signs, character, tutorial)
│       ├── experience/+page.svelte   # Experience Avenue (buildings UI, Modal + ExperienceCard)
│       ├── skills/+page.svelte       # Skills District (SkillGrid)
│       ├── projects/+page.svelte     # Projects Alley (ProjectCard grid, 2 columns)
│       ├── education/+page.svelte    # Education Quarter (degree card, training, certs)
│       ├── contact/+page.svelte      # Contact Terminal (ContactTerminal component)
│       └── api/terminal/+server.js   # POST endpoint for interactive terminal commands
├── static/
│   ├── resume.pdf                    # Illia_Pogodin_Resume.pdf (downloadable)
│   ├── robots.txt
│   ├── sounds/
│   │   ├── rain_n_music.mp3          # Background ambient audio (used by AudioToggle)
│   │   └── rain_ambiance.mp3         # Alternate ambiance file (not currently used)
│   └── images/
│       ├── icons/                    # Favicon variants (16, 32, 192, apple-touch)
│       ├── scenes/                   # 6 background PNGs (one per route)
│       │   ├── main_hub_scene.png
│       │   ├── experience_avenue.png
│       │   ├── skills_district.png
│       │   ├── projects_alley.png
│       │   ├── education_quarter.png
│       │   └── contact_terminal.png
│       └── character/
│           ├── character_animated.webm  # ✅ Animated character (autoplay loop, muted, transparent)
│           ├── character.png            # Static fallback
│           └── character2.png           # Alternate static
├── docs/                             # Developer docs (see docs/INDEX.md for full index)
├── util_scripts/
│   └── process_character_animation.py  # Python: extract frames, remove bg, assemble WebM
├── package.json
├── svelte.config.js                  # adapter-vercel, nodejs22.x runtime
├── vite.config.ts
└── vercel.json
```

---

## Route → Scene Mapping

| Route | Scene Image | Character |
|---|---|---|
| `/` (hub) | `main_hub_scene.png` | right, scale 1.5, no entrance |
| `/experience` | `experience_avenue.png` | left, scale 1.2 |
| `/skills` | `skills_district.png` | right, scale 5 (decorative) |
| `/projects` | `projects_alley.png` | right, scale 5, mirrored |
| `/education` | `education_quarter.png` | right, scale 1 |
| `/contact` | `contact_terminal.png` | center, scale 10 (off-screen tablet) |

---

## Data Layer (`src/lib/data/`)

Import via barrel: `import { ... } from '$lib/data/index.js'`

### `config.js`
```js
config = {
  version: '1.0.9', appName: 'CyberCity Resume', author: 'Illia Pogodin',
  features: { rainEffect, audioToggle, keyboardNavigation, tutorial },
  timing: { tutorialDuration, loadingScreen, signAppearance }
}
```

### `experience.js` — 6 companies
- **Featured** (large buildings): Meta (cyan), Google (purple)
- **Non-featured** (small buildings): Salesforce (pink), Wargaming (green), IGT (gold), Prior (gray)
- Key fields: `company`, `role`, `period`, `location`, `description`, `technologies[]`, `achievements[]`, `neonColor`, `featured: bool`

### `skills.js` — 10 skill categories
Each skill has `name` and `proficiency`: `expert | advanced | intermediate | familiar`  
Categories: Languages, Backend & Frameworks, Databases, Infrastructure & Cloud, DevOps & Tools, Testing, Architecture & Design, Computer Science, Methodologies, Web Technologies.

### `projects.js` — 8 projects
Professional career projects (no personal open-source). Fields: `name`, `description`, `technologies[]`, `highlights[]`, `status` (in-progress | completed), `links: {}`.

### `education.js`
- M.S. Applied Mathematics, National University of Ukraine, Faculty of Cybernetics
- `certifications[]`: empty (placeholder structure exists)
- `additionalTraining[]`: 3 items (Distributed Systems, Algorithms, Concurrent Programming)

### `contact.js`
```js
{
  name: 'Illia Pogodin',
  email: 'illia@pogodin.ai',
  phone: '206.484.4931',
  location: 'Seattle, WA',
  resumeUrl: '/resume.pdf',
  social: { linkedin: 'https://www.linkedin.com/in/ipogodin', github: '', twitter: '', website: '' },
  tagline: 'Google me. Then call me.',
  availability: 'Currently employed at Meta'
}
```

---

## Key Components

### `Scene.svelte`
Full-screen fixed background image with mouse parallax (±10px), vignette overlay, animated scanlines. Children go into `scene-content-parallax` div (moves with parallax).

### `Character.svelte`
Props: `position` (left|center|right), `image` (default: `character_animated.webm`), `scale` (base 100×200px), `delay`, `entrance` (bottom|top|left|right|"").
- `.webm/.mp4/.ogg` → `<video autoplay loop muted playsinline>`
- Otherwise → `<img>`
- Becomes visible after `delay` ms via CSS opacity transition

### `Navigation.svelte`
Holographic radar widget. Desktop: top-right 160×160px. Mobile: top-right 120×120px opacity 0.3 (1.0 on interaction). Animated scanning beam. Reads `navigationGraph` from store.

### `AudioToggle.svelte`
Fixed bottom-right. Rain toggle dispatches `CustomEvent('rainToggle')` to `RainEffect`. Audio plays `/sounds/rain_n_music.mp3` (loop, 15% volume). Persists to `localStorage`.

### `ContactTerminal.svelte`
- Initial animation: types cyberpunk scenario (fake sudo login) on first visit
- State persisted via `sessionStorage` (`contact-terminal-state`, `contact-terminal-history`)
- Contact info block: special `type: 'contact-info'` line renders email/phone/location/resume download
- Interactive input: `↑↓` history, sends to `/api/terminal` via `fetch POST`
- `onFocusChange` callback → `setTerminalFocused()` disables global nav when typing
- Hidden input UX — looks like just a blinking cursor `█` — the terminal is an Easter egg
- Height: 600px desktop, 500px mobile

### `LoadingScreen.svelte`
First-visit only (via `sessionStorage.hasSeenLoading`). Min 2s first visit, 400ms return. Handled in `+layout.svelte`.

---

## API Route — `POST /api/terminal`

`src/routes/api/terminal/+server.js`

Accepts `{ command: string }`. Returns:
```json
{ "success": bool, "response": [{type, text}], "navigate": "/path"|null, "external": bool, "clear": bool }
```

**Supported commands:**
- Navigation: `hub`, `experience`, `skills`, `projects`, `education`
- Info: `help`, `whoami`, `get contact data [--detailed]`, `sudo get contact data --detailed`, `date`, `ls`, `pwd`, `neofetch`
- Easter eggs with canvas effects: `matrix` (matrix-rain), `hack` (scan-grid), `konami` (pixel-burst), `coffee` (steam-particles), `quote` (circuit-pulse), `ping` (network-pulse), `donate` (ukraine-wave), `rm -rf /` (file-rain), `sasha` (glitch-static), `zhenia`/`zhenya` (typing-bubbles), `vim` (vim-takeover), `git blame` (blame-waterfall), `sudo make me a sandwich` (sandwich-build), `42` (galaxy-converge), `git log` (commit-graph), `ssh illia@meta.com` (packet-flow), `uptime` (heartbeat-monitor), `cat /etc/motd` (text-coalesce)
- Utility: `clear`

`donate` returns `type: 'donate-button'` with `url: 'https://www.sternenkofund.org/en/donate'`

Canvas effects: `src/lib/utils/canvasEffects.js` — 17 effects, single export `startCanvasEffect(canvas, type, duration)`

---

## CSS Architecture

### CSS Variables (in `app.css`)
```css
--color-neon-cyan: #00fff0
--color-neon-pink: #ff006e
--color-neon-purple: #b900ff
--color-bg: dark navy
--color-glow-cyan / --color-glow-pink / --color-glow-purple
--z-background / --z-overlay / --z-scene / --z-ui
--transition-fast / --transition-normal
--cyan / --pink / --purple  (used in AudioToggle)
```

### Global Utility Classes
- `.neon-text`, `.neon-text-pink`, `.neon-text-purple`, `.neon-text-cyan`
- `.glass-card` — frosted glass panel
- `.btn-neon` — neon-bordered button
- `.tech-font` — Share Tech Mono

---

## Storage Keys

| Key | Where | Purpose |
|---|---|---|
| `hasSeenLoading` | sessionStorage | Skip loading screen on return visits |
| `hasVisited` | sessionStorage | Speed up hub tutorial on return |
| `tutorialShown` | sessionStorage | Skip tutorial if shown this session |
| `contact-terminal-state` | sessionStorage | Saved terminal lines (JSON) |
| `contact-terminal-history` | sessionStorage | Saved command history (JSON) |
| `audioEnabled` | localStorage | Persist audio on/off preference |
| `rainEnabled` | localStorage | Persist rain on/off preference |

---

## Key Patterns & Conventions

1. **Svelte 5 runes everywhere** — `$state()`, `$derived()`, `$props()`. No legacy Options API.
2. **Each route initializes keyboard navigation** — `initKeyboardNavigation()` in `onMount`, cleanup in `onDestroy`.
3. **Scene as container** — Every page wraps content in `<Scene background="..." location="...">`. Children go into the parallax layer.
4. **Navigation always present** — Each sub-page includes `<Navigation currentLocation="pagename" />`.
5. **RainEffect on every page** — `<RainEffect enabled={true} intensity={N} speed={N} />`.
6. **Data imports** — Use `$lib/data/experience.js` (direct) or `$lib/data/index.js` (barrel) — both work.
7. **No TypeScript in routes** — Routes use plain `.js`/`.svelte`; TypeScript only in `lib/index.ts` and `app.d.ts`.
8. **Mobile breakpoint:** 768px | **Tablet:** 1024px

---

## Resume Subject — Illia Pogodin

| | |
|---|---|
| **Current** | Meta, Software Engineer L5, Bellevue WA (2025–present) |
| **Previous** | Google (2024), Salesforce (2019–2023), Wargaming (2018–2019), IGT (2016–2018), Earlier (2010–2016: Deutsche Bank, Belleron, Alertme, Ocado, E-Motion) |
| **Education** | M.S. Applied Mathematics, National University of Ukraine, Faculty of Cybernetics |
| **Location** | Seattle, WA |
| **Email** | illia@pogodin.ai |
| **Phone** | 206.484.4931 |
| **LinkedIn** | linkedin.com/in/ipogodin |

---

## Development Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (runs vite build)
npm run preview    # Preview production build
```

The project builds cleanly (`vite build`, exit 0). SSR is enabled.

### Character Animation (if updating)
```bash
cd util_scripts
# After placing new .mov in static/images/character/
./.venv/bin/python process_character_animation.py
# Outputs character_animated.webm with transparent background
```

---

## Performance Notes

| Metric | Status |
|---|---|
| Total JS (gzipped) | ~131 KB |
| Total CSS (gzipped) | ~18 KB |
| Lighthouse Performance | >80 ✅ |
| LCP | <3s ✅ |
| CLS | <0.1 ✅ |
| Reduced motion | Supported ✅ |

All animations use `translateZ(0)` + `will-change` for GPU acceleration.

---

## Security & Quality

- ✅ `/api/terminal` validates `command` type (prevents 500 on array/object input)
- ✅ Content Security Policy (CSP) headers in place
- ✅ Rate limiting on terminal API endpoint
- ✅ SEO / OpenGraph meta tags on all routes
- ✅ Terminal input has `aria-label` for accessibility
- ✅ Background scenes preloaded in `<svelte:head>`
- ✅ `prefers-reduced-motion` media query respects user OS setting

---

## Docs Reference

Full documentation is in `docs/`. See [docs/INDEX.md](docs/INDEX.md) for a complete index.

| Doc | What's in it |
|---|---|
| `docs/PROJECT_STRUCTURE.md` | Authoritative file tree, component API, data schemas, CSS vars |
| `docs/STAGE_CHECKLIST.md` | All 15 stages and their completion status |
| `docs/INTERACTIVE_TERMINAL_FEATURE.md` | Terminal commands, Easter eggs, architecture |
| `docs/TERMINAL_UX_IMPROVEMENTS.md` | Terminal hidden-input UX, scroll restructuring |
| `docs/PERFORMANCE_REPORT.md` | Bundle sizes, Lighthouse targets, optimizations |
| `docs/REVIEW_PLAN.md` | Security/code issues found and fixed |
| `docs/AUDIO_SETUP.md` | Audio file specs and placement |
| `docs/animated-character-plan.md` | How `character_animated.webm` was created |
