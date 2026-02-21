#!/usr/bin/env python3
"""
Process animated character MP4:
1. Create ping-pong loop (forward + reverse) for seamless looping
2. Extract frames
3. Remove background from each frame
4. Create animated WebM with transparency
"""

import subprocess
import os
import shutil
from pathlib import Path
from rembg import remove
from PIL import Image

# Configuration
INPUT_VIDEO = "static/images/character/character_animate_4.mov"
LOOPED_VIDEO = "static/images/character/character_anim_loop.mp4"
FRAMES_DIR = "frames_extracted"
FRAMES_TRANSPARENT_DIR = "frames_transparent"
OUTPUT_WEBM = "static/images/character/character_animated.webm"
FRAMERATE = 24
CUT_DURATION = 3  # seconds — trim input to this length before ping-pong
SKIP_LOOP = True  # set True if video is already looped

def create_ping_pong_loop():
    """Trim to CUT_DURATION seconds, then create seamless loop (forward + reverse)"""
    print(f"🔁 Trimming to {CUT_DURATION}s then creating ping-pong loop ({CUT_DURATION * 2}s total)...")
    
    cmd = [
        "ffmpeg", "-y", "-i", INPUT_VIDEO,
        "-filter_complex",
        f"[0:v]trim=0:{CUT_DURATION},setpts=PTS-STARTPTS,split[fwd][tmp];"
        f"[tmp]reverse[rev];"
        f"[fwd][rev]concat=n=2:v=1[out]",
        "-map", "[out]",
        LOOPED_VIDEO
    ]
    subprocess.run(cmd, check=True)
    
    print(f"✅ Created {CUT_DURATION * 2}s seamless loop: {LOOPED_VIDEO}")

def extract_frames():
    """Extract frames from MP4"""
    source = INPUT_VIDEO if SKIP_LOOP else LOOPED_VIDEO
    print(f"🎬 Extracting frames from {source}...")
    
    # Clean and create directory
    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR)
    
    # Extract frames from the looped video
    cmd = [
        "ffmpeg", "-i", source,
        f"{FRAMES_DIR}/frame_%04d.png"
    ]
    subprocess.run(cmd, check=True)
    
    frame_count = len(os.listdir(FRAMES_DIR))
    print(f"✅ Extracted {frame_count} frames to {FRAMES_DIR}/")
    return frame_count

def remove_backgrounds():
    """Remove background from each frame"""
    print(f"🎨 Removing backgrounds from frames...")
    
    if os.path.exists(FRAMES_TRANSPARENT_DIR):
        shutil.rmtree(FRAMES_TRANSPARENT_DIR)
    os.makedirs(FRAMES_TRANSPARENT_DIR)
    
    frame_files = sorted(os.listdir(FRAMES_DIR))
    for i, frame_file in enumerate(frame_files):
        if i % 10 == 0:  # Progress every 10 frames
            print(f"  Processing: {i + 1}/{len(frame_files)}")
        
        img_path = os.path.join(FRAMES_DIR, frame_file)
        output_path = os.path.join(FRAMES_TRANSPARENT_DIR, frame_file)
        
        img = Image.open(img_path)
        img_transparent = remove(img)
        img_transparent.save(output_path)
    
    print(f"✅ Removed backgrounds from {len(frame_files)} frames")

def create_webm():
    """Create animated WebM with transparency"""
    print(f"🎞️  Creating animated WebM with transparency...")
    
    cmd = [
        "ffmpeg", "-y", "-framerate", str(FRAMERATE),
        "-i", f"{FRAMES_TRANSPARENT_DIR}/frame_%04d.png",
        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
        "-loop", "0", OUTPUT_WEBM
    ]
    subprocess.run(cmd, check=True)
    
    file_size = os.path.getsize(OUTPUT_WEBM) / 1024 / 1024
    print(f"✅ Created {OUTPUT_WEBM} ({file_size:.2f} MB)")

def cleanup():
    """Clean up temporary directories"""
    print(f"🧹 Cleaning up temporary files...")
    shutil.rmtree(FRAMES_DIR)
    shutil.rmtree(FRAMES_TRANSPARENT_DIR)
    print(f"✅ Cleaned up")

def main():
    print("=" * 60)
    print("CHARACTER ANIMATION PROCESSOR")
    print("=" * 60)
    
    try:
        if not SKIP_LOOP:
            create_ping_pong_loop()
        extract_frames()
        remove_backgrounds()
        create_webm()
        cleanup()
        
        print("\n" + "=" * 60)
        print("✨ SUCCESS! Your animated character is ready!")
        print("=" * 60)
        print(f"\n📁 Output file:")
        print(f"  • {OUTPUT_WEBM}")
        print(f"\n💡 Use in HTML:")
        print(f"  <video autoplay loop muted playsinline>")
        print(f"    <source src=\"{OUTPUT_WEBM}\" type=\"video/webm\" />")
        print(f"  </video>")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise

if __name__ == "__main__":
    main()
