# Audio Files for CyberCity Resume

## Required Audio Files

To enable audio features, add the following files to `/static/sounds/`:

### 1. Rain Ambiance (`rain-ambiance.mp3`)
- **Type:** Looping background ambiance
- **Duration:** 30-60 seconds (will loop)
- **Characteristics:**
  - Gentle rain sounds
  - Subtle urban ambiance (optional)
  - Low frequency rumble (thunder in distance)
- **Recommended Sources:**
  - freesound.org
  - Uppbeat (free with attribution)
  - YouTube Audio Library
  - Create your own with Audacity

### 2. UI Click Sound (`ui-click.mp3`)
- **Type:** Short sound effect
- **Duration:** 0.1-0.3 seconds
- **Characteristics:**
  - Futuristic/digital beep
  - Subtle cyberpunk vibe
  - Not too loud or harsh
- **Recommended Sources:**
  - Zapsplat (free with attribution)
  - freesound.org
  - Mixkit

## Audio File Specifications

- **Format:** MP3 or OGG (MP3 recommended for compatibility)
- **Bitrate:** 128-192 kbps (good balance of quality and file size)
- **Sample Rate:** 44.1 kHz
- **Channels:** Stereo (for ambiance), Mono (for UI sounds)

## How to Add Audio Files

1. Create the directory (if it doesn't exist):
   ```bash
   mkdir -p static/sounds
   ```

2. Add your audio files:
   ```
   static/sounds/
     ├── rain-ambiance.mp3
     └── ui-click.mp3
   ```

3. Update `AudioToggle.svelte` to uncomment the audio source lines:
   ```javascript
   rainAudio.src = '/sounds/rain-ambiance.mp3';
   uiClickAudio.src = '/sounds/ui-click.mp3';
   ```

## Free Audio Resources

### Rain Sounds
- **freesound.org**: Search for "rain ambiance" or "city rain"
- **YouTube Audio Library**: Various rain loops
- **Ambient Mixer**: Create custom rain soundscapes

### UI Sounds
- **Zapsplat**: Free sound effects (attribution required)
- **Mixkit**: Free UI sounds
- **freesound.org**: Search for "UI beep" or "digital click"

## Attribution

If using audio from free sources, add attribution to your README:

```markdown
## Audio Credits

- Rain ambiance: [Source name] - [License]
- UI click sound: [Source name] - [License]
```

## Testing Audio

1. Start the dev server: `npm run dev`
2. Open the site in browser
3. Click the audio toggle button (top right)
4. Verify rain ambiance plays
5. Click navigation buttons to test UI sounds
6. Adjust volume with the volume control

## Notes

- Audio is **disabled by default** (best practice for web accessibility)
- Users must explicitly enable audio
- Volume preference is saved in localStorage
- Audio respects user's browser autoplay policies
- Consider adding a "mute" icon animation when audio starts
