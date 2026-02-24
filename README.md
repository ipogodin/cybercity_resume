# CyberCity Resume

An interactive cyberpunk-themed resume website with game-like navigation through a rainy neon city. Explore different "districts" representing resume sections by navigating with keyboard controls.

**Live Site:** [cybercity.vercel.app](https://cybercity.vercel.app)
**Status:** Production-ready (v1.0.9)

---

## Project Overview

An immersive, cyberpunk-themed digital resume showcasing backend engineering experience (Meta, Google, and more) in an interactive format.

**Key Features:**
- Game-like keyboard navigation (Arrow keys / WASD)
- Atmospheric rain effects with parallax backgrounds
- Interactive work experience with detailed company "buildings"
- Skills visualization as tech district
- Projects showcase as cyberpunk alley
- Interactive terminal with Easter egg commands and canvas effects
- Animated character with transparent WebM background
- Ambient audio with user opt-in toggle
- Mobile-responsive design with holographic radar D-pad

---

## Tech Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes — `$state`, `$derived`, `$props`)
- **Language:** TypeScript
- **Build Tool:** Vite 7
- **Styling:** Custom CSS with cyberpunk theme, no CSS-in-JS
- **Effects:** Canvas rain, CSS parallax, 17 canvas Easter egg effects
- **Hosting:** Vercel (`@sveltejs/adapter-vercel`, Node.js 22)
- **Fonts:** Orbitron, Rajdhani, Share Tech Mono (Google Fonts)
- **Audio:** MP3 ambient audio with localStorage persistence

---

## Quick Start

### Prerequisites
- Node.js 22+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cyberCity

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore the cyberpunk city!

---

## Navigation

**Desktop:**
- Arrow Keys / WASD — Navigate between districts
- ESC — Return to hub / unfocus terminal
- Backspace — Go back
- Click neon signs — Quick navigation

**Mobile:**
- Holographic radar D-pad (top-right)
- Tap interactive elements

### Navigation Map

```
         Projects (/projects)
              ↑ N
              |
Skills (/skills) ←W— Hub (/) —E→ Contact (/contact)
              |
              ↓ S
       Experience (/experience)
              |
              ↓ S (from Skills)
       Education (/education)
```

---

## Project Structure

```
cyberCity/
├── src/
│   ├── routes/                  # SvelteKit routes
│   │   ├── +page.svelte         # Main hub (home)
│   │   ├── experience/          # Experience Avenue
│   │   ├── skills/              # Skills District
│   │   ├── projects/            # Projects Alley
│   │   ├── education/           # Education Quarter
│   │   ├── contact/             # Contact Terminal
│   │   └── api/terminal/        # POST terminal command API
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   ├── data/                # Resume content
│   │   ├── stores/              # Navigation state
│   │   └── utils/               # Keyboard nav, transitions, canvas effects
│   └── styles/                  # CSS files
├── static/
│   ├── resume.pdf               # Downloadable resume
│   ├── sounds/                  # Ambient audio files
│   └── images/                  # AI-generated scene backgrounds + character
└── docs/                        # Developer documentation
```

---

## City Districts

### Main Hub
The central intersection — starting point. Navigate to any district from here.

### Experience Avenue (South)
Walk through professional experience. Click company "buildings" for detailed work history:
- **Featured:** Meta (L5 Engineer), Google (Senior Engineer)
- **Previous:** Salesforce, Wargaming, IGT, and more

### Skills District (West)
10 skill categories with proficiency bars: Languages, Backend & Frameworks, Databases, Infrastructure & Cloud, DevOps & Tools, Testing, Architecture & Design, CS, Methodologies, Web Technologies.

### Projects Alley (North)
8 professional career projects with descriptions, tech stacks, and highlights.

### Education Quarter (South from Skills)
M.S. Applied Mathematics, National University of Ukraine, Faculty of Cybernetics — plus certifications and additional training.

### Contact Terminal (East)
Futuristic interactive terminal — Easter egg commands, canvas effects, contact info, and resume download. Try typing `help`.

---

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## Content Updates

Resume data lives in `src/lib/data/`:
- `experience.js` — Work history (6 companies)
- `skills.js` — Technical skills (10 categories)
- `projects.js` — Projects (8 entries)
- `education.js` — Degrees, certifications, training
- `contact.js` — Contact info and social links
- `config.js` — App config, feature flags, timing constants

---

## Deployment

Deployed on Vercel with auto-deploy on push to `main`. Configured via `svelte.config.js` (`@sveltejs/adapter-vercel`, `nodejs22.x`).

---

## Performance

| Metric | Status |
|---|---|
| Total JS (gzipped) | ~131 KB |
| Total CSS (gzipped) | ~18 KB |
| Lighthouse Performance | >80 |
| LCP | <3s |
| CLS | <0.1 |
| Reduced motion | Supported |

---

## Design Philosophy

- **Visual Style:** Blade Runner-inspired cyberpunk with rain-soaked neon streets
- **Color Palette:** Dark navy, cyan `#00fff0`, pink `#ff006e`, purple `#b900ff`
- **Interaction:** Game-like exploration encourages discovery
- **Accessibility:** Keyboard navigation, `aria-label` on inputs, `prefers-reduced-motion` support

---

## Credits

- **Design Inspiration:** Blade Runner, Cyberpunk 2077, Ghost in the Shell
- **AI Images:** Generated for cyberpunk aesthetic (Midjourney/DALL-E style)
- **Fonts:** Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
- **Framework:** SvelteKit team and community

---

## License

MIT License — Feel free to use this as a template for your own resume!

---

## Contact

**Illia Pogodin**
- Email: [illia.pogodin@gmail.com](mailto:illia.pogodin@gmail.com)
- LinkedIn: [linkedin.com/in/ipogodin](https://www.linkedin.com/in/ipogodin/)

---

*"In the neon-soaked streets of the future, your career is the story worth telling."*
