#!/usr/bin/env python3
"""
Process animated character MP4:
1. Extract frames
2. Remove background from each frame
3. Create animated WebP and WebM with transparency
"""

import subprocess
import os
import shutil
from pathlib import Path
from rembg import remove
from PIL import Image

# Configuration
INPUT_VIDEO = "static/images/character/character_anim.mp4"
FRAMES_DIR = "frames_extracted"
FRAMES_TRANSPARENT_DIR = "frames_transparent"
OUTPUT_WEBM = "static/images/character/character_animated.webm"
FRAMERATE = 24

def extract_frames():
    """Extract frames from MP4"""
    print(f"🎬 Extracting frames from {INPUT_VIDEO}...")
    
    # Clean and create directory
    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR)
    
    # Extract frames
    cmd = [
        "ffmpeg", "-i", INPUT_VIDEO,
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
        "ffmpeg", "-framerate", str(FRAMERATE),
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
