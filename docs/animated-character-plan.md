# Animated Character Plan

## Goal
Take a static PNG character (transparent background) and make it move for use on a website.

---

## Step 1: Animate Your Character with AI

These tools can take your static PNG and make it move:

| Tool | Best For | Notes |
|---|---|---|
| **Kling AI** (kling.ai) | Full body character motion | Free tier available |
| **Runway ML** (runwayml.com) | Smooth image-to-video | High quality |
| **Pika Labs** (pika.art) | Quick character animation | Easy to use |
| **Viggle AI** (viggle.ai) | Apply specific motion to a character | Great for game-like movement |

**Viggle AI** is especially good — give it your character PNG and a reference motion video,
and it will animate your character doing that motion.

---

## Step 2: Handle Transparency

Most AI tools output an MP4 with a solid background. Remove it with Python:

```bash
pip install rembg
```

```python
import subprocess, os
from rembg import remove
from PIL import Image

# 1. Extract frames from video
os.makedirs("frames", exist_ok=True)
subprocess.run(["ffmpeg", "-i", "animated.mp4", "frames/frame%04d.png"])

# 2. Remove background from each frame
os.makedirs("frames_transparent", exist_ok=True)
for f in sorted(os.listdir("frames")):
    img = Image.open(f"frames/{f}")
    out = remove(img)
    out.save(f"frames_transparent/{f}")

# 3. Reassemble into animated WebP
subprocess.run([
    "ffmpeg", "-framerate", "24",
    "-i", "frames_transparent/frame%04d.png",
    "-loop", "0", "character_animated.webp"
])
```

---

## Step 3: Use on Your Site

**Animated WebP** (best format — small, transparent, widely supported):

```html
<img src="character_animated.webp" alt="character" />
```

Or as a **video with transparency** using WebM:

```bash
ffmpeg -framerate 24 -i frames_transparent/frame%04d.png \
  -c:v libvpx-vp9 -pix_fmt yuva420p character.webm
```

```html
<video autoplay loop muted playsinline>
  <source src="character.webm" type="video/webm" />
</video>
```

---

## Full Workflow Summary

```
Your PNG
   ↓
Viggle AI or Kling AI  →  animated MP4
   ↓
rembg (Python)         →  transparent frames
   ↓
ffmpeg                 →  animated WebP / WebM
   ↓
<img> or <video> tag on your site
```

---

## TODO (follow up)
- [ ] Choose AI tool and animate the character
- [ ] Run background removal script
- [ ] Convert frames to animated WebP or WebM
- [ ] Embed into site with HTML/CSS
