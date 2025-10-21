# CyberCity Resume 🌃⚡

An interactive cyberpunk-themed resume website with game-like navigation through a rainy neon city. Explore different "districts" representing resume sections by navigating with keyboard controls.

**Live Site:** [Coming Soon]  
**Status:** 🚧 In Development - Stage 11/16 (62.5% Complete)

---

## 🎯 Project Overview

An immersive, cyberpunk-themed digital resume showcasing 15 years of backend engineering experience (Meta, Google, and more) in an unforgettable interactive format.

**Key Features:**
- 🎮 Game-like keyboard navigation (Arrow keys/WASD)
- 🌧️ Atmospheric rain effects with parallax backgrounds
- 💼 Interactive work experience with detailed company "buildings"
- 🛠️ Skills visualization as tech district
- 🚀 Projects showcase as cyberpunk alley
- 📱 Mobile-responsive design
- ✨ Neon-lit cyberpunk aesthetic

---

## 🛠️ Tech Stack

- **Framework:** SvelteKit
- **Styling:** Custom CSS with cyberpunk theme
- **Effects:** Canvas rain, CSS parallax
- **Hosting:** Vercel
- **Fonts:** Orbitron, Rajdhani, Share Tech Mono

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/pnpm/yarn

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

## 🎮 Navigation

**Desktop:**
- Arrow Keys / WASD - Navigate between districts
- ESC - Return to hub / Close modals
- Backspace - Go back
- Click neon signs - Quick navigation

**Mobile:**
- On-screen D-pad controls
- Touch navigation map
- Tap interactive elements

---

## 📁 Project Structure

```
cyberCity/
├── src/
│   ├── routes/              # SvelteKit routes
│   │   ├── +page.svelte    # Main hub (home)
│   │   ├── experience/     # Experience Avenue
│   │   ├── skills/         # Skills District
│   │   ├── projects/       # Projects Alley
│   │   ├── education/      # Education Quarter
│   │   └── contact/        # Contact Terminal
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── data/          # Resume content
│   │   ├── stores/        # State management
│   │   └── utils/         # Utilities
│   └── styles/            # CSS files
├── static/
│   └── images/            # AI-generated scenes
└── PROJECT_PLAN.md        # Detailed implementation plan
```

---

## 🌆 City Districts (Sections)

### ✅ Main Hub
The central intersection - your starting point. Navigate to any district from here.

### ✅ Experience Avenue (South)
Walk through 15 years of professional experience. Click on company "buildings" to see detailed work history:
- **Featured:** Meta (L5 Engineer), Google (Senior Engineer)
- **Previous:** Salesforce, Wargaming, IGT, and more

### 🚧 Skills District (West) - Coming Soon
Tech shop displaying all technical skills, categorized and visualized.

### 🚧 Projects Alley (North) - Coming Soon
Graffiti-covered alley showcasing notable projects and achievements.

### 🚧 Education Quarter (Southwest) - Coming Soon
Academic credentials and certifications.

### 🚧 Contact Terminal (East) - Coming Soon
Futuristic terminal for reaching out - social links, email, resume download.

---

## 📊 Development Progress

**Current Stage:** 11/16 (62.5% Complete)

- ✅ Stage 0-9: Planning, Setup, Core Components, Main Hub
- ✅ Stage 10: Experience Avenue (Complete with modals)
- 🚧 Stage 11: Skills District (In Progress)
- ⚪ Stage 12-16: Projects, Education/Contact, Mobile, Polish, Deploy

See [STAGE_CHECKLIST.md](./STAGE_CHECKLIST.md) for detailed progress.

---

## 🎨 Design Philosophy

- **Visual Style:** Blade Runner-inspired cyberpunk with rain-soaked neon streets
- **Color Palette:** Dark blues, cyan, pink, purple neon accents
- **Interaction:** Game-like exploration encourages discovery
- **Content:** Detailed recent roles (Meta/Google), summarized earlier experience
- **Accessibility:** Keyboard navigation, clear contrast, semantic HTML

---

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
npm run deploy       # Deploy to Vercel (coming soon)
```

---

## 📝 Content Updates

Resume data is stored in `/src/lib/data/`:
- `experience.js` - Work history
- `skills.js` - Technical skills
- `projects.js` - Notable projects
- `education.js` - Degrees & certifications
- `contact.js` - Contact information

Edit these files to update your resume content!

---

## 🚀 Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Auto-deploy on push to main branch

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) Stage 16 for detailed deployment instructions.

---

## 🤝 Contributing

This is a personal resume project, but feel free to:
- Report bugs via issues
- Suggest improvements
- Use as inspiration for your own cyberpunk resume!

---

## 📄 License

MIT License - Feel free to use this as a template for your own resume!

---

## 🙏 Credits

- **Design Inspiration:** Blade Runner, Cyberpunk 2077, Ghost in the Shell
- **AI Images:** Generated for cyberpunk aesthetic
- **Fonts:** Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
- **Framework:** SvelteKit team and community

---

## 📧 Contact

**Illia Pogodin**
- LinkedIn: [Add your LinkedIn]
- GitHub: [Add your GitHub]
- Email: [Add your email]

---

*"In the neon-soaked streets of the future, your career is the story worth telling."*

Built with ❤️ and ☕ in the cyberpunk aesthetic.
