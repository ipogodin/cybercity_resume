## Side Projects & Entrepreneurial Work

Beyond his day job, Illia continuously ships personal products end-to-end — idea, design, backend, frontend, deployment, and operations. He works AI-augmented: he uses AI coding assistants as a force multiplier while owning architecture, security, and quality decisions himself. These projects show product ownership and a builder's mindset, not just feature delivery inside a large org.

All projects below are real, public, and on GitHub (github.com/ipogodin).

---

### This Site — pogodin.ai (incl. Alex, the assistant you're talking to)

- **What:** Interactive portfolio with two experiences: a clean modern site with an AI career assistant ("Alex"), and a cyberpunk mini-game resume at /cyberpunk with keyboard navigation, canvas rain, and an Easter-egg terminal.
- **Stack:** SvelteKit 2 / Svelte 5, TypeScript, Vercel, OpenAI streaming chat, Redis rate limiting.
- **Notable engineering:** prompt-injection defenses, spoof-resistant IP resolution, CSP headers, admin auth with timing-safe comparison, per-IP rate limits, lead capture. Alex itself is evidence of Illia's applied AI work — the assistant evaluating candidates *is* one of his projects.

### Dwarfer — GIF platform for YouTube comments (Chrome extension + own backend service)

- **What:** A shipped product, not a demo: a Chrome extension that adds a GIF picker to YouTube comment boxes, backed by Illia's own service at dwarfer.link (Google sign-in, Giphy integration, short-link resolution, privacy policy). Users with the extension see GIFs rendered inline from short links.
- **Why it matters:** end-to-end product thinking — browser extension UX, a hosted backend with auth, link infrastructure (built on his own URL-shortener project "smalboi"), and privacy considerations.
- **Stack:** JavaScript (Chrome MV3 extension), hosted web service, Google OAuth.

### Evergreen Electric — production website for a real business

- **What:** Full web presence for an electrical services company: featured projects, services, quote requests, contact forms.
- **Why it matters:** client-style delivery — requirements to production, including database and cloud deployment.
- **Stack:** SvelteKit, TailwindCSS, Drizzle ORM, deployed on AWS Amplify.

### YMCA — AI-powered YouTube comment assistant (Chrome extension)

- **What:** Chrome extension that uses AI to generate, refine, and summarize YouTube comments, with selectable tone/style.
- **Why it matters:** early hands-on applied-AI product work — AI API integration, error handling/fallbacks, extension architecture (background/content scripts, messaging).

### P-RAY: The Game — Canvas 2D survival tactics game

- **What:** A fully playable browser game: guide three survivors (Elliot, Dick, Habib — each with a unique ability) through 21 waves of an escalating worm brood, then extract via helicopter. Five difficulty modes from "Cavity Cadet" to "Rear Admiral." Ships as both a modular Vite build and a single self-contained HTML file — no install needed.
- **Why it matters:** game dev is a demanding domain — real-time Canvas 2D rendering, entity/AI behavior systems, hitbox physics, loot drop tables, boss scripting, audio manifest generation, and wave-pacing tuned by hand. Building a complete game loop end-to-end in vanilla JS shows systems thinking and a willingness to go deep outside comfortable frameworks.
- **Stack:** Phaser 4, Vite 8, vanilla JavaScript. GitHub: github.com/tea43/pray-game.

### Smaller projects

- **wedding_2026** — a wedding website built and delivered for a couple (JavaScript/Svelte): another example of shipping for real users on a deadline.
- **SHS (Smart Home Stuff)** — Home Assistant configuration-as-code for his own smart home; dynamic, on-the-fly configuration.
- **smalboi** — self-built URL shortener that later became infrastructure for Dwarfer.

---

### How to talk about these (calibration)

- These are side projects: honest scale is "shipped and working," not "at scale." Do not inflate user numbers or revenue — none are claimed.
- The signal for hiring managers: Illia ships complete products on his own initiative, integrates AI both as a product feature and as a development accelerator, and carries an ownership/entrepreneurial mindset into engineering work.
- Frontend note: these projects use Svelte/JavaScript, but Illia's expert-level strengths remain backend — Java, distributed systems, APIs. Frame frontend work as "capable full-stack delivery," not frontend expertise.
