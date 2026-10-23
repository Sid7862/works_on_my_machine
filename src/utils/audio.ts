// Web Audio API Synthesizer for self-contained, zero-dependency sound effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Deep cartoon explosion with rumble and crackle
  playExplosion(intensity: number = 1.0) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Noise burst for initial blast
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 * intensity, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.7);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7 * intensity, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. Low sub-bass drop for heavy cinematic punch
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 * intensity, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);

      oscGain.gain.setValueAtTime(0.9 * intensity, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Audio playback fails gracefully if blocked by browser policy
    }
  }

  // Satisfying coffee slurp and sigh
  playCoffeeSlurp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Filtered noise with rising frequency mimicking suction
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(1800, now + 0.35);
      filter.Q.value = 4.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // Warm little bell chime on finishing the sip
      setTimeout(() => {
        if (!this.ctx || !this.enabled) return;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const t = this.ctx.currentTime;
        chime.type = 'sine';
        chime.frequency.setValueAtTime(587.33, t); // D5
        chimeGain.gain.setValueAtTime(0.2, t);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(t);
        chime.stop(t + 0.4);
      }, 400);
    } catch {}
  }

  // European / Datacenter Emergency Siren sweep
  playSiren() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.25);
      osc.frequency.linearRampToValueAtTime(650, now + 0.5);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.25);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {}
  }

  // High-pitch matrix glitch bleep
  playGlitch() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(800, now + 0.05);
      osc.frequency.setValueAtTime(1600, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Local build success chime
  playSuccessDing() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }
}

export const sound = new SoundEngine();
