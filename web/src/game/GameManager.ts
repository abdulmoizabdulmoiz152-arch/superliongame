import * as BABYLON from 'babylonjs';
import { GameMode, GameState, MapTheme, PowerUpType } from '../types/game';
import { GameConfig } from '../config/GameConfig';
import { SaveManager } from '../storage/SaveManager';
import { AudioManager } from '../audio/AudioManager';
import { ParticleManager } from '../effects/ParticleManager';
import { CameraManager } from '../camera/CameraManager';
import { SuperLineHero } from '../player/SuperLineHero';
import { LevelManager } from '../levels/LevelManager';
import { ALL_LEVELS } from '../levels/LevelData';
import { EnemyManager } from '../enemies/EnemyManager';
import { EndlessModeManager } from '../endless/EndlessModeManager';
import { UIManager } from '../ui/UIManager';

export class GameManager {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  // Lights & Environment
  private hemiLight: BABYLON.HemisphericLight;
  private dirLight: BABYLON.DirectionalLight;
  private backgroundMesh: BABYLON.Mesh;
  private bgMat: BABYLON.StandardMaterial;

  // Core Subsystems
  public saveManager: SaveManager;
  public audioManager: AudioManager;
  public particleManager: ParticleManager;
  public cameraManager: CameraManager;
  public levelManager: LevelManager;
  public enemyManager: EnemyManager;
  public endlessManager: EndlessModeManager;
  public uiManager: UIManager;
  public hero: SuperLineHero;

  // Game Loop State
  public currentMode: GameMode = GameMode.CAMPAIGN;
  public currentLevelIndex: number = 0; // 0 to 31
  public isPaused: boolean = false;
  private levelStartTime: number = 0;
  private coinsInCurrentRun: number = 0;
  private gemsInCurrentRun: number = 0;
  private scoreInCurrentRun: number = 0;
  // State guards (Part 10 hardening): each is reset once per fresh level/run
  // start and flips permanently true the first time its event fires, so a
  // condition that stays true across multiple frames (goal portal overlap,
  // hero.health <= 0) can only ever trigger its handler once.
  private levelCompleted: boolean = false;
  private isHandlingDeath: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new BABYLON.Scene(this.engine);

    // Subsystems
    this.saveManager = new SaveManager();
    this.audioManager = new AudioManager();
    this.particleManager = new ParticleManager(this.scene);
    this.cameraManager = new CameraManager(this.scene, canvas);
    this.enemyManager = new EnemyManager(this.scene, this.audioManager, this.particleManager);
    this.levelManager = new LevelManager(this.scene, this.audioManager, this.particleManager);
    this.endlessManager = new EndlessModeManager(this.scene, this.audioManager, this.particleManager, this.enemyManager);
    this.uiManager = new UIManager(this.saveManager, this.audioManager);

