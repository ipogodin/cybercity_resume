# CyberCity Resume — Project Structure Reference

> Use this file at the start of a new session to understand the project without scanning individual files.
> **Usage hint:** "Hey, can you do {task}, use `docs/PROJECT_STRUCTURE.md` for detailed project structure."

---

## Overview

**CyberCity Resume** is a SvelteKit 5 (Svelte 5 with runes) interactive cyberpunk-themed resume portfolio for **Illia Pogodin**. It is deployed on **Vercel** with the `@sveltejs/adapter-vercel` adapter (Node.js 22 runtime). The visual metaphor is a cyberpunk city: the main page is a "hub" with neon signs pointing N/S/E/W to different resume sections navigable by keyboard (WASD / arrows) or by clicking signs.

**Version:** 1.0.9 | **Stack:** SvelteKit 2 + Svelte 5 + TypeScript + Vite 7

---

## File Tree (source only)

```
/
├── src/
│   ├── app.html                      # HTML shell, meta tags
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
│   │   │   ├── Character.svelte      # Animated character (.webm video or image)
│   │   │   ├── Navigation.svelte     # Holographic radar D-pad (desktop top-right, mobile top-right)
│   │   │   ├── NeonSign.svelte       # Clickable neon sign (used on hub page)
│   │   │   ├── RainEffect.svelte     # Canvas rain animation (controllable intensity/speed)
│   │   │   ├── AudioToggle.svelte    # Rain+audio toggle buttons (bottom-right, localStorage persist)
│   │   │   ├── LoadingScreen.svelte  # First-visit cyberpunk loading animation
│   │   │   ├── Modal.svelte          # Generic modal overlay (used in Experience)
│   │   │   ├── ExperienceCard.svelte # Expanded company detail card (used inside Modal)
│   │   │   ├── ProjectCard.svelte    # Project tile card
│   │   │   ├── SkillGrid.svelte      # Grid of skill categories with proficiency bars
│   │   │   └── ContactTerminal.svelte# Full interactive terminal UI (see details below)
│   │   ├── data/
│   │   │   ├── index.js              # Barrel: re-exports all data modules
│   │   │   ├── config.js             # App config: version, feature flags, timing constants
│   │   │   ├── experience.js         # Work history array + helper functions
│   │   │   ├── skills.js             # skillCategories array (10 categories, proficiency levels)
│   │   │   ├── projects.js           # Projects array + status helpers
│   │   │   ├── education.js          # Education, certifications, additionalTraining
│   │   │   └── contact.js            # Contact info object + social links helpers
│   │   ├── stores/
│   │   │   └── navigation.js         # Svelte writable store: navigationGraph, location state
│   │   └── utils/
│   │       ├── keyboard.js           # Global keyboard listener (WASD/arrows/ESC/Backspace)
│   │       └── transitions.js        # Shared transition helpers
│   └── routes/
│       ├── +layout.svelte            # Root layout: loading screen, AudioToggle, Google Fonts
│       ├── +page.svelte              # Hub page (main_hub_scene.png, neon signs, character, tutorial)
│       ├── experience/+page.svelte   # Experience Avenue (buildings UI, Modal + ExperienceCard)
│       ├── skills/+page.svelte       # Skills District (SkillGrid)
│       ├── projects/+page.svelte     # Projects Alley (ProjectCard grid, 2 columns)
│       ├── education/+page.svelte    # Education Quarter (degree card, training, certifications)
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
│           ├── character_animated.webm  # Primary animated character (autoplay loop, muted)
│           ├── character.png            # Static fallback
│           └── character2.png           # Alternate static
├── docs/                             # Developer docs (this file lives here)
├── util_scripts/
│   └── process_character_animation.py # Python script for processing character animation frames
├── package.json                      # SvelteKit 2, Svelte 5, Vite 7, adapter-vercel
├── svelte.config.js                  # adapter-vercel, nodejs22.x runtime
├── vite.config.ts
└── vercel.json                       # Vercel deployment config
```

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
           Education (/education) [accessible from Skills → South]
