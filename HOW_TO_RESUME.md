# How to Resume This Project

If you need to continue this project in a new session (if AI "dies" or you take a break), use this guide to get back on track quickly.

---

## 🔄 Quick Resume Prompt

Copy and customize this prompt for a new AI session:

```
I'm working on a cyberpunk-themed interactive resume website called "CyberCity Resume". 
The project uses SvelteKit and Vercel, with game-like keyboard navigation through a 
rainy neon city where different districts represent resume sections.

I have two key documents in my workspace:
1. PROJECT_PLAN.md - Contains the complete project roadmap with 16 implementation stages
2. STAGE_CHECKLIST.md - Tracks my progress through each stage

Please read both documents to understand the project context.

I'm currently on STAGE [X]: [Stage Name]

[Add any relevant context about what you've completed or where you're stuck]

Do NOT generate any code until you confirm you've read the project documents and 
understand the current stage requirements.
```

---

## 📋 Before You Resume

1. **Check STAGE_CHECKLIST.md** - See which stage you're on and what's completed
2. **Update checkboxes** - Mark any tasks you completed before the session ended
3. **Add notes** - Document any issues or decisions in the "Notes" section
4. **Commit to Git** - Save your progress (if you haven't already)

---

## 🎯 Example Prompts

### Starting a Fresh Stage
```
I'm working on the CyberCity Resume project. Please read PROJECT_PLAN.md and 
STAGE_CHECKLIST.md. I've completed Stage 3 and I'm ready to start Stage 4: 
State Management & Navigation Logic. Please help me begin.
```

### Mid-Stage with an Issue
```
I'm working on the CyberCity Resume project. Please read PROJECT_PLAN.md and 
STAGE_CHECKLIST.md. I'm on Stage 5, working on the RainEffect component, but 
the canvas particles aren't rendering correctly. Can you help debug?
```

### Lost Your Place
```
I'm working on the CyberCity Resume project. Please read PROJECT_PLAN.md and 
STAGE_CHECKLIST.md. Can you check my workspace and help me figure out which 
stage I should be on?
```

### Want to Modify the Plan
```
I'm working on the CyberCity Resume project. Please read PROJECT_PLAN.md and 
STAGE_CHECKLIST.md. I'm on Stage 2 but want to use placeholder images instead 
of AI-generated ones for now. Can you help me skip ahead with temp images?
```

---

## ✅ What to Include in Your Prompt

### Essential Information
- ✅ Project name: "CyberCity Resume"
- ✅ Tech stack: SvelteKit + Vercel
- ✅ Reference to PROJECT_PLAN.md and STAGE_CHECKLIST.md
- ✅ Current stage number and name
- ✅ Request AI to read docs first

### Optional But Helpful
- What you've completed in the current stage
- Any issues or blockers you're facing
- Specific questions or areas where you need help
- Any deviations from the original plan

---

## 🛡️ Best Practices

### Keep Documentation Updated
- Check off completed tasks in STAGE_CHECKLIST.md
- Add notes about decisions or changes
- Update status markers (⚪ → 🟡 → ✅)
- Document any blockers or issues

### Use Git Commits
```bash
git add .
git commit -m "Complete Stage 5: Core Components Part 1"
```

This helps you (and AI) see exactly what was accomplished.

### Be Specific
Instead of: "I'm stuck"
Try: "I'm on Stage 5, RainEffect.svelte canvas shows blank screen, no console errors"

### Start Small
If you're lost, ask the AI to:
1. Read the docs
2. Assess your current progress
3. Recommend next steps

---

## 📊 Stage Status Indicators

In STAGE_CHECKLIST.md, use these status markers:

- ⚪ **NOT STARTED** - Haven't begun this stage yet
- 🟡 **IN PROGRESS** - Currently working on this stage
- ✅ **COMPLETED** - Stage finished and verified

Update these as you go!

---

## 🆘 Troubleshooting

### "AI doesn't understand the context"
- Make sure to explicitly mention PROJECT_PLAN.md and STAGE_CHECKLIST.md
- Ask AI to read those files first
- Provide your current stage number

### "AI wants to start over"
- Emphasize you want to CONTINUE, not restart
- Reference specific completed stages
- Point to the checklist showing your progress

### "AI is generating wrong code"
- Remind it to check PROJECT_PLAN.md for the architectural decisions
- Reference the specific stage requirements
- Ask it to verify against the plan before generating

### "Not sure what stage I'm on"
- Ask AI to analyze your workspace structure
- Show it your STAGE_CHECKLIST.md
- Request it determine progress based on existing files

---

## 📱 Quick Reference Card

**Project:** CyberCity Resume  
**Tech:** SvelteKit + Vercel  
**Docs:** PROJECT_PLAN.md, STAGE_CHECKLIST.md  
**Stages:** 16 total (0-16)  
**Current:** [Check STAGE_CHECKLIST.md]

**Resume Command:**
```
Read PROJECT_PLAN.md and STAGE_CHECKLIST.md for the CyberCity Resume project. 
I'm on Stage [X]. Help me continue.
```

---

## 🎓 Remember

The beauty of this system is that **everything is documented**. As long as you:
1. Keep STAGE_CHECKLIST.md updated
2. Reference the docs in your prompt
3. Specify your current stage

...any AI session can pick up exactly where you left off!

---

**Last Updated:** October 20, 2025  
**Project Status:** Stage 0 Complete, Ready for Stage 1

*"A well-documented project never truly dies."* 🌃⚡
