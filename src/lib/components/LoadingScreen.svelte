<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let isLoading = true;
  
  let progress = 0;
  let loadingText = 'INITIALIZING CYBERCITY...';
  
  const loadingMessages = [
    'INITIALIZING CYBERCITY...',
    'LOADING YOUR MAMA...',
    'SYNCING NEON LIGHTS...',
    'ACTIVATING COFFEE MACHINES...',
    'ABSOLUTELY IMPORTANT LOADINGS...',
    'READY TO EXPLORE'
  ];
  
  onMount(() => {
    let messageIndex = 0;
    let progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress > 100) {
        progress = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          isLoading = false;
        }, 500);
      }
      
      // Update loading message based on progress
      const newIndex = Math.floor((progress / 100) * loadingMessages.length);
      if (newIndex !== messageIndex && newIndex < loadingMessages.length) {
        messageIndex = newIndex;
        loadingText = loadingMessages[messageIndex];
      }
    }, 200);
    
    return () => clearInterval(progressInterval);
  });
</script>

{#if isLoading}
  <div class="loading-screen" transition:fade={{ duration: 500 }}>
    <div class="loading-content">
      <!-- Cyberpunk Logo/Title -->
      <div class="cyber-logo">
        <h1 class="glitch" data-text="JOBRUNNER">JOBRUNNER</h1>
        <p class="subtitle">INTERACTIVE RESUME EXPERIENCE</p>
      </div>
      
      <!-- Spinner -->
      <div class="spinner-container">
        <div class="spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-core"></div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress}%"></div>
          <div class="progress-glow" style="width: {progress}%"></div>
        </div>
        <div class="progress-text">{Math.floor(progress)}%</div>
      </div>
      
      <!-- Loading Message -->
      <div class="loading-message">
        <span class="typing-text">{loadingText}</span>
        <span class="cursor">_</span>
      </div>
    </div>
    
    <!-- Scanlines Effect -->
    <div class="scanlines"></div>
  </div>
{/if}

<style>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 50%, #0f0a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow: hidden;
  }
  
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    z-index: 2;
    padding: 2rem;
  }
  
  /* Logo Section */
  .cyber-logo {
    text-align: center;
  }
  
  .cyber-logo h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 900;
    color: var(--cyan);
    text-shadow: 
      0 0 20px var(--cyan),
      0 0 40px var(--cyan),
      0 0 60px var(--cyan),
      0 0 80px rgba(0, 255, 255, 0.5);
    margin: 0;
    letter-spacing: 0.2em;
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .cyber-logo .glitch {
    position: relative;
  }
  
  .cyber-logo .glitch::before,
  .cyber-logo .glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }
  
  .cyber-logo .glitch::before {
    color: var(--pink);
    animation: glitch-1 2.5s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }
  
  .cyber-logo .glitch::after {
    color: var(--purple);
    animation: glitch-2 2s infinite;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  }
  
  .subtitle {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(0.8rem, 2vw, 1.2rem);
    color: var(--text-secondary);
    letter-spacing: 0.3em;
    margin-top: 0.5rem;
    text-transform: uppercase;
  }
  
  /* Spinner */
  .spinner-container {
    position: relative;
    width: 150px;
    height: 150px;
  }
  
  .spinner {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-radius: 50%;
  }
  
  .spinner-ring:nth-child(1) {
    border-top-color: var(--cyan);
    animation: spin 1.5s linear infinite;
  }
  
  .spinner-ring:nth-child(2) {
    border-right-color: var(--pink);
    animation: spin 2s linear infinite reverse;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
  }
  
  .spinner-ring:nth-child(3) {
    border-bottom-color: var(--purple);
    animation: spin 2.5s linear infinite;
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
  }
  
  .spinner-core {
    position: absolute;
    width: 40%;
    height: 40%;
    top: 30%;
    left: 30%;
    background: radial-gradient(circle, var(--cyan) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  /* Progress Bar */
  .progress-container {
    width: min(400px, 80vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .progress-bar {
    position: relative;
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--cyan), var(--purple));
    transition: width 0.3s ease;
    border-radius: 4px;
  }
  
  .progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--cyan), var(--purple));
    filter: blur(10px);
    opacity: 0.6;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    color: var(--cyan);
    text-shadow: 0 0 10px var(--cyan);
  }
  
  /* Loading Message */
  .loading-message {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: var(--text-secondary);
    text-align: center;
    min-height: 1.5em;
  }
  
  .typing-text {
    display: inline-block;
  }
  
  .cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
    color: var(--cyan);
  }
  
  /* Scanlines Effect */
  .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    opacity: 0.5;
  }
  
  /* Animations */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(0.8);
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      text-shadow: 
        0 0 20px var(--cyan),
        0 0 40px var(--cyan),
        0 0 60px var(--cyan),
        0 0 80px rgba(0, 255, 255, 0.5);
    }
    50% {
      text-shadow: 
        0 0 30px var(--cyan),
        0 0 60px var(--cyan),
        0 0 90px var(--cyan),
        0 0 120px rgba(0, 255, 255, 0.8);
    }
  }
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  
  @keyframes glitch-1 {
    0%, 100% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
  }
  
  @keyframes glitch-2 {
    0%, 100% {
      transform: translate(0);
    }
    20% {
      transform: translate(2px, -2px);
    }
    40% {
      transform: translate(2px, 2px);
    }
    60% {
      transform: translate(-2px, -2px);
    }
    80% {
      transform: translate(-2px, 2px);
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .loading-content {
      gap: 2rem;
    }
    
    .spinner-container {
      width: 120px;
      height: 120px;
    }
  }
</style>
