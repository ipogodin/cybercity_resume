<script>
  import { onMount } from 'svelte';
  
  let audioEnabled = $state(false);
  let rainEnabled = $state(true);
  let rainAudio;
  let uiClickAudio;
  let volume = $state(0.15); // Default to 15% volume
  let showVolumeSlider = $state(false);
  let autoplayBlocked = $state(false); // Track if autoplay was blocked
  
  // Initialize audio elements
  onMount(() => {
    // Check if user previously enabled audio
    const savedPreference = localStorage.getItem('audioEnabled');
    const wasAudioEnabled = savedPreference === 'true';
    
    // Check rain preference and dispatch event to RainEffect
    const savedRain = localStorage.getItem('rainEnabled');
    const wasRainEnabled = savedRain === 'true';
    if (savedRain !== null) {
      rainEnabled = wasRainEnabled;
      // Dispatch event immediately to sync with RainEffect
      window.dispatchEvent(new CustomEvent('rainToggle', { detail: { enabled: rainEnabled } }));
    }
    
    // Create audio elements
    rainAudio = new Audio();
    rainAudio.loop = true;
    rainAudio.volume = volume;
    
    uiClickAudio = new Audio();
    uiClickAudio.volume = volume * 0.5; // UI sounds quieter
    
    // Note: Audio files would need to be added to /static/sounds/
    rainAudio.src = '/sounds/rain_n_music.mp3';
    // uiClickAudio.src = '/sounds/ui-click.mp3';
    
    console.log('🎵 Audio initialized:', {
      src: rainAudio.src,
      wasAudioEnabled,
      wasRainEnabled,
      readyState: rainAudio.readyState
    });
    
    // Load the audio file
    rainAudio.load();
    
    rainAudio.addEventListener('canplaythrough', () => {
      console.log('✅ Audio file loaded and ready to play');
    });
    
    rainAudio.addEventListener('error', (e) => {
      console.error('❌ Audio loading error:', e);
      console.error('Audio error details:', rainAudio.error?.code, rainAudio.error?.message);
    });
    
    // If audio was previously enabled, try to resume playback
    if (wasAudioEnabled) {
      // Attempt to play (may be blocked by browser autoplay policy)
      console.log('Attempting autoplay on mount...');
      rainAudio.play()
        .then(() => {
          console.log('✅ Autoplay successful');
          audioEnabled = true;
          autoplayBlocked = false;
        })
        .catch(e => {
          console.log('⚠️ Audio autoplay blocked by browser. Muting audio on reload.');
          // If autoplay is blocked, turn audio OFF instead of showing blocked state
          audioEnabled = false;
          localStorage.setItem('audioEnabled', 'false');
          autoplayBlocked = false;
        });
    }
    
    return () => {
      if (rainAudio) {
        rainAudio.pause();
        rainAudio = null;
      }
      if (uiClickAudio) {
        uiClickAudio.pause();
        uiClickAudio = null;
      }
    };
  });
  
  function toggleAudio() {
    audioEnabled = !audioEnabled;
    localStorage.setItem('audioEnabled', audioEnabled.toString());
    
    if (audioEnabled && rainAudio) {
      // Play rain ambiance when enabled
      console.log('Attempting to play audio...');
      autoplayBlocked = false; // Clear the blocked state when user interacts
      const playPromise = rainAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Audio playing successfully');
          })
          .catch(e => {
            console.error('❌ Audio play failed:', e);
            console.log('Try interacting with the page (click anywhere) to start audio');
          });
      }
    } else if (rainAudio) {
      rainAudio.pause();
      console.log('Audio paused');
    }
    
    // Play UI click sound
    playUISound();
  }
  
  function toggleRain() {
    rainEnabled = !rainEnabled;
    localStorage.setItem('rainEnabled', rainEnabled.toString());
    
    // Dispatch event to parent to control RainEffect component
    window.dispatchEvent(new CustomEvent('rainToggle', { detail: { enabled: rainEnabled } }));
  }
  
  function playUISound() {
    if (audioEnabled && uiClickAudio) {
      uiClickAudio.currentTime = 0;
      uiClickAudio.play().catch(e => console.log('UI sound play prevented:', e));
    }
  }
  
  function updateVolume(event) {
    volume = parseFloat(event.target.value);
    if (rainAudio) rainAudio.volume = volume;
    if (uiClickAudio) uiClickAudio.volume = volume * 0.5;
  }
  
  function toggleVolumeSlider() {
    showVolumeSlider = !showVolumeSlider;
  }
