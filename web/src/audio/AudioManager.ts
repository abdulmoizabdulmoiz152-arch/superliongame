export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private masterVolume: number = 0.8;
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.9;
  private isMuted: boolean = false;

  private currentTrack: string | null = null;
  private bgmIntervalId: number | null = null;
  private step: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    // AudioContext will be lazily initialized upon first user interaction
  }

  public init(master = 0.8, music = 0.7, sfx = 0.9, muted = false): void {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.setVolumes(master, music, sfx, muted);
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported in this browser', e);
    }
  }

  public resumeContext(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, music: number, sfx: number, muted?: boolean): void {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;
    if (muted !== undefined) this.isMuted = muted;

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, now);
      if (this.musicGain) this.musicGain.gain.setValueAtTime(this.musicVolume, now);
      if (this.sfxGain) this.sfxGain.gain.setValueAtTime(this.sfxVolume, now);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolumes(this.masterVolume, this.musicVolume, this.sfxVolume, this.isMuted);
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  // --- PROCEDURAL SOUND EFFECTS ---

  public playButtonClick(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playJump(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.14);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playDoubleJump(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playDash(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playAttackSlash(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playCoin(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playGem(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  public playEnemyDefeat(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Pitch sweep down + noise punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playHurt(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playPowerUp(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chords = [392.00, 523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  public playCheckpoint(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  public playLevelComplete(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.35 } // C6
    ];
    let offset = 0;
    fanfare.forEach((n) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + n.d + 0.05);
      offset += n.d * 0.9;
    });
  }

  public playGameOver(): void {
    this.resumeContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.16;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.24);
    });
  }

  // --- PROCEDURAL BACKGROUND MUSIC SEQUENCER ---

  public playMusic(themeName: 'MENU' | 'MEADOWS' | 'CAVES' | 'CYBER' | 'VOLCANO_BOSS' | 'ENDLESS'): void {
    if (this.currentTrack === themeName) return;
    this.stopMusic();
    this.currentTrack = themeName;
    this.step = 0;

    this.resumeContext();
    if (!this.ctx || !this.musicGain) return;

    // Tempo and patterns
    let tempo = 125; // BPM
    if (themeName === 'VOLCANO_BOSS') tempo = 145;
    if (themeName === 'CAVES') tempo = 105;
    if (themeName === 'CYBER') tempo = 135;

    const stepDuration = (60 / tempo) / 4; // 16th note in seconds

    // Scales for each theme (frequencies in Hz)
    const melodyScales: Record<string, number[]> = {
      MENU: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25], // E minor pentatonic / Dorian
      MEADOWS: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C Major pentatonic
      CAVES: [220.00, 261.63, 293.66, 311.13, 329.63, 392.00], // A minor blues
      CYBER: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33], // D minor synthwave
      VOLCANO_BOSS: [220.00, 233.08, 261.63, 293.66, 311.13, 329.63], // Phrygian dark
      ENDLESS: [329.63, 392.00, 440.00, 523.25, 587.33, 659.25]
    };

    const bassNotes: Record<string, number[]> = {
      MENU: [164.81, 196.00, 146.83, 164.81],
      MEADOWS: [130.81, 146.83, 164.81, 196.00],
      CAVES: [110.00, 98.00, 116.54, 110.00],
      CYBER: [146.83, 174.61, 130.81, 146.83],
      VOLCANO_BOSS: [110.00, 116.54, 123.47, 110.00],
      ENDLESS: [164.81, 146.83, 130.81, 164.81]
    };

    const activeScale = melodyScales[themeName] || melodyScales.MENU;
    const activeBass = bassNotes[themeName] || bassNotes.MENU;

    const tick = () => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const currentStep = this.step % 16;
      const bar = Math.floor(this.step / 16) % 4;

      // 1. Kick / Bass pulse on quarter beats (0, 4, 8, 12)
      if (currentStep % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

        kickGain.gain.setValueAtTime(0.35, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);

        kickOsc.start(now);
        kickOsc.stop(now + 0.15);
      }

      // 2. Hi-hat on off-beats (2, 6, 10, 14)
      if (currentStep % 2 === 0) {
        const hhOsc = this.ctx.createOscillator();
        const hhGain = this.ctx.createGain();
        hhOsc.type = 'square';
        hhOsc.frequency.setValueAtTime(2000 + (currentStep % 4) * 400, now);

        hhGain.gain.setValueAtTime(0.06, now);
        hhGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        hhOsc.connect(hhGain);
        hhGain.connect(this.musicGain);

        hhOsc.start(now);
        hhOsc.stop(now + 0.05);
      }

      // 3. Bassline
      if (currentStep % 4 === 0 || currentStep % 4 === 3) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFreq = activeBass[bar] || 130.81;

        bassOsc.type = themeName === 'VOLCANO_BOSS' || themeName === 'CYBER' ? 'sawtooth' : 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.2, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + stepDuration * 2.2);
      }

      // 4. Arpeggiated Melody
      const noteIdx = (currentStep * 3 + bar) % activeScale.length;
      if (currentStep % 2 === 0 || (themeName === 'CYBER' && currentStep % 3 === 0)) {
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();

        melOsc.type = themeName === 'MEADOWS' ? 'sine' : 'triangle';
        melOsc.frequency.setValueAtTime(activeScale[noteIdx], now);

        melGain.gain.setValueAtTime(0.12, now);
        melGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.5);

        melOsc.connect(melGain);
        melGain.connect(this.musicGain);

        melOsc.start(now);
        melOsc.stop(now + stepDuration * 1.6);
      }

      this.step++;
    };

    this.bgmIntervalId = window.setInterval(tick, stepDuration * 1000);
  }

  public stopMusic(): void {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.currentTrack = null;
  }
}
