/**
 * ARTEMIS IV: GATEWAY TO THE MOON
 * Team Éclipse for NASA's SpaceAppsChallenge.org
 * 
 * audio.js - 100% Standalone Web Audio API Sound Synthesizer
 * Zero external audio files required. Runs anywhere.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
    
    // Sustained nodes
    this.rocketRumbleNode = null;
    this.rocketGainNode = null;
    this.rcsGainNode = null;
    this.alarmOsc = null;
    this.alarmGain = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.initialized = true;
      this._setupSustainedEngines();
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.ctx.destination) {
      if (this.isMuted) {
        if (this.rocketGainNode) this.rocketGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        if (this.rcsGainNode) this.rcsGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        if (this.alarmGain) this.alarmGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  _setupSustainedEngines() {
    if (!this.ctx) return;
    
    // --- 1. Rocket Rumble Generator (Brownian / Lowpass Noise) ---
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    this.rocketGainNode = this.ctx.createGain();
    this.rocketGainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.rocketGainNode);
    subOsc.connect(this.rocketGainNode);

    this.rocketGainNode.connect(this.ctx.destination);
    noiseSource.start(0);
    subOsc.start(0);

    // --- 2. RCS / Thruster Hiss Generator (Highpass White Noise) ---
    const rcsBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const rcsData = rcsBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      rcsData[i] = Math.random() * 2 - 1;
    }
    const rcsSource = this.ctx.createBufferSource();
    rcsSource.buffer = rcsBuffer;
    rcsSource.loop = true;

    const rcsFilter = this.ctx.createBiquadFilter();
    rcsFilter.type = 'bandpass';
    rcsFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    rcsFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.rcsGainNode = this.ctx.createGain();
    this.rcsGainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    rcsSource.connect(rcsFilter);
    rcsFilter.connect(this.rcsGainNode);
    this.rcsGainNode.connect(this.ctx.destination);
    rcsSource.start(0);
  }

  // Set continuous rocket rumble volume based on throttle (0.0 to 1.0)
  setRocketThrottle(throttle) {
    if (!this.initialized || this.isMuted || !this.rocketGainNode) return;
    const targetGain = Math.min(Math.max(throttle, 0), 1.0) * 0.45;
    this.rocketGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
  }

  stopRocketThrottle() {
    if (!this.rocketGainNode) return;
    this.rocketGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
  }

  // Set continuous RCS jet sound
  setRcsActive(active) {
    if (!this.initialized || this.isMuted || !this.rcsGainNode) return;
    const targetGain = active ? 0.25 : 0;
    this.rcsGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.04);
  }

  // UI Beep / Button Click
  playClick(freq = 600) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Terminal Chirp for CAPCOM AI
  playCapcomChirp() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.setValueAtTime(1750, now + 0.03);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Stage Separation explosive blast
  playStageSeparation() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Noise blast
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Deep sub-thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Max-Q / Emergency Warning Alarm
  startAlarm() {
    if (this.isMuted || this.alarmOsc) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.alarmOsc = this.ctx.createOscillator();
    this.alarmGain = this.ctx.createGain();
    this.alarmOsc.type = 'sawtooth';
    this.alarmOsc.frequency.setValueAtTime(880, now);

    // LFO for pulsing siren
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(4, now); // 4 pulses per sec
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, now);
    lfo.connect(this.alarmOsc.frequency);
    lfo.start(now);

    this.alarmGain.gain.setValueAtTime(0.12, now);
    this.alarmOsc.connect(this.alarmGain);
    this.alarmGain.connect(this.ctx.destination);
    this.alarmOsc.start(now);
    this.alarmLfo = lfo;
  }

  stopAlarm() {
    if (!this.alarmOsc) return;
    try {
      this.alarmOsc.stop();
      if (this.alarmLfo) this.alarmLfo.stop();
    } catch(e) {}
    this.alarmOsc = null;
    this.alarmGain = null;
    this.alarmLfo = null;
  }

  // Crash / Explosion
  playExplosion() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // Safe Touchdown / Level Victory Fanfare
  playVictory() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.7);
    });
  }

  // Comic dramatic swoosh / punch
  playComicAction(type = 'punch') {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (type === 'whoosh') {
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.25);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.5);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } else {
      // Impact punch
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  }
}

// Global Sound Instance
window.Sound = new SoundEngine();
