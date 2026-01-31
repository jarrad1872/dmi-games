/**
 * Audio Manager
 * Handles game audio using Web Audio API with procedurally generated sounds
 */

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    // Audio context is created on first user interaction
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init(): void {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  /**
   * Enable/disable audio
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = enabled ? 0.5 : 0;
    }
  }

  /**
   * Play slice/whoosh sound
   */
  playSlice(): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Create noise for whoosh effect
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Filtered noise with decay
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2) * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // High-pass filter for crisp sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    // Envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noise.start(now);
    noise.stop(now + 0.15);

    // Add a subtle pitch sweep for "cut" feel
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.15, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(oscGain);
    oscGain.connect(master);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Play satisfying impact/hit sound
   */
  playImpact(): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Low thump
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Play coin collection sound
   */
  playCoin(): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Two-tone coin jingle
    const frequencies = [880, 1100];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = now + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(master);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  /**
   * Play level complete fanfare
   */
  playLevelComplete(): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.15;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = now + i * duration;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.setValueAtTime(0.25, startTime + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 1.5);

      osc.connect(gain);
      gain.connect(master);

      osc.start(startTime);
      osc.stop(startTime + duration * 1.5);
    });

    // Final chord
    const chordTime = now + notes.length * duration;
    const chordNotes = [523.25, 659.25, 783.99];

    chordNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, chordTime);
      gain.gain.linearRampToValueAtTime(0.15, chordTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.8);

      osc.connect(gain);
      gain.connect(master);

      osc.start(chordTime);
      osc.stop(chordTime + 0.8);
    });
  }

  /**
   * Play star award sound (for each star)
   */
  playStar(starIndex: number): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Higher pitch for each star
    const baseFreq = 600 + starIndex * 200;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Play button click sound
   */
  playClick(): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 600;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Play destruction/explosion burst sound
   */
  playBurst(): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const ctx = this.audioContext;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Noise burst
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.5) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Band-pass filter for "pop" sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noise.start(now);
    noise.stop(now + 0.3);

    // Low frequency impact
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(oscGain);
    oscGain.connect(master);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// Singleton instance
export const audioManager = new AudioManager();
