import { GameState, MapTheme, PlayerSaveData, ShopItem, EnemyType } from '../types/game';
import { GameConfig } from '../config/GameConfig';
import { SaveManager } from '../storage/SaveManager';
import { AudioManager } from '../audio/AudioManager';
import { AdsManager } from '../ads/AdsManager';

export interface UIEventCallbacks {
  onStartCampaignLevel: (levelNum: number) => void;
  onStartEndless: () => void;
  onResume: () => void;
  onRestart: () => void;
  onNextLevel: () => void;
  onQuitToMenu: () => void;
  onSkinEquip: (skinId: string) => void;
  onTrailEquip: (trailId: string) => void;
  onQualityChange?: (quality: 'low' | 'med' | 'high') => void;
}

export class UIManager {
  private currentScreen: GameState = GameState.SPLASH;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private callbacks: UIEventCallbacks | null = null;

  // Touch & Key States
  public inputMoveX: number = 0;
  public inputJumpPressed: boolean = false;
  public inputJumpHeld: boolean = false;
  public inputAttackPressed: boolean = false;
  public inputDashPressed: boolean = false;

  private selectedMapIndex: number = 1;

  constructor(saveManager: SaveManager, audioManager: AudioManager) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.initDOM();
    this.setupInputHandlers();
  }

  public setCallbacks(callbacks: UIEventCallbacks): void {
    this.callbacks = callbacks;
  }

  private initDOM(): void {
    // 1. Splash Screen
    const splashScreen = document.getElementById('screen-splash');
    splashScreen?.addEventListener('click', () => {
      this.audioManager.init();
      this.audioManager.playButtonClick();
      this.showScreen(GameState.MAIN_MENU);
    });

    // 2. Main Menu Navigation
    document.getElementById('btn-menu-play')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.PLAY_MENU);
    });

    document.getElementById('btn-menu-endless')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.ENDLESS_MENU);
    });

    document.getElementById('btn-menu-maps')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.renderMapSelect();
      this.showScreen(GameState.MAP_SELECT);
    });

    document.getElementById('btn-menu-shop')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.renderShop();
      this.showScreen(GameState.SHOP);
    });

    document.getElementById('btn-menu-settings')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.syncSettingsUI();
      this.showScreen(GameState.SETTINGS);
    });

    document.getElementById('btn-menu-credits')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.CREDITS);
    });

    document.getElementById('btn-mute-toggle')?.addEventListener('click', () => {
      const isMuted = this.audioManager.toggleMute();
      const topMuteBtn = document.getElementById('btn-mute-toggle');
      if (topMuteBtn) topMuteBtn.textContent = isMuted ? '🔇' : '🔊';
      const master = document.getElementById('slider-master-vol') as HTMLInputElement | null;
      const music = document.getElementById('slider-music-vol') as HTMLInputElement | null;
      const sfx = document.getElementById('slider-sfx-vol') as HTMLInputElement | null;
      this.saveManager.updateAudioSettings(
        parseFloat(master?.value ?? '80') / 100,
        parseFloat(music?.value ?? '70') / 100,
        parseFloat(sfx?.value ?? '90') / 100,
        isMuted
      );
      this.syncSettingsUI();
    });

    // 3. Play Menu Cards
    document.getElementById('card-mode-campaign')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.renderMapSelect();
      this.showScreen(GameState.MAP_SELECT);
    });

    document.getElementById('card-mode-endless')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.ENDLESS_MENU);
    });

    document.getElementById('btn-play-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.MAIN_MENU);
    });

    // 4. Map & Level Select Back buttons
    document.getElementById('btn-map-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.PLAY_MENU);
    });

    document.getElementById('btn-level-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.renderMapSelect();
      this.showScreen(GameState.MAP_SELECT);
    });

    // 5. Endless Mode Start
    document.getElementById('btn-endless-start')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.callbacks?.onStartEndless();
    });

    document.getElementById('btn-endless-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.PLAY_MENU);
    });

    // 6. Pause Menu
    document.getElementById('btn-pause-hud')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showModal('screen-pause');
    });

    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-pause');
      this.callbacks?.onResume();
    });

    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-pause');
      this.callbacks?.onRestart();
    });

    document.getElementById('btn-pause-settings')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-pause');
      this.syncSettingsUI();
      this.showScreen(GameState.SETTINGS);
    });

    document.getElementById('btn-pause-quit')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-pause');
      this.callbacks?.onQuitToMenu();
    });

    // 7. Game Over Modal
    document.getElementById('btn-gameover-retry')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-game-over');
      this.callbacks?.onRestart();
    });

    document.getElementById('btn-gameover-menu')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-game-over');
      this.callbacks?.onQuitToMenu();
    });

    this.wireWatchAdButton('btn-gameover-watchad');

    // 8. Level Complete Modal
    document.getElementById('btn-vic-next')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-level-complete');
      this.callbacks?.onNextLevel();
    });

    document.getElementById('btn-vic-replay')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-level-complete');
      this.callbacks?.onRestart();
    });

    this.wireWatchAdButton('btn-vic-watchad');

    document.getElementById('btn-vic-map')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-level-complete');
      this.renderMapSelect();
      this.showScreen(GameState.MAP_SELECT);
    });

    // 9. Map Complete Modal
    document.getElementById('btn-world-clear-next')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-map-complete');
      this.renderMapSelect();
      this.showScreen(GameState.MAP_SELECT);
    });

    // 10. Endless Results Modal
    document.getElementById('btn-endless-retry')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-endless-results');
      this.callbacks?.onStartEndless();
    });

    document.getElementById('btn-endless-menu')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-endless-results');
      this.callbacks?.onQuitToMenu();
    });

    // 11. Shop back button & tabs
    document.getElementById('btn-shop-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.MAIN_MENU);
    });

    document.getElementById('tab-shop-skins')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      document.getElementById('tab-shop-skins')?.classList.add('active');
      document.getElementById('tab-shop-trails')?.classList.remove('active');
      this.renderShop('skin');
    });

    document.getElementById('tab-shop-trails')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      document.getElementById('tab-shop-trails')?.classList.add('active');
      document.getElementById('tab-shop-skins')?.classList.remove('active');
      this.renderShop('trail');
    });

    // 12. Settings sliders, quality toggle & buttons
    const masterSlider = document.getElementById('slider-master-vol') as HTMLInputElement | null;
    const musicSlider = document.getElementById('slider-music-vol') as HTMLInputElement | null;
    const sfxSlider = document.getElementById('slider-sfx-vol') as HTMLInputElement | null;

    const updateAudioFromSliders = () => {
      if (!masterSlider || !musicSlider || !sfxSlider) return;
      const m = parseFloat(masterSlider.value) / 100;
      const mu = parseFloat(musicSlider.value) / 100;
      const s = parseFloat(sfxSlider.value) / 100;
      this.audioManager.setVolumes(m, mu, s);
      this.saveManager.updateAudioSettings(m, mu, s);
      const valMaster = document.getElementById('val-vol-master');
      const valMusic = document.getElementById('val-vol-music');
      const valSfx = document.getElementById('val-vol-sfx');
      if (valMaster) valMaster.textContent = `${masterSlider.value}%`;
      if (valMusic) valMusic.textContent = `${musicSlider.value}%`;
      if (valSfx) valSfx.textContent = `${sfxSlider.value}%`;
    };

    masterSlider?.addEventListener('input', updateAudioFromSliders);
    musicSlider?.addEventListener('input', updateAudioFromSliders);
    sfxSlider?.addEventListener('input', updateAudioFromSliders);

    document.querySelectorAll<HTMLButtonElement>('.quality-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audioManager.playButtonClick();
        const quality = btn.dataset.quality === 'high' ? 'high' : btn.dataset.quality === 'low' ? 'low' : 'med';
        document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.saveManager.setQuality(quality);
        this.callbacks?.onQualityChange?.(quality);
      });
    });

    document.getElementById('btn-settings-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.MAIN_MENU);
    });

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showModal('screen-confirm-modal');
    });

    document.getElementById('btn-confirm-reset')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.saveManager.resetAll();
      this.updateTopBarCurrencies();
      this.syncSettingsUI();
      this.hideModal('screen-confirm-modal');
    });

    document.getElementById('btn-cancel-reset')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.hideModal('screen-confirm-modal');
    });

    // 13. Credits Back
    document.getElementById('btn-credits-back')?.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      this.showScreen(GameState.MAIN_MENU);
    });
  }

  private setupInputHandlers(): void {
    // Mobile On-Screen Controls
    const btnLeft = document.getElementById('btn-touch-left');
    const btnRight = document.getElementById('btn-touch-right');
    const btnJump = document.getElementById('btn-touch-jump');
    const btnAttack = document.getElementById('btn-touch-attack');

    const bindTouch = (el: HTMLElement | null, onDown: () => void, onUp: () => void) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
      el.addEventListener('touchcancel', (e) => { e.preventDefault(); onUp(); });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
      el.addEventListener('mouseleave', (e) => { e.preventDefault(); onUp(); });
    };

    bindTouch(btnLeft, () => { this.inputMoveX = -1; btnLeft?.classList.add('pressed'); }, () => { if (this.inputMoveX === -1) this.inputMoveX = 0; btnLeft?.classList.remove('pressed'); });
    bindTouch(btnRight, () => { this.inputMoveX = 1; btnRight?.classList.add('pressed'); }, () => { if (this.inputMoveX === 1) this.inputMoveX = 0; btnRight?.classList.remove('pressed'); });
    bindTouch(btnJump, () => { this.inputJumpPressed = true; this.inputJumpHeld = true; btnJump?.classList.add('pressed'); }, () => { this.inputJumpHeld = false; btnJump?.classList.remove('pressed'); });
    bindTouch(btnAttack, () => { this.inputAttackPressed = true; btnAttack?.classList.add('pressed'); }, () => { btnAttack?.classList.remove('pressed'); });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.inputMoveX = -1;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.inputMoveX = 1;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        if (!this.inputJumpHeld) this.inputJumpPressed = true;
        this.inputJumpHeld = true;
      }
      if (e.code === 'KeyJ' || e.code === 'KeyX') this.inputAttackPressed = true;
      if (e.code === 'KeyK' || e.code === 'ShiftLeft') this.inputDashPressed = true;
      if (e.code === 'Escape') {
        if (this.currentScreen === GameState.PLAYING) {
          this.showModal('screen-pause');
        } else if (document.getElementById('screen-pause')?.classList.contains('active')) {
          this.hideModal('screen-pause');
          this.callbacks?.onResume();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && this.inputMoveX === -1) this.inputMoveX = 0;
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && this.inputMoveX === 1) this.inputMoveX = 0;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') this.inputJumpHeld = false;
    });
  }

  public showScreen(state: GameState): void {
    this.currentScreen = state;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    const screenMap: Partial<Record<GameState, string>> = {
      [GameState.SPLASH]: 'screen-splash',
      [GameState.LOADING]: 'screen-loading',
      [GameState.MAIN_MENU]: 'screen-main-menu',
      [GameState.PLAY_MENU]: 'screen-play-menu',
      [GameState.MAP_SELECT]: 'screen-map-select',
      [GameState.LEVEL_SELECT]: 'screen-level-select',
      [GameState.ENDLESS_MENU]: 'screen-endless-menu',
      [GameState.SHOP]: 'screen-shop',
      [GameState.SETTINGS]: 'screen-settings',
      [GameState.CREDITS]: 'screen-credits'
    };

    const targetId = screenMap[state];
    if (targetId) {
      document.getElementById(targetId)?.classList.add('active');
    }

    const hud = document.getElementById('game-hud');
    if (state === GameState.PLAYING) {
      hud?.classList.remove('hidden');
      AdsManager.setBannerVisible(false);
    } else {
      hud?.classList.add('hidden');
      AdsManager.setBannerVisible(true);
    }

    this.updateTopBarCurrencies();

    // Play appropriate music
    if (state === GameState.MAIN_MENU || state === GameState.PLAY_MENU || state === GameState.MAP_SELECT) {
      this.audioManager.playMusic('MENU');
    }
  }

  public showModal(modalId: string): void {
    document.getElementById(modalId)?.classList.add('active');
  }

  public hideModal(modalId: string): void {
    document.getElementById(modalId)?.classList.remove('active');
  }

  public updateHUD(health: number, maxHealth: number, score: number, coins: number, gems: number, levelName: string, powerupType: string | null, powerupTime: number, bossHealthRatio: number | null = null, bossName: string | null = null): void {
    // Health hearts (ids already correct: hud-hearts, hud-score-val, hud-coin-val, hud-gem-val, hud-level-tag)
    const heartsContainer = document.getElementById('hud-hearts');
    if (heartsContainer) {
      heartsContainer.innerHTML = '';
      for (let i = 0; i < maxHealth; i++) {
        const span = document.createElement('span');
        span.className = `heart ${i < health ? 'filled' : 'empty'}`;
        span.textContent = '❤';
        heartsContainer.appendChild(span);
      }
    }

    // Score & Currency
    const scoreEl = document.getElementById('hud-score-val');
    if (scoreEl) scoreEl.textContent = `${score}`;

    const coinEl = document.getElementById('hud-coin-val');
    if (coinEl) coinEl.textContent = `${coins}`;

    const gemEl = document.getElementById('hud-gem-val');
    if (gemEl) gemEl.textContent = `${gems}`;

    const lvlEl = document.getElementById('hud-level-tag');
    if (lvlEl) lvlEl.textContent = levelName;

    // Powerup bar (ids: hud-powerup-bar, powerup-fill, powerup-name — already correct)
    const puBar = document.getElementById('hud-powerup-bar');
    const puFill = document.getElementById('powerup-fill');
    const puName = document.getElementById('powerup-name');
    if (puBar && puFill && puName) {
      if (powerupType && powerupTime > 0) {
        puBar.classList.remove('hidden');
        puName.textContent = powerupType.replace('_', ' ');
        const pct = Math.max(0, Math.min(100, (powerupTime / 12.0) * 100));
        puFill.style.width = `${pct}%`;
      } else {
        puBar.classList.add('hidden');
      }
    }

    // Boss Bar (container id matches index.html's real markup: hud-boss-bar
    // wraps boss-fill and boss-name)
    const bossContainer = document.getElementById('hud-boss-bar');
    const bossFill = document.getElementById('boss-fill');
    const bossNameEl = document.getElementById('hud-boss-name');
    if (bossContainer && bossFill) {
      if (bossHealthRatio !== null) {
        bossContainer.classList.remove('hidden');
        bossFill.style.width = `${Math.max(0, Math.min(100, bossHealthRatio * 100))}%`;
        if (bossNameEl && bossName) bossNameEl.textContent = bossName.toUpperCase();
      } else {
        bossContainer.classList.add('hidden');
      }
    }
  }

  /** Wires a "Watch Ad: +50 Coins" button. Disabled and marked CLAIMED
   * after one successful reward per screen-visit (re-enabled the next time
   * showGameOver/showLevelComplete is called) so this can't be farmed by
   * repeatedly clicking while sitting on the same results screen. */
  private wireWatchAdButton(buttonId: string): void {
    const btn = document.getElementById(buttonId) as HTMLButtonElement | null;
    if (!btn) return;
    const originalText = btn.textContent ?? '📺 WATCH AD: +50 COINS';

    btn.addEventListener('click', () => {
      this.audioManager.playButtonClick();
      btn.disabled = true;
      btn.textContent = '⏳ LOADING AD...';

      AdsManager.showRewardedAd(
        () => {
          this.saveManager.addCurrency(50, 0);
          this.updateTopBarCurrencies();
          btn.textContent = '✅ CLAIMED!';
        },
        () => {
          btn.textContent = '⚠️ AD NOT READY — TRY LATER';
          setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
          }, 2000);
        }
      );
    });
  }

  public updateTopBarCurrencies(): void {
    const data = this.saveManager.getData();
    // Main menu top bar + shop header currency displays (real ids in the markup)
    document.querySelectorAll('#menu-coin-count, #shop-coins').forEach(el => el.textContent = `${data.coins}`);
    document.querySelectorAll('#menu-gem-count, #shop-gems').forEach(el => el.textContent = `${data.gems}`);

    // Pause modal stats
    const pauseCoins = document.getElementById('pause-coins');
    if (pauseCoins) pauseCoins.textContent = `${data.coins}`;

    // Update campaign & endless stats badges
    const campaignProg = document.getElementById('campaign-progress-badge');
    if (campaignProg) campaignProg.textContent = `${data.unlockedLevel - 1} / 32 Completed`;

    const endlessRecordBadge = document.getElementById('endless-record-badge');
    if (endlessRecordBadge) endlessRecordBadge.textContent = `Best: ${data.endlessBestDistance}m`;

    const endlessBestDist = document.getElementById('endless-best-dist');
    if (endlessBestDist) endlessBestDist.textContent = `${data.endlessBestDistance}m`;

    const endlessBestScore = document.getElementById('endless-best-score');
    if (endlessBestScore) endlessBestScore.textContent = `${data.endlessHighScore}`;

    const endlessTotalRuns = document.getElementById('endless-total-runs');
    if (endlessTotalRuns) endlessTotalRuns.textContent = `${data.endlessTotalRuns}`;
  }

  public renderMapSelect(): void {
    const data = this.saveManager.getData();
    const container = document.getElementById('maps-container');
    if (!container) return;

    const maps = [
      { idx: 1, name: 'Skyline Meadows', desc: 'Floating green islands, breeze lines, and vibrant skies.', bannerClass: 'meadows', levels: 'Levels 1 - 8' },
      { idx: 2, name: 'Crystal Caves', desc: 'Glowing subterranean caves packed with geode gems.', bannerClass: 'caves', levels: 'Levels 9 - 16' },
      { idx: 3, name: 'Cyber Sky City', desc: 'Neon skyscrapers, data ribbons, and laser grids.', bannerClass: 'cyber', levels: 'Levels 17 - 24' },
      { idx: 4, name: 'Volcanic Shadow Realm', desc: 'Molten crags, brimstone, and the Shadow Titan domain.', bannerClass: 'volcano', levels: 'Levels 25 - 32' }
    ];

    container.innerHTML = '';

    maps.forEach(m => {
      const isLocked = m.idx > data.unlockedMaps;
      const card = document.createElement('div');
      card.className = `world-card ${isLocked ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="world-banner ${m.bannerClass}"></div>
        <div class="world-info">
          <div class="world-tag">WORLD 0${m.idx}</div>
          <h3>${m.name}</h3>
          <p>${m.desc}</p>
          <div class="world-stats">${m.levels} ${isLocked ? '• 🔒 LOCKED' : '• UNLOCKED'}</div>
          <button class="game-btn sm ${isLocked ? 'secondary' : 'primary'}">${isLocked ? 'LOCKED' : 'ENTER MAP'}</button>
        </div>
      `;

      if (!isLocked) {
        card.addEventListener('click', () => {
          this.audioManager.playButtonClick();
          this.selectedMapIndex = m.idx;
          this.renderLevelSelect(m.idx, m.name);
          this.showScreen(GameState.LEVEL_SELECT);
        });
      }

      container.appendChild(card);
    });
  }

  public renderLevelSelect(mapIdx: number, mapTitle: string): void {
    const data = this.saveManager.getData();
    const titleEl = document.getElementById('level-select-title');
    if (titleEl) titleEl.textContent = mapTitle;

    const container = document.getElementById('levels-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const startLevel = (mapIdx - 1) * 8 + 1;
    for (let i = 0; i < 8; i++) {
      const levelNum = startLevel + i;
      const isLocked = levelNum > data.unlockedLevel;
      const stars = data.levelStars[levelNum] || 0;

      const tile = document.createElement('div');
      tile.className = `level-tile ${isLocked ? 'locked' : ''}`;
      tile.innerHTML = `
        <span class="level-num">${isLocked ? '🔒' : levelNum}</span>
        <div class="level-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      `;

      if (!isLocked) {
        tile.addEventListener('click', () => {
          this.audioManager.playButtonClick();
          this.callbacks?.onStartCampaignLevel(levelNum);
        });
      }

      container.appendChild(tile);
    }
  }

  public renderShop(activeTab: 'skin' | 'trail' = 'skin'): void {
    const data = this.saveManager.getData();
    const grid = document.getElementById('shop-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const items = activeTab === 'skin' ? GameConfig.COSMETICS.SKINS : GameConfig.COSMETICS.TRAILS;
    const unlockedList = activeTab === 'skin' ? data.unlockedSkins : data.unlockedTrails;
    const equippedId = activeTab === 'skin' ? data.equippedSkin : data.equippedTrail;

    items.forEach(item => {
      const isUnlocked = unlockedList.includes(item.id);
      const isEquipped = equippedId === item.id;

      const card = document.createElement('div');
      card.className = `shop-item-card ${isEquipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="shop-item-preview" style="background: radial-gradient(circle, ${item.colorHex} 0%, ${item.secondaryHex} 100%);">
          ${isEquipped ? '✓' : ''}
        </div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-cost">${isUnlocked ? (isEquipped ? 'EQUIPPED' : 'OWNED') : `${item.cost} ${item.costType === 'COIN' ? 'COINS' : 'GEMS'}`}</div>
        <button class="game-btn sm ${isEquipped ? 'secondary' : 'primary'}">
          ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : 'BUY'}
        </button>
      `;

      card.querySelector('button')?.addEventListener('click', () => {
        this.audioManager.playButtonClick();
        if (isEquipped) return;

        if (isUnlocked) {
          if (activeTab === 'skin') {
            this.saveManager.equipCosmetic(item.id, 'skin');
            this.callbacks?.onSkinEquip(item.id);
          } else {
            this.saveManager.equipCosmetic(item.id, 'trail');
            this.callbacks?.onTrailEquip(item.id);
          }
          this.renderShop(activeTab);
        } else {
          // Purchase
          const coinsNeeded = item.costType === 'COIN' ? item.cost : 0;
          const gemsNeeded = item.costType === 'GEM' ? item.cost : 0;
          if (this.saveManager.spendCurrency(coinsNeeded, gemsNeeded)) {
            this.audioManager.playPowerUp();
            this.saveManager.unlockCosmetic(item.id, activeTab);
            if (activeTab === 'skin') {
              this.saveManager.equipCosmetic(item.id, 'skin');
              this.callbacks?.onSkinEquip(item.id);
            } else {
              this.saveManager.equipCosmetic(item.id, 'trail');
              this.callbacks?.onTrailEquip(item.id);
            }
            this.updateTopBarCurrencies();
            this.renderShop(activeTab);
          } else {
            alert('Not enough coins or gems!');
          }
        }
      });

      grid.appendChild(card);
    });
  }

  private syncSettingsUI(): void {
    const data = this.saveManager.getData();
    const master = document.getElementById('slider-master-vol') as HTMLInputElement | null;
    const music = document.getElementById('slider-music-vol') as HTMLInputElement | null;
    const sfx = document.getElementById('slider-sfx-vol') as HTMLInputElement | null;
    const muteBtn = document.getElementById('btn-mute-toggle');

    if (master) master.value = `${Math.round(data.settings.masterVolume * 100)}`;
    if (music) music.value = `${Math.round(data.settings.musicVolume * 100)}`;
    if (sfx) sfx.value = `${Math.round(data.settings.sfxVolume * 100)}`;
    if (muteBtn) muteBtn.textContent = data.settings.isMuted ? '🔇' : '🔊';

    const valMaster = document.getElementById('val-vol-master');
    const valMusic = document.getElementById('val-vol-music');
    const valSfx = document.getElementById('val-vol-sfx');
    if (valMaster && master) valMaster.textContent = `${master.value}%`;
    if (valMusic && music) valMusic.textContent = `${music.value}%`;
    if (valSfx && sfx) valSfx.textContent = `${sfx.value}%`;

    document.querySelectorAll<HTMLButtonElement>('.quality-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.quality === data.settings.graphicsQuality);
    });
  }

  /** Resets a watch-ad button back to its clickable state — called each
   * time a results screen is shown, so a claim on a previous death/level
   * doesn't carry over and permanently disable the button. */
  private resetWatchAdButton(buttonId: string): void {
    const btn = document.getElementById(buttonId) as HTMLButtonElement | null;
    if (!btn) return;
    btn.disabled = false;
    btn.textContent = '📺 WATCH AD: +50 COINS';
  }

  public showGameOver(score: number, coins: number): void {
    const sc = document.getElementById('over-score-val');
    const cn = document.getElementById('over-coins-val');
    if (sc) sc.textContent = `${score}`;
    if (cn) cn.textContent = `${coins}`;
    this.resetWatchAdButton('btn-gameover-watchad');
    this.showModal('screen-game-over');
    AdsManager.showInterstitial();
  }

  public showLevelComplete(levelNum: number, stars: number, completionTime: number, coins: number, gems: number): void {
    const numEl = document.getElementById('win-level-num');
    const starsEl = document.getElementById('win-stars');
    const timeEl = document.getElementById('win-time');
    const coinsEl = document.getElementById('win-coins');
    const gemsEl = document.getElementById('win-gems');

    if (numEl) numEl.textContent = `LEVEL ${levelNum < 10 ? '0' + levelNum : levelNum}`;
    if (starsEl) starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    if (timeEl) timeEl.textContent = `${Math.round(completionTime)}s`;
    if (coinsEl) coinsEl.textContent = `${coins}`;
    if (gemsEl) gemsEl.textContent = `${gems}`;

    this.resetWatchAdButton('btn-vic-watchad');
    this.showModal('screen-level-complete');
    AdsManager.showInterstitial();
  }

  public showMapComplete(mapIndex: number): void {
    const nameEl = document.getElementById('mapwin-name');
    const names = ['Skyline Meadows', 'Crystal Caves', 'Cyber Sky City', 'Volcanic Shadow Realm'];
    if (nameEl) nameEl.textContent = names[mapIndex - 1] || 'World';
    this.showModal('screen-map-complete');
  }

  public showEndlessResults(distance: number, score: number, coins: number, isNewRecord: boolean): void {
    const distEl = document.getElementById('endless-res-dist');
    const scoreEl = document.getElementById('endless-res-score');
    const coinsEl = document.getElementById('endless-res-coins');
    const recordBadge = document.getElementById('endless-new-record');

    if (distEl) distEl.textContent = `${distance}m`;
    if (scoreEl) scoreEl.textContent = `${score}`;
    if (coinsEl) coinsEl.textContent = `${coins}`;
    if (recordBadge) {
      if (isNewRecord) recordBadge.classList.remove('hidden');
      else recordBadge.classList.add('hidden');
    }

    this.showModal('screen-endless-results');
  }
}
