# CyberCity Resume - Project Plan

## 🎯 Project Overview

An interactive cyberpunk-themed resume website with game-like navigation through a rainy neon city. The user explores different "districts" representing resume sections by navigating with keyboard controls.

**Target Audience:** Recruiters, potential employers, tech community  
**Primary Purpose:** Showcase 15 years of backend engineering experience in an unforgettable way  
**Current Role:** Meta (Senior Backend Engineer)  
**Previous Notable:** Google, plus experience in banking, ecommerce, startups, gaming, gambling

### ✅ Final Design Decisions
- **Content Strategy:** Detailed experience for Meta & Google (recent roles), earlier companies summarized
- **Audio:** Silent on load, user-friendly toggle button to enable rain/ambient sounds
- **Company Branding:** No company logos, stylized neon text signs only

---

## 🛠️ Tech Stack

- **Framework:** SvelteKit
- **Hosting:** Vercel
- **Styling:** CSS with custom animations
- **Effects:** Canvas for rain, CSS for parallax
- **Images:** AI-generated (Midjourney/DALL-E/Stable Diffusion)
- **Fonts:** Cyberpunk/sci-fi themed web fonts

---

## 🎨 Visual Design Concept

### Color Palette
- **Primary:** Dark blues (#0a0e27, #1a1d3f)
- **Neon Accents:** Cyan (#00fff0), Pink (#ff006e), Purple (#b900ff)
- **Rain/Reflections:** Semi-transparent whites and blues
- **Text:** White/cyan for readability

### Scene Layout
```
Main Hub (Intersection)
    │
    ├── North: Projects Alley
    ├── East: Contact Terminal
    ├── South: Experience Avenue
    └── West: Skills District
         │
         └── Southwest: Education Quarter
```

### Character Design
- Wide-brimmed fedora/hat
- Long trench coat
- Standing near streetlight or wall
- Silhouette or semi-detailed
- Film noir aesthetic meets cyberpunk

---

## 📁 Project Structure

```
cyberCity/
├── README.md
├── PROJECT_PLAN.md (this file)
├── STAGE_CHECKLIST.md
├── package.json
├── svelte.config.js
├── vite.config.js
├── static/
│   ├── images/
│   │   ├── scenes/
│   │   │   ├── hub-main.png
│   │   │   ├── experience-avenue.png
│   │   │   ├── skills-district.png
│   │   │   ├── projects-alley.png
│   │   │   ├── education-quarter.png
│   │   │   └── contact-terminal.png
│   │   ├── character/
│   │   │   ├── character-idle.png
│   │   │   └── character-walk.png (optional)
│   │   └── ui/
│   │       └── neon-signs/
│   ├── fonts/
│   ├── sounds/ (optional)
│   └── resume.pdf
├── src/
│   ├── app.html
│   ├── app.css
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte (Main hub)
│   │   └── +page.js (data loading)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Scene.svelte
│   │   │   ├── Character.svelte
│   │   │   ├── RainEffect.svelte
│   │   │   ├── Navigation.svelte
│   │   │   ├── NeonSign.svelte
│   │   │   ├── ExperienceCard.svelte
│   │   │   ├── SkillGrid.svelte
│   │   │   ├── ProjectCard.svelte
│   │   │   └── ContactTerminal.svelte
│   │   ├── stores/
│   │   │   ├── navigation.js
│   │   │   └── scene.js
│   │   ├── data/
│   │   │   ├── experience.js
│   │   │   ├── skills.js
│   │   │   ├── projects.js
│   │   │   └── education.js
│   │   └── utils/
│   │       ├── transitions.js
│   │       └── keyboard.js
│   └── styles/
│       ├── global.css
│       ├── cyberpunk.css
│       └── animations.css
```

---

## 🎮 Navigation System

### Controls
- **Desktop:** Arrow keys, WASD, or click neon signs
- **Mobile:** On-screen D-pad buttons or swipe gestures

### State Management
Using Svelte stores to track:
- Current location (hub, experience, skills, etc.)
- Navigation history
- Active interaction
- Scene transition state

### Transitions
- Fade out current scene
- Character "walks" toward direction
- Fade in new scene
- Smooth, cinematic (0.8-1.2s duration)

---

## 📊 Content Structure

### Experience Data
```javascript
{
  company: "Meta",
  role: "Senior Backend Engineer",
  period: "2023 - Present",
  location: "Menlo Park, CA",
  description: "Leading backend infrastructure for...",
  technologies: ["Python", "GraphQL", "Kubernetes", "etc"],
  achievements: [
    "Scaled system to handle X requests/sec",
    "Led team of Y engineers",
    "Reduced latency by Z%"
  ],
  neonColor: "#00ff88",
  buildingStyle: "modern-tech"
}
```

### Skills Categories
- **Languages:** Python, Java, Go, JavaScript, etc.
- **Backend:** Node.js, Django, Spring Boot, etc.
- **Databases:** PostgreSQL, MongoDB, Redis, etc.
- **Cloud:** AWS, GCP, Azure
- **DevOps:** Docker, Kubernetes, CI/CD
- **Architecture:** Microservices, Event-driven, etc.

### Projects
- Side projects
- Open source contributions
- Notable work achievements (public)

### Education
- Degrees
- Certifications
- Relevant coursework

---

## 🎨 AI Image Generation Prompts

### Main Hub Scene
```
Cinematic wide-angle shot of a rainy cyberpunk city street intersection at night, 
wet asphalt reflecting neon signs, streetlights casting atmospheric glow, 
dark moody lighting, blade runner aesthetic, purple and cyan color palette, 
realistic photography style, film noir meets sci-fi, 4k detailed, rain falling, 
misty atmosphere, bokeh lights in background
```

### Character (Separate Layer)
```
Full body silhouette of mysterious person in wide-brimmed fedora hat and long 
trench coat, standing under streetlight, rainy night, cyberpunk city background, 
film noir style, dramatic side lighting, neon reflections on coat, realistic, 
cinematic composition, moody atmosphere, professional photography
```

### Experience Avenue
```
Rainy cyberpunk city street with modern tech company buildings, neon corporate 
logos, wet pavement reflections, atmospheric fog, blue and purple neon lights, 
realistic night photography, blade runner aesthetic, cinematic lighting, 
4k detailed, futuristic architecture
```

### Skills District
```
Cyberpunk tech district with holographic displays and neon signs, rainy night, 
futuristic weapon shop aesthetic, glowing tech interfaces, wet streets reflecting 
blue and pink neon, realistic photography, atmospheric fog, cinematic composition
```

### Projects Alley
```
Dark cyberpunk alley with graffiti walls and holographic projections, neon art 
installations, rainy atmosphere, urban decay meets high tech, blue and purple 
lighting, realistic photography, atmospheric depth, cinematic mood
```

### Education Quarter
```
Distant view of futuristic university buildings in cyberpunk city, rainy night, 
academic architecture with neon accents, atmospheric lighting, realistic 
photography, blade runner aesthetic, moody ambiance, fog and mist
```

### Contact Terminal
```
Cyberpunk phone booth or terminal station in rainy city street, neon lighting, 
futuristic communication device, wet pavement reflections, blue and cyan colors, 
realistic photography, atmospheric fog, cinematic composition, film noir style
```

---

## 🚀 Implementation Stages

### ✅ STAGE 0: Planning & Setup (CURRENT)
**Goal:** Complete project planning and documentation

**Tasks:**
- [x] Define project vision and scope
- [x] Choose tech stack
- [x] Create project plan document
- [ ] Create stage checklist document
- [ ] Finalize content structure
- [ ] Prepare AI image generation prompts

**Deliverable:** PROJECT_PLAN.md, STAGE_CHECKLIST.md

---

### 📦 STAGE 1: Project Initialization
**Goal:** Set up SvelteKit project with basic configuration

**Tasks:**
1. Initialize SvelteKit project
2. Configure Vite and Svelte config
3. Set up project folder structure
4. Install dependencies
5. Create basic layout component
6. Set up global CSS
7. Configure Vercel deployment (vercel.json)
8. Test dev server

**Commands:**
```bash
npm create svelte@latest cyberCity
cd cyberCity
npm install
npm run dev
```

**Dependencies to install:**
```bash
npm install -D @sveltejs/adapter-vercel
```

**Deliverable:** Working SvelteKit project that runs locally

**How to verify:** `npm run dev` should show "Hello world" page at localhost

---

### 🎨 STAGE 2: Generate & Optimize Images
**Goal:** Create all visual assets using AI and prepare them for web

**Tasks:**
1. Generate images using AI (Midjourney/DALL-E/Stable Diffusion)
   - Main hub scene
   - Character asset
   - Experience avenue
   - Skills district
   - Projects alley
   - Education quarter
   - Contact terminal
2. Optimize images (compress, convert to WebP if needed)
3. Create different sizes for responsive design
4. Place images in `/static/images/` folder
5. Document image credits/sources

**Tools:**
- AI: Midjourney, DALL-E 3, or Stable Diffusion
- Optimization: TinyPNG, Squoosh, or ImageOptim
- Format conversion: if needed for WebP

**Deliverable:** `/static/images/` folder with all optimized images

**How to verify:** Images load in browser, file sizes reasonable (<500KB each)

---

### 🎭 STAGE 3: Core Styling & Theme
**Goal:** Create the cyberpunk aesthetic foundation

**Tasks:**
1. Set up CSS custom properties (CSS variables) for theme
2. Import cyberpunk fonts (Google Fonts or custom)
3. Create global styles (`src/app.css`)
4. Create cyberpunk-specific styles (`src/styles/cyberpunk.css`)
5. Add CSS animations library (`src/styles/animations.css`)
6. Create neon glow effects
7. Add scanline/CRT overlay effects
8. Set up responsive breakpoints

**Key CSS Features:**
- Neon text glow
- Color palette variables
- Glassmorphism for UI elements
- Glitch effects
- Fade transitions

**Deliverable:** Complete styling foundation that can be applied to components

**How to verify:** Apply classes to test elements and see cyberpunk effects

---

### 🗺️ STAGE 4: State Management & Navigation Logic
**Goal:** Build the navigation system and state management

**Tasks:**
1. Create navigation store (`src/lib/stores/navigation.js`)
   - Current location
   - Navigation history
   - Available directions from each location
2. Create scene store (`src/lib/stores/scene.js`)
   - Scene transition state
   - Active interactions
3. Create keyboard utility (`src/lib/utils/keyboard.js`)
   - Arrow key listeners
   - WASD listeners
   - Key mapping to navigation actions
4. Create transition utility (`src/lib/utils/transitions.js`)
   - Custom Svelte transitions
   - Scene fade effects
5. Test navigation logic in console

**Deliverable:** Working state management that can handle navigation

**How to verify:** Console logs show state changes when pressing arrow keys

---

### 🏗️ STAGE 5: Core Components - Part 1 (Scene & Character)
**Goal:** Build the foundational visual components

**Tasks:**
1. Create `Scene.svelte` component
   - Background image display
   - Parallax layers
   - Responsive container
2. Create `Character.svelte` component
   - Character positioning
   - Idle animation (subtle movement)
   - Direction facing
3. Create `RainEffect.svelte` component
   - Canvas-based rain particles
   - Performance optimization
   - Toggle on/off capability
4. Test components individually

**Deliverable:** Reusable Scene, Character, and RainEffect components

**How to verify:** Components render correctly on main page

---

### 🎮 STAGE 6: Core Components - Part 2 (UI Elements)
**Goal:** Build interactive UI components

**Tasks:**
1. Create `Navigation.svelte` component
   - On-screen directional controls (mobile)
   - Current location indicator
   - Mini-map (optional)
2. Create `NeonSign.svelte` component
   - Clickable navigation signs
   - Hover effects
   - Glow animations
3. Create basic modal/overlay component for content display
4. Test interactivity

**Deliverable:** Interactive UI components for navigation

**How to verify:** Clicking/pressing keys triggers navigation

---

### 📄 STAGE 7: Content Components
**Goal:** Build components for displaying resume content

**Tasks:**
1. Create `ExperienceCard.svelte`
   - Company logo/name
   - Role and period
   - Technologies used
   - Achievements list
   - Expandable details
2. Create `SkillGrid.svelte`
   - Skill categories
   - Proficiency indicators
   - Visual layout (grid/chart)
3. Create `ProjectCard.svelte`
   - Project name and description
   - Technologies
   - Links (if applicable)
4. Create `ContactTerminal.svelte`
   - Social media links
   - Email contact
   - Resume download button
   - Cyberpunk terminal aesthetic

**Deliverable:** All content display components

**How to verify:** Components display sample data correctly

---

### 📊 STAGE 8: Resume Data Structure
**Goal:** Create all resume content in structured format

**Tasks:**
1. Create `src/lib/data/experience.js`
   - Meta experience
   - Google experience
   - Other companies (15 years total)
   - Structure: company, role, period, description, technologies, achievements
2. Create `src/lib/data/skills.js`
   - All technical skills categorized
   - Proficiency levels
3. Create `src/lib/data/projects.js`
   - Side projects
   - Notable work (public)
4. Create `src/lib/data/education.js`
   - Degrees
   - Certifications
5. Export all data for component consumption

**Deliverable:** Complete resume data files

**How to verify:** Import and console.log data to verify structure

---

### 🌆 STAGE 9: Main Hub (Home Page)
**Goal:** Build the central hub/intersection view

**Tasks:**
1. Update `src/routes/+page.svelte` with hub scene
2. Add character to scene
3. Add rain effect
4. Display neon signs for navigation (4-5 directions)
5. Implement keyboard navigation
6. Add intro animation (fade in from black)
7. Add tutorial hint ("Use arrow keys to explore")
8. Implement scene transitions

**Deliverable:** Functional main hub page with navigation

**How to verify:** Can navigate to all sections from hub

---

### 💼 STAGE 10: Experience Avenue Scene
**Goal:** Build the work experience section

**Tasks:**
1. Create experience scene layout
2. Display companies as "buildings" or storefronts
3. Implement company detail view (modal/overlay)
4. Add Meta and Google as prominent locations
5. Add other companies in order
6. Style with neon company signs
7. Add navigation back to hub
8. Add transitions

**Deliverable:** Complete experience section

**How to verify:** Can view all work experience details

---

### 🛠️ STAGE 11: Skills District Scene
**Goal:** Build the skills/technologies section

**Tasks:**
1. Create skills scene layout
2. Display skill grid/chart
3. Categorize skills (Backend, Database, Cloud, etc.)
4. Add visual proficiency indicators
5. Add hover effects for details
6. Style as "tech shop" or arsenal
7. Add navigation back to hub

**Deliverable:** Complete skills section

**How to verify:** All skills are visible and categorized

---

### 🚀 STAGE 12: Projects Alley Scene
**Goal:** Build the projects/portfolio section

**Tasks:**
1. Create projects scene layout
2. Display project cards
3. Style as graffiti/hologram aesthetic
4. Add project details (modal or inline)
5. Add links to live projects/repos
6. Add navigation back to hub

**Deliverable:** Complete projects section

**How to verify:** Can view all projects and follow links

---

### 🎓 STAGE 13: Education Quarter & Contact Terminal
**Goal:** Build education and contact sections

**Tasks:**
1. Create education scene layout
2. Display degrees and certifications
3. Create contact terminal scene
4. Add social media links (LinkedIn, GitHub, etc.)
5. Add resume PDF download button
6. Add email contact option (form or mailto)
7. Style as cyberpunk terminal
8. Add navigation back to hub

**Deliverable:** Complete education and contact sections

**How to verify:** Can view education, download resume, access contact info

---

### 📱 STAGE 14: Mobile Responsiveness
**Goal:** Make the site work well on mobile devices

**Tasks:**
1. Add mobile breakpoints
2. Create on-screen D-pad controls
3. Optimize image sizes for mobile
4. Adjust text sizes and layouts
5. Test touch interactions
6. Simplify effects for performance
7. Ensure all content is accessible
8. Test on multiple screen sizes

**Deliverable:** Mobile-friendly version

**How to verify:** Site works on phone/tablet

---

### ✨ STAGE 15: Polish & Effects
**Goal:** Add final touches and visual enhancements

**Tasks:**
1. Add loading screen/spinner
2. Add page transitions
3. Fine-tune animations
4. Add sound effects (optional)
   - Rain ambiance
   - UI interaction sounds
   - Toggle audio on/off
5. Add Easter eggs (optional)
6. Optimize performance
7. Test in multiple browsers
8. Fix any bugs

**Deliverable:** Polished, production-ready site

**How to verify:** Smooth, bug-free experience across browsers

---

### 🚀 STAGE 16: Deployment & Launch
**Goal:** Deploy to Vercel and make site live

**Tasks:**
1. Create `vercel.json` configuration
2. Build production version (`npm run build`)
3. Test production build locally
4. Connect GitHub repo to Vercel
5. Configure Vercel project settings
6. Deploy to Vercel
7. Test live site
8. Configure custom domain (if applicable)
9. Set up analytics (optional)
10. Share with world!

**Commands:**
```bash
npm run build
npm run preview  # Test production build locally
vercel  # Deploy to Vercel
```

**Deliverable:** Live website on Vercel

**How to verify:** Site accessible at public URL

---

## 🎯 Success Criteria

### Functionality
- ✅ Keyboard navigation works (Arrow keys/WASD)
- ✅ All sections accessible from hub
- ✅ Content displays correctly
- ✅ Resume downloadable
- ✅ Contact links work
- ✅ Mobile controls functional

### Visual Quality
- ✅ Cyberpunk aesthetic consistent throughout
- ✅ Rain effect smooth and atmospheric
- ✅ Transitions smooth (no jank)
- ✅ Images optimized and load quickly
- ✅ Neon effects look good
- ✅ Readable text with good contrast

### Performance
- ✅ Lighthouse score >80 (Performance)
- ✅ First Contentful Paint <2s
- ✅ Works on mobile devices
- ✅ No console errors
- ✅ Responsive on different screen sizes

### Content
- ✅ All 15 years of experience documented
- ✅ Skills comprehensive and current
- ✅ Projects showcase technical abilities
- ✅ Contact information accessible
- ✅ Resume PDF available and up-to-date

---

## 🐛 Known Challenges & Solutions

### Challenge 1: Performance with Rain Effect
**Problem:** Canvas rain animation may impact performance on lower-end devices

**Solutions:**
- Use requestAnimationFrame efficiently
- Limit particle count on mobile
- Add toggle to disable effects
- Use CSS fallback for simple rain

### Challenge 2: Image File Sizes
**Problem:** High-res cyberpunk images can be large

**Solutions:**
- Use WebP format with JPG fallback
- Implement lazy loading
- Serve responsive images
- Compress images aggressively

### Challenge 3: Mobile Navigation UX
**Problem:** Keyboard navigation doesn't work on mobile

**Solutions:**
- Create touch-friendly D-pad
- Add swipe gesture support
- Make neon signs more prominent/clickable
- Ensure buttons are large enough (44px minimum)

### Challenge 4: Browser Compatibility
**Problem:** Some CSS effects may not work in all browsers

**Solutions:**
- Use feature detection
- Provide graceful degradation
- Test in Chrome, Firefox, Safari, Edge
- Use autoprefixer for CSS

---

## 📚 Resources & References

### Svelte/SvelteKit
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Svelte Transitions](https://svelte.dev/docs#run-time-svelte-transition)

### Cyberpunk Design Inspiration
- Blade Runner aesthetic
- Cyberpunk 2077 UI
- Ghost in the Shell
- Search "cyberpunk rain city" on Pinterest/Behance

### Fonts
- Orbitron (Google Fonts)
- Rajdhani (Google Fonts)
- Share Tech Mono (Google Fonts)
- Cyberpunk fonts from DaFont

### Color Tools
- [Coolors.co](https://coolors.co/) - Palette generator
- [Neon glow CSS generator](https://cssgenerator.org/box-shadow-css-generator.html)

### AI Image Generation
- [Midjourney](https://midjourney.com)
- [DALL-E 3](https://openai.com/dall-e-3)
- [Stable Diffusion](https://stablediffusion.com)

### Performance
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

## 🔄 Version History

**v0.1** - Initial project plan created (October 20, 2025)

---

## 📝 Notes & Ideas

### Future Enhancements (Post-Launch)
- [ ] Add more interactive Easter eggs
- [ ] Create "hacking" mini-game in Skills District
- [ ] Add animated transitions between all scenes
- [ ] Create alternative character skins
- [ ] Add weather variations (thunder, lightning effects)
- [ ] Blog section styled as "Data Logs"
- [ ] Visitor counter styled as "Terminal Users"
- [ ] Achievement system for exploration
- [ ] Dark/Light mode toggle (Day/Night city)

### Content Updates
- Keep experience section updated with latest role changes
- Add new projects as completed
- Update skills as technologies learned
- Refresh images periodically

---

## ❓ FAQ / Troubleshooting

**Q: What if I need to pause between stages?**
A: Each stage is self-contained. Complete a stage, commit to Git, and note which stage in STAGE_CHECKLIST.md. Resume from next stage.

**Q: How do I test the site locally?**
A: Run `npm run dev` and open `http://localhost:5173` (or port shown in terminal)

**Q: How do I deploy to Vercel?**
A: Run `vercel` command in project directory, or connect GitHub repo in Vercel dashboard

**Q: What if AI images don't turn out right?**
A: Iterate on prompts, try different AI tools, or use stock photos from Unsplash/Pexels with cyberpunk filter

**Q: Can I change the navigation structure later?**
A: Yes! The navigation store makes it easy to add/remove/rearrange sections

**Q: How do I update my resume content?**
A: Edit the files in `src/lib/data/` - changes will reflect immediately

---

## 🎬 Ready to Begin!

This plan provides a complete roadmap for building your cyberpunk resume site. Each stage is designed to be completable in one sitting, with clear deliverables and verification steps.

**Next Steps:**
1. Review this plan and approve
2. Move to STAGE 1: Project Initialization
3. Follow stages sequentially
4. Check off completed stages in STAGE_CHECKLIST.md
5. Commit to Git after each stage

Good luck, and enjoy building your cyberpunk resume! 🌃⚡

---

*"In the neon-soaked streets of the future, your career is the story worth telling."*