```

**Navigation graph** (`src/lib/stores/navigation.js`):
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

## Route → Scene Mapping

| Route | Scene Image | Neon Color Theme | Character |
|---|---|---|---|
| `/` (hub) | `main_hub_scene.png` | Cyan/Purple/Pink | right, scale 1.5, no entrance |
| `/experience` | `experience_avenue.png` | Per-company neonColor | left, scale 1.2 |
| `/skills` | `skills_district.png` | Cyan | right, scale 5 (huge, decorative) |
| `/projects` | `projects_alley.png` | Pink | right, scale 5, mirrored |
| `/education` | `education_quarter.png` | Purple | right, scale 1 |
| `/contact` | `contact_terminal.png` | Cyan | center, scale 10 (off-screen on tablet) |

---

## Data Layer (`src/lib/data/`)

All data is imported via the barrel `$lib/data/index.js`.

### `config.js`
```js
config = {
  version: '1.0.9',
  appName: 'CyberCity Resume',
  author: 'Illia Pogodin',
  features: { rainEffect, audioToggle, keyboardNavigation, tutorial },
  timing: { tutorialDuration, loadingScreen, signAppearance } // first/return visit variants
}
```

### `experience.js`
Array of 6 companies. Key fields: `company`, `role`, `period`, `location`, `description`, `technologies[]`, `achievements[]`, `neonColor`, `featured: bool`.
- **Featured** (large buildings): Meta (cyan), Google (purple)
- **Non-featured** (small buildings): Salesforce (pink), Wargaming (green), IGT (gold), Prior (gray)

### `skills.js`
`skillCategories[]` — 10 categories. Each skill has `name` and `proficiency` (expert | advanced | intermediate | familiar).
Categories: Languages, Backend & Frameworks, Databases, Infrastructure & Cloud, DevOps & Tools, Testing, Architecture & Design, Computer Science, Methodologies, Web Technologies.

### `projects.js`
8 projects from professional career (no personal open-source). Fields: `name`, `description`, `technologies[]`, `highlights[]`, `status` (in-progress | completed), `links: {}`.

### `education.js`
- `education[]`: M.S. Applied Mathematics, National University of Ukraine, Faculty of Cybernetics
- `certifications[]`: empty (placeholder structure exists)
- `additionalTraining[]`: 3 items (Distributed Systems, Algorithms, Concurrent Programming)

### `contact.js`
```js
contact = {
  name: 'Illia Pogodin',
  email: 'illia.pogodin@gmail.com',
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
Full-screen fixed background image with:
- Mouse parallax effect (±10px, `enableParallax` prop)
- Vignette radial gradient overlay
- Animated scanlines (CSS `repeating-linear-gradient`)
- Children rendered in `scene-content-parallax` div (moves with parallax)

### `Character.svelte`
Props: `position` (left|center|right), `image` (default: `character_animated.webm`), `scale` (multiplier, base 100×200px), `delay`, `entrance` (bottom|top|left|right|"").
- Detects `.webm/.mp4/.ogg` → renders `<video autoplay loop muted playsinline>`
- Otherwise renders `<img>`
- Becomes visible after `delay` ms with CSS opacity transition

### `Navigation.svelte`
Holographic radar widget. Fixed position:
- Desktop: top-right, 160×160px, opacity 0.7 (1.0 on hover)
- Mobile (≤768px): top-right, 120×120px, opacity 0.3 (1.0 on hub or interaction)
- Animated scanning beam (`conic-gradient` + rotation)
- Clickable N/S/E/W direction buttons; shows destination label on hover
- Reads `navigationGraph` from store; calls `goto()` for navigation

### `AudioToggle.svelte`
Fixed bottom-right controls panel:
- Rain toggle: dispatches `CustomEvent('rainToggle')` caught by `RainEffect`
- Audio toggle: plays `/sounds/rain_n_music.mp3` (loop, default vol 15%)
- Volume slider (appears when audio on)
- Persists state to `localStorage` (`audioEnabled`, `rainEnabled`)

### `ContactTerminal.svelte`
Full-featured interactive terminal UI:
- **Initial animation**: Types out scenario (system messages, fake sudo login) on first visit
- **State persistence**: Saves/restores via `sessionStorage` (`contact-terminal-state`, `contact-terminal-history`)
- **Contact info block**: Special `type: 'contact-info'` line renders email/phone/location/resume download buttons
- **Interactive input**: Keyboard input captured, `↑↓` history, sent to `/api/terminal` via `fetch POST`
- **Keyboard interop**: `onFocusChange` callback → `setTerminalFocused()` in `keyboard.js` disables global navigation while typing
- Terminal height: 600px desktop, 500px mobile (fixed)

### `LoadingScreen.svelte`
First-visit only (checked via `sessionStorage.hasSeenLoading`). Shown for min 2s on first visit, 400ms on return. Layout handles this in `+layout.svelte`.

### `Modal.svelte`
Generic modal with `bind:isOpen` and `onClose` prop. Used in `/experience` to show `ExperienceCard` details. Closes on backdrop click or ESC (modal ESC is excluded from global keyboard handler).

---

## API Route

### `POST /api/terminal` (`src/routes/api/terminal/+server.js`)
Accepts `{ command: string }`. Returns:
```json
{ "success": bool, "response": [{type, text}], "navigate": "/path"|null, "external": bool, "clear": bool }
```
Supported commands: `help`, `whoami`, `get contact data [--detailed]`, `sudo get contact data --detailed`, `date`, `skills`, `projects`, `experience`, `education`, `hub`, `donate`, `clear`, `matrix`, `coffee`, `quote`, `hack`, `konami`, `ping`, `sudo`, `rm -rf /`, `ls`, `pwd`, `neofetch`, `sasha`, `zhenia`, `zhenya`.
- `donate` returns a `donate-button` type line with `url: 'https://www.sternenkofund.org/en/donate'`
- `skills/projects/experience/education/hub` return `navigate` field for SvelteKit `goto()`

---

## CSS Architecture

### CSS Variables (defined in `app.css`)
- Colors: `--color-neon-cyan` (#00fff0), `--color-neon-pink` (#ff006e), `--color-neon-purple` (#b900ff), `--color-bg` (dark navy)
- Glow: `--color-glow-cyan`, `--color-glow-pink`, `--color-glow-purple`
- Z-index: `--z-background`, `--z-overlay`, `--z-scene`, `--z-ui`
- Transitions: `--transition-fast`, `--transition-normal`
- Also exposes `--cyan`, `--pink`, `--purple` (used in AudioToggle)

### Fonts (loaded via Google Fonts in `+layout.svelte`)
- `Orbitron` – headings/titles (cyberpunk style)
- `Rajdhani` – body text
- `Share Tech Mono` – monospace/terminal text (`.tech-font`)

### Global Utility Classes
- `.neon-text`, `.neon-text-pink`, `.neon-text-purple`, `.neon-text-cyan`
- `.glass-card` – frosted glass panel
- `.btn-neon` – neon-bordered button
- `.tech-font` – Share Tech Mono font

---

## Session Storage Keys

| Key | Purpose |
|---|---|
| `hasSeenLoading` | Skip loading screen on return visits |
| `hasVisited` | Speed up hub tutorial on return visits |
| `tutorialShown` | Skip tutorial if already shown in session |
| `contact-terminal-state` | Saved terminal lines (JSON) |
| `contact-terminal-history` | Saved command history (JSON) |

## Local Storage Keys

| Key | Purpose |
|---|---|
| `audioEnabled` | Persist audio on/off preference |
| `rainEnabled` | Persist rain on/off preference |

---

## Deployment

- **Platform:** Vercel
- **Adapter:** `@sveltejs/adapter-vercel` with `nodejs22.x` runtime
- **Build:** `vite build`
- **Dev:** `vite dev`
- **Static assets** in `/static/` are served at root (e.g., `/resume.pdf`, `/sounds/rain_n_music.mp3`)

---

## Key Patterns & Conventions

1. **Svelte 5 runes everywhere**: `$state()`, `$derived()`, `$props()` — no legacy Options API
2. **Each route initializes keyboard navigation**: `initKeyboardNavigation()` in `onMount`, cleanup in `onDestroy`
3. **Scene as container**: Every page wraps content in `<Scene background="..." location="...">`. Children go into the parallax layer.
4. **Navigation always present**: Every sub-page includes `<Navigation currentLocation="pagename" />` (bottom-right radar)
5. **RainEffect always rendered**: Each sub-page renders `<RainEffect enabled={true} intensity={N} speed={N} />`
6. **Data imports**: Use `$lib/data/experience.js` (direct) or `$lib/data/index.js` (barrel) — both work
7. **No TypeScript in routes**: Routes use plain `.js`/`.svelte`; TypeScript only in `lib/index.ts` and `app.d.ts`
8. **Mobile breakpoint**: `768px` for mobile, `1024px` for tablet

---

## Resume Subject (Illia Pogodin)

- **Current**: Meta, Software Engineer L5, Bellevue WA (2025–present)
- **Previous**: Google (2024), Salesforce (2019–2023), Wargaming (2018–2019), IGT (2016–2018), Earlier (2010–2016: Deutsche Bank, Belleron, Alertme, Ocado, E-Motion)
- **Education**: M.S. Applied Mathematics, National University of Ukraine, Faculty of Cybernetics
- **Contact**: illia.pogodin@gmail.com | 206.484.4931 | LinkedIn: /in/ipogodin