</script>

<div class="controls-container">
  <!-- Rain Toggle Button -->
  <button 
    class="control-btn rain-btn"
    onclick={toggleRain}
    aria-label={rainEnabled ? 'Disable rain' : 'Enable rain'}
    title={rainEnabled ? 'Rain: ON' : 'Rain: OFF'}
  >
    {#if rainEnabled}
      <!-- Rain Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="8" y1="19" x2="8" y2="21"></line>
        <line x1="8" y1="13" x2="8" y2="15"></line>
        <line x1="16" y1="19" x2="16" y2="21"></line>
        <line x1="16" y1="13" x2="16" y2="15"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="12" y1="15" x2="12" y2="17"></line>
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
      </svg>
    {:else}
      <!-- No Rain Icon (Cloud with X) -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    {/if}
  </button>
  
  <!-- Audio Toggle Button -->
  <button 
    class="control-btn audio-btn"
    class:autoplay-blocked={autoplayBlocked && audioEnabled}
    onclick={toggleAudio}
    aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
    title={autoplayBlocked && audioEnabled ? 'Click to start audio' : (audioEnabled ? 'Audio: ON' : 'Audio: OFF')}
  >
    {#if audioEnabled}
      <!-- Volume On Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
    {:else}
      <!-- Volume Off Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    {/if}
  </button>
  
  <!-- Volume Control Button (only visible when audio is on) -->
  {#if audioEnabled}
    <button 
      class="control-btn volume-btn"
      onclick={toggleVolumeSlider}
      aria-label="Adjust volume"
      title="Volume Control"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="21" x2="4" y2="14"></line>
        <line x1="4" y1="10" x2="4" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="3"></line>
        <line x1="20" y1="21" x2="20" y2="16"></line>
        <line x1="20" y1="12" x2="20" y2="3"></line>
        <line x1="1" y1="14" x2="7" y2="14"></line>
        <line x1="9" y1="8" x2="15" y2="8"></line>
        <line x1="17" y1="16" x2="23" y2="16"></line>
      </svg>
    </button>
    
    <!-- Volume Slider -->
    {#if showVolumeSlider}
      <div class="volume-slider-container">
        <div class="slider-wrapper">
          <div class="slider-track">
            <div class="slider-fill" style="width: {volume * 100}%"></div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            oninput={updateVolume}
            class="volume-slider"
            aria-label="Volume level"
          />
        </div>
        <span class="volume-label">{Math.round(volume * 100)}%</span>
      </div>
    {/if}
  {/if}
</div>

<style>
  .controls-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 100;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    animation: fadeInUp 0.6s ease-out 0.3s backwards;
  }
  
  /* Unified button design */
  .control-btn {
    min-width: 48px;
    min-height: 48px;
    padding: 0.625rem 1rem;
    border-radius: 8px;
    border: 2px solid var(--cyan);
    background: rgba(0, 10, 20, 0.8);
    backdrop-filter: blur(10px);
    color: var(--cyan);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.3),
      inset 0 0 10px rgba(0, 255, 255, 0.1);
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .control-btn svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  .control-btn:hover {
    border-color: var(--pink);
    color: var(--pink);
    box-shadow: 
      0 0 30px rgba(255, 0, 110, 0.5),
      inset 0 0 15px rgba(255, 0, 110, 0.2);
    transform: translateY(-2px);
  }
  
  .control-btn:active {
    transform: translateY(0);
  }
  
  /* Autoplay blocked indicator - pulsing animation */
  .control-btn.autoplay-blocked {
    animation: pulse-attention 2s ease-in-out infinite;
  }
  
  @keyframes pulse-attention {
    0%, 100% {
      box-shadow: 
        0 0 20px rgba(255, 200, 0, 0.5),
        inset 0 0 10px rgba(255, 200, 0, 0.2);
      border-color: #ffc800;
    }
    50% {
      box-shadow: 
        0 0 40px rgba(255, 200, 0, 0.8),
        inset 0 0 20px rgba(255, 200, 0, 0.3);
      border-color: #ffdd00;
    }
  }
  
  /* Volume button - smaller, circular */
  .volume-btn {
    min-width: 40px;
    min-height: 40px;
    padding: 0.5rem;
    border-radius: 50%;
    border-color: var(--purple);
    color: var(--purple);
    box-shadow: 
      0 0 15px rgba(185, 0, 255, 0.3),
      inset 0 0 10px rgba(185, 0, 255, 0.1);
  }
  
  .volume-btn:hover {
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 
      0 0 25px rgba(0, 255, 255, 0.5),
      inset 0 0 15px rgba(0, 255, 255, 0.815);
  }
  
  .volume-btn svg {
    width: 18px;
    height: 18px;
  }
  
  /* Volume Slider */
  .volume-slider-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 10, 20, 0.9);
    backdrop-filter: blur(10px);
    padding: 0.75rem 1rem;
    border-radius: 25px;
    border: 1px solid var(--purple);
    box-shadow: 
      0 0 20px rgba(187, 0, 255, 0.788),
      inset 0 0 10px rgba(149, 207, 150, 0.705);
    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Slider wrapper for visual progress */
  .slider-wrapper {
    position: relative;
    width: 100px;
    height: 20px;
    display: flex;
    align-items: center;
  }
  
  .slider-track {
    position: absolute;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    pointer-events: none;
    overflow: hidden;
  }
  
  .slider-fill {
    position: absolute;
    height: 100%;
    background: var(--cyan);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
    transition: width 0.1s ease-out;
    pointer-events: none;
  }
  
  .volume-slider {
    width: 100%;
    height: 20px;
    outline: none;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
    margin: 0;
  }
  
  /* WebKit browsers (Chrome, Safari, Edge) */
  .volume-slider::-webkit-slider-track {
    background: transparent;
    border: none;
  }
  
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cyan);
    cursor: pointer;
    box-shadow: 
      0 0 10px var(--cyan),
      0 0 20px rgba(0, 255, 255, 0.5),
      inset 0 0 5px rgba(255, 255, 255, 0.5);
    transition: all 0.2s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .volume-slider::-webkit-slider-thumb:hover {
    transform: scale(1.3);
    box-shadow: 
      0 0 15px var(--cyan),
      0 0 30px rgba(0, 255, 255, 0.8),
      inset 0 0 8px rgba(255, 255, 255, 0.7);
  }
  
  /* Firefox */
  .volume-slider::-moz-range-track {
    background: transparent;
    border: none;
  }
  
  .volume-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cyan);
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0 10px var(--cyan),
      0 0 20px rgba(0, 255, 255, 0.5),
      inset 0 0 5px rgba(255, 255, 255, 0.5);
    transition: all 0.2s ease;
  }
  
  .volume-slider::-moz-range-thumb:hover {
    transform: scale(1.3);
    box-shadow: 
      0 0 15px var(--cyan),
      0 0 30px rgba(0, 255, 255, 0.8),
      inset 0 0 8px rgba(255, 255, 255, 0.7);
  }
  
  /* Progress fill effect for Firefox */
  .volume-slider::-moz-range-progress {
    background: transparent;
  }
  
  .volume-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.875rem;
    color: var(--cyan);
    text-shadow: 0 0 5px var(--cyan);
    min-width: 40px;
    text-align: right;
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .controls-container {
      bottom: 1rem;
      right: 1rem;
      gap: 0.5rem;
    }
    
    .control-btn {
      min-width: 44px;
      min-height: 44px;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
    }
    
    .control-btn svg {
      width: 18px;
      height: 18px;
    }
    
    .volume-btn {
      min-width: 36px;
      min-height: 36px;
    }
    
    .volume-btn svg {
      width: 16px;
      height: 16px;
    }
    
    .volume-slider-container {
      position: absolute;
      bottom: 60px;
      right: 0;
    }
    
    .volume-slider {
      width: 80px;
    }
  }
  
  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .control-btn,
    .volume-slider-container {
      transition: none;
      animation: none;
    }
  }
</style>
