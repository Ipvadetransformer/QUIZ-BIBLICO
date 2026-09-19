// Web Audio API sound synthesizer for interactive feedback
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private correctAudio: HTMLAudioElement | null = null;
  private incorrectAudio: HTMLAudioElement | null = null;

  constructor() {
    // Preload 'Certa Resposta!' and 'Errou!' audios
    if (typeof window !== 'undefined') {
      try {
        this.correctAudio = new Audio('/certa-resposta.mp3');
        this.correctAudio.preload = 'auto';
      } catch {
        this.correctAudio = null;
      }

      try {
        this.incorrectAudio = new Audio('/errou.mp3');
        this.incorrectAudio.preload = 'auto';
      } catch {
        this.incorrectAudio = null;
      }
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not permitted or suspended
    }
  }

  public playCorrect(): void {
    if (this.isMuted) return;

    // Play "Certa Resposta!" audio file
    let audioPlayed = false;
    try {
      if (typeof window !== 'undefined') {
        const sound = this.correctAudio || new Audio('/certa-resposta.mp3');
        sound.currentTime = 0;
        sound.volume = 0.9;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audioPlayed = true;
            })
            .catch(() => {
              // Fallback to synthesized chime if audio element playback is restricted
              this.playSynthesizedCorrect();
            });
        }
      }
    } catch {
      this.playSynthesizedCorrect();
    }
  }

  public playSynthesizedCorrect(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord chime)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Audio not permitted
    }
  }

  public playIncorrect(): void {
    if (this.isMuted) return;

    // Play "Errou!" audio file
    try {
      if (typeof window !== 'undefined') {
        const sound = this.incorrectAudio || new Audio('/errou.mp3');
        sound.currentTime = 0;
        sound.volume = 0.95;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.playSynthesizedIncorrect();
          });
        }
      }
    } catch {
      this.playSynthesizedIncorrect();
    }
  }

  public playSynthesizedIncorrect(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const notes = [311.13, 277.18]; // Eb4 down to C#4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        const startTime = ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio not permitted
    }
  }

  public playChime(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      // High bright sparkle for streak
      const notes = [880, 1174.66, 1318.51, 1760]; // A5, D6, E6, A6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio not permitted
    }
  }

  public playCelebration(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      // Fanfare progression
      const notes = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.12 },
        { f: 1046.5, t: 0.36, d: 0.45 },
        { f: 880, t: 0.85, d: 0.12 },
        { f: 1046.5, t: 0.98, d: 0.55 },
      ];
      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + t);

        const startTime = ctx.currentTime + t;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + d);
      });
    } catch {
      // Audio not permitted
    }
  }
}

export const soundManager = new SoundManager();