    // Setup Lighting & Scenic Backdrop
    this.hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, -0.5), this.scene);
    this.hemiLight.intensity = 0.9;

    this.dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(0.3, -1, 1), this.scene);
    this.dirLight.intensity = 0.6;

    // Scenic 2.5D Background Plane
    this.backgroundMesh = BABYLON.MeshBuilder.CreatePlane('bgPlane', { width: 120, height: 60 }, this.scene);
    this.backgroundMesh.position.set(0, 8, 20);
    this.bgMat = new BABYLON.StandardMaterial('bgMat', this.scene);
    this.bgMat.emissiveColor = BABYLON.Color3.FromHexString('#09152b');
    this.bgMat.disableLighting = true;
    this.backgroundMesh.material = this.bgMat;

    // Create Hero
    const equippedSkin = this.getEquippedSkinColors();
    this.hero = new SuperLineHero(
      this.scene,
      this.audioManager,
      this.particleManager,
      0,
      1.5,
      equippedSkin.primary,
      equippedSkin.secondary
    );

    this.bindUICallbacks();
    this.startRenderLoop();

    // Resize listener
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private getEquippedSkinColors(): { primary: string; secondary: string } {
    const data = this.saveManager.getData();
    const skin = GameConfig.COSMETICS.SKINS.find(s => s.id === data.equippedSkin) || GameConfig.COSMETICS.SKINS[0];
    return { primary: skin.colorHex, secondary: skin.secondaryHex };
  }

  private bindUICallbacks(): void {
    this.uiManager.setCallbacks({
      onStartCampaignLevel: (levelNum: number) => {
        this.startCampaignLevel(levelNum - 1);
      },
      onStartEndless: () => {
        this.startEndlessMode();
      },
      onResume: () => {
        this.isPaused = false;
      },
      onRestart: () => {
        if (this.currentMode === GameMode.CAMPAIGN) {
          this.startCampaignLevel(this.currentLevelIndex);
        } else {
          this.startEndlessMode();
        }
      },
      onNextLevel: () => {
        if (this.currentLevelIndex < 31) {
          this.startCampaignLevel(this.currentLevelIndex + 1);
        } else {
          this.uiManager.showScreen(GameState.MAIN_MENU);
        }
      },
      onQuitToMenu: () => {
        this.isPaused = false;
        this.levelManager.clear();
        this.enemyManager.clear();
        this.endlessManager.clear();
        this.hero.mesh.setEnabled(false);
        this.uiManager.showScreen(GameState.MAIN_MENU);
      },
      onSkinEquip: (skinId: string) => {
        const skin = GameConfig.COSMETICS.SKINS.find(s => s.id === skinId);
        if (skin) {
          this.hero.updateSkin(skin.colorHex, skin.secondaryHex);
        }
      },
      onTrailEquip: (trailId: string) => {
        // Trail visual config updated
      }
    });
  }

  public startCampaignLevel(levelIndex: number): void {
    this.currentMode = GameMode.CAMPAIGN;
    this.currentLevelIndex = levelIndex;
    this.isPaused = false;
    this.coinsInCurrentRun = 0;
    this.gemsInCurrentRun = 0;
    this.scoreInCurrentRun = 0;
    this.levelStartTime = Date.now();
    this.levelCompleted = false;
    this.isHandlingDeath = false;

    const config = ALL_LEVELS[levelIndex];
    this.levelManager.loadLevel(config);
    this.enemyManager.spawnEnemies(config.enemies);
    this.endlessManager.clear();

    // Setup Theme & Atmosphere
    const themeConfig = GameConfig.WORLD_THEMES[config.theme] || GameConfig.WORLD_THEMES[MapTheme.SKYLINE_MEADOWS];
    this.scene.clearColor = BABYLON.Color4.FromHexString(themeConfig.clearColor + 'ff');
    this.bgMat.emissiveColor = BABYLON.Color3.FromHexString(themeConfig.ambientColor);

    this.particleManager.setWorldThemeAmbient(config.theme, this.hero.position);

    // Setup Camera Bounds
    this.cameraManager.setBounds(-8, config.boundsX, -8, config.boundsY);

    // Position Hero
    this.hero.respawn(config.playerStartX, config.playerStartY);
    this.cameraManager.snapTo(this.hero.position);

    // Start Track
    const themeMap: Record<MapTheme, 'MEADOWS' | 'CAVES' | 'CYBER' | 'VOLCANO_BOSS'> = {
      [MapTheme.SKYLINE_MEADOWS]: 'MEADOWS',
      [MapTheme.CRYSTAL_CAVES]: 'CAVES',
      [MapTheme.CYBER_SKY_CITY]: 'CYBER',
      [MapTheme.VOLCANIC_SHADOW_REALM]: 'VOLCANO_BOSS'
    };
    this.audioManager.playMusic(config.hasBoss ? 'VOLCANO_BOSS' : themeMap[config.theme]);

    this.uiManager.showScreen(GameState.PLAYING);
  }

  public startEndlessMode(): void {
    this.currentMode = GameMode.ENDLESS;
    this.isPaused = false;
    this.coinsInCurrentRun = 0;
    this.gemsInCurrentRun = 0;
    this.scoreInCurrentRun = 0;
    this.isHandlingDeath = false;

    this.levelManager.clear();
    this.enemyManager.clear();
    this.endlessManager.start();

    this.cameraManager.setBounds(-10, 999999, -6, 25);
    this.hero.respawn(0, 1.5);
    this.cameraManager.snapTo(this.hero.position);

    this.audioManager.playMusic('ENDLESS');
    this.uiManager.showScreen(GameState.PLAYING);
  }

  private startRenderLoop(): void {
    let lastTime = performance.now();

    this.engine.runRenderLoop(() => {
      const now = performance.now();
      const rawDelta = (now - lastTime) / 1000;
      lastTime = now;

      // Clamp deltaTime to prevent physics tunneling
      const deltaTime = Math.min(rawDelta, 0.05);

      if (!this.isPaused) {
        this.update(deltaTime);
      }

      this.scene.render();
    });
  }

  private update(deltaTime: number): void {
    // Check if on gameplay screen
    const isPlaying = document.getElementById('game-hud')?.classList.contains('hidden') === false;
    if (!isPlaying) return;

    // 1. Player Input
    this.hero.handleInput(
      this.uiManager.inputMoveX,
      this.uiManager.inputJumpPressed,
      this.uiManager.inputJumpHeld,
      this.uiManager.inputAttackPressed,
      this.uiManager.inputDashPressed,
      deltaTime
    );

    // Reset single-frame triggers
    this.uiManager.inputJumpPressed = false;
    this.uiManager.inputAttackPressed = false;
    this.uiManager.inputDashPressed = false;

    // 2. Physics & Collisions
    if (this.currentMode === GameMode.CAMPAIGN) {
      this.hero.updatePhysicsAndCollisions(deltaTime, this.levelManager.platforms);

      // Level Manager update (collectibles, breakables, hazards, portal)
      this.levelManager.update(
        this.hero,
        deltaTime,
        () => {
          this.coinsInCurrentRun++;
          this.scoreInCurrentRun += 100;
          this.saveManager.addCurrency(1, 0);
        },
        () => {
          this.gemsInCurrentRun++;
          this.scoreInCurrentRun += 500;
          this.saveManager.addCurrency(0, 1);
        },
        () => {
          // Guard 1: only ever complete a level once (the portal-distance
          // check re-fires every frame the hero stands near it).
          // Guard 2: on boss levels, the portal is not a valid win
          // condition while the boss is still alive — otherwise a player
          // could just run past the boss straight to the portal and skip
          // the fight entirely.
          if (this.levelCompleted) return;
          if (this.levelManager.currentConfig?.hasBoss && this.enemyManager.activeBoss?.isAlive) return;
          this.levelCompleted = true;
          this.handleLevelGoalReached();
        }
      );
    } else {
      // Endless Mode
      const endlessPlatforms = this.endlessManager.getAllPlatforms();
      this.hero.updatePhysicsAndCollisions(deltaTime, endlessPlatforms, -6);

      this.endlessManager.update(this.hero, deltaTime, () => {
        this.coinsInCurrentRun++;
        this.saveManager.addCurrency(1, 0);
      });
    }

    // 3. Enemy Manager Update
    this.enemyManager.update(
      this.hero,
      deltaTime,
      (cx, cy) => {
        if (this.currentMode === GameMode.CAMPAIGN) {
          this.levelManager.spawnTemporaryCoin(cx, cy);
        }
      },
      (gx, gy) => {
        if (this.currentMode === GameMode.CAMPAIGN) {
          this.levelManager.spawnTemporaryGem(gx, gy);
        }
      }
    );

    // 4. Boss Victory Check
    if (this.currentMode === GameMode.CAMPAIGN && this.levelManager.currentConfig?.hasBoss && !this.levelCompleted) {
      if (this.enemyManager.activeBoss && !this.enemyManager.activeBoss.isAlive) {
        // Boss defeated! Delay slightly for explosion fanfare, then complete level!
        this.levelCompleted = true;
        this.enemyManager.activeBoss = null;
        setTimeout(() => {
          this.handleLevelGoalReached();
        }, 1200);
      }
    }

    // 5. Hero Death Check
    if (this.hero.health <= 0 && !this.isHandlingDeath) {
      this.isHandlingDeath = true;
      if (this.currentMode === GameMode.CAMPAIGN) {
        if (this.levelManager.activeCheckpointIndex >= 0) {
          // A checkpoint was reached this attempt: respawn there instead of
          // ending the run. Coins/gems/score already earned are kept (we
          // never reload the level), and enemies still alive are snapped
          // back to their spawn state so the challenge isn't skipped —
          // already-defeated enemies stay defeated, so this can't be used
          // to farm the same coin/gem drop repeatedly.
          const respawnPoint = this.levelManager.getRespawnPoint();
          setTimeout(() => {
            this.hero.respawn(respawnPoint.x, respawnPoint.y);
            this.enemyManager.repositionAliveEnemies();
            this.cameraManager.snapTo(this.hero.position);
            this.isHandlingDeath = false;
          }, 800);
        } else {
          setTimeout(() => {
            this.uiManager.showGameOver(this.scoreInCurrentRun, this.coinsInCurrentRun);
          }, 800);
        }
      } else {
        // Endless run ended
        const isNewRecord = this.saveManager.recordEndlessRun(this.endlessManager.distanceTraveled, this.endlessManager.score);
        setTimeout(() => {
          this.uiManager.showEndlessResults(
            this.endlessManager.distanceTraveled,
            this.endlessManager.score,
            this.coinsInCurrentRun,
            isNewRecord
          );
        }, 800);
      }
      return;
    }

    // 6. Camera Follow
    this.cameraManager.update(this.hero.position, this.hero.velocity.x, deltaTime);

    // Move scenic background with camera for smooth parallax
    this.backgroundMesh.position.x = this.cameraManager.getPosition().x * 0.95;
    this.backgroundMesh.position.y = this.cameraManager.getPosition().y * 0.95 + 6;

    // Ambient particle emitter track camera
    this.particleManager.updateAmbientEmitter(this.cameraManager.getPosition());

    // 7. Update HUD
    const activeBoss = this.enemyManager.activeBoss;
    const bossRatio = activeBoss && activeBoss.isAlive ? activeBoss.health / activeBoss.maxHealth : null;

    const levelTitle = this.currentMode === GameMode.CAMPAIGN
      ? `LVL 0${this.currentLevelIndex + 1}`
      : `${this.endlessManager.distanceTraveled}m`;

    const totalScore = this.currentMode === GameMode.CAMPAIGN ? this.scoreInCurrentRun : this.endlessManager.score;

    this.uiManager.updateHUD(
      this.hero.health,
      this.hero.maxHealth,
      totalScore,
      this.saveManager.getData().coins,
      this.saveManager.getData().gems,
      levelTitle,
      this.hero.activePowerUp,
      this.hero.powerUpTimer,
      bossRatio,
      activeBoss?.config.bossName ?? null
    );
  }

  private handleLevelGoalReached(): void {
    this.audioManager.playLevelComplete();
    this.hero.triggerVictory();
    this.particleManager.burstCollect(this.hero.position, true);

    const completionTime = (Date.now() - this.levelStartTime) / 1000;
    const levelNum = this.currentLevelIndex + 1;

    // Stars calculation: 1 for clearing, 2 for fast time, 3 for keeping full health
    let stars = 1;
    if (completionTime < 45) stars++;
    if (this.hero.health >= 3) stars++;

    this.saveManager.unlockNextLevel(levelNum, stars, completionTime);

    // Check if Map cleared (Levels 8, 16, 24, 32)
    if (levelNum % 8 === 0) {
      this.saveManager.addCurrency(100, 5); // Grand reward
      setTimeout(() => {
        this.uiManager.showMapComplete(Math.floor(levelNum / 8));
      }, 700);
    } else {
      setTimeout(() => {
        this.uiManager.showLevelComplete(levelNum, stars, completionTime, this.coinsInCurrentRun, this.gemsInCurrentRun);
      }, 700);
    }
  }
}
