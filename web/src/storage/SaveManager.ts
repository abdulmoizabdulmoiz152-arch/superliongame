import { PlayerSaveData } from '../types/game';

const SAVE_KEY = 'super_line_adventure_save_v1';

const DEFAULT_SAVE: PlayerSaveData = {
  unlockedLevel: 1,
  unlockedMaps: 1,
  levelStars: {},
  levelBestTimes: {},
  coins: 0,
  gems: 0,
  endlessHighScore: 0,
  endlessBestDistance: 0,
  endlessTotalRuns: 0,
  equippedSkin: 'skin_default',
  equippedTrail: 'trail_default',
  unlockedSkins: ['skin_default'],
  unlockedTrails: ['trail_default'],
  settings: {
    masterVolume: 0.8,
    musicVolume: 0.7,
    sfxVolume: 0.9,
    isMuted: false,
    graphicsQuality: 'med'
  }
};

export class SaveManager {
  private data: PlayerSaveData;

  constructor() {
    this.data = this.load();
  }

  private load(): PlayerSaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SAVE,
          ...parsed,
          settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) },
          levelStars: parsed.levelStars || {},
          levelBestTimes: parsed.levelBestTimes || {}
        };
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or failed to parse, using memory state', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SAVE));
  }

  public save(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  public getData(): PlayerSaveData {
    return this.data;
  }

  public unlockNextLevel(completedLevel: number, stars: number, completionTimeSec: number): void {
    // Record stars & best time
    const prevStars = this.data.levelStars[completedLevel] || 0;
    if (stars > prevStars) {
      this.data.levelStars[completedLevel] = stars;
    }

    const prevTime = this.data.levelBestTimes[completedLevel] || 99999;
    if (completionTimeSec < prevTime) {
      this.data.levelBestTimes[completedLevel] = Math.round(completionTimeSec);
    }

    // Unlock next level up to 32
    if (completedLevel >= this.data.unlockedLevel && completedLevel < 32) {
      this.data.unlockedLevel = completedLevel + 1;
    }

    // Check map unlocks: Level 8 clears Map 1 -> unlocks Map 2; Level 16 unlocks Map 3; Level 24 unlocks Map 4
    if (completedLevel >= 8 && this.data.unlockedMaps < 2) this.data.unlockedMaps = 2;
    if (completedLevel >= 16 && this.data.unlockedMaps < 3) this.data.unlockedMaps = 3;
    if (completedLevel >= 24 && this.data.unlockedMaps < 4) this.data.unlockedMaps = 4;

    this.save();
  }

  public addCurrency(coins: number, gems: number): void {
    this.data.coins += coins;
    this.data.gems += gems;
    this.save();
  }

  public spendCurrency(coins: number, gems: number): boolean {
    if (this.data.coins >= coins && this.data.gems >= gems) {
      this.data.coins -= coins;
      this.data.gems -= gems;
      this.save();
      return true;
    }
    return false;
  }

  public recordEndlessRun(distance: number, score: number): boolean {
    this.data.endlessTotalRuns += 1;
    let isNewRecord = false;
    if (score > this.data.endlessHighScore) {
      this.data.endlessHighScore = score;
      isNewRecord = true;
    }
    if (distance > this.data.endlessBestDistance) {
      this.data.endlessBestDistance = distance;
    }
    this.save();
    return isNewRecord;
  }

  public unlockCosmetic(id: string, type: 'skin' | 'trail'): void {
    if (type === 'skin' && !this.data.unlockedSkins.includes(id)) {
      this.data.unlockedSkins.push(id);
    } else if (type === 'trail' && !this.data.unlockedTrails.includes(id)) {
      this.data.unlockedTrails.push(id);
    }
    this.save();
  }

  public equipCosmetic(id: string, type: 'skin' | 'trail'): void {
    if (type === 'skin') this.data.equippedSkin = id;
    else if (type === 'trail') this.data.equippedTrail = id;
    this.save();
  }

  public updateAudioSettings(master: number, music: number, sfx: number, muted?: boolean): void {
    this.data.settings.masterVolume = master;
    this.data.settings.musicVolume = music;
    this.data.settings.sfxVolume = sfx;
    if (muted !== undefined) this.data.settings.isMuted = muted;
    this.save();
  }

  public setQuality(quality: 'low' | 'med' | 'high'): void {
    this.data.settings.graphicsQuality = quality;
    this.save();
  }

  public resetAll(): void {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }
}
