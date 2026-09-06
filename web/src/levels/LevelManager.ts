import * as BABYLON from 'babylonjs';
import { LevelConfig, PlatformConfig, HazardConfig, BreakableConfig, CollectibleConfig, PowerUpConfig, CheckpointConfig, PowerUpType, MapTheme } from '../types/game';
import { GameConfig } from '../config/GameConfig';
import { AudioManager } from '../audio/AudioManager';
import { ParticleManager } from '../effects/ParticleManager';
import { SuperLineHero } from '../player/SuperLineHero';

export class LevelManager {
  private scene: BABYLON.Scene;
  private audio: AudioManager;
  private particles: ParticleManager;

  public currentConfig: LevelConfig | null = null;
  public platforms: PlatformConfig[] = [];
  public activeCheckpointIndex: number = -1;

  // Meshes
  private levelMeshes: BABYLON.Mesh[] = [];
  private collectibleItems: { mesh: BABYLON.Mesh; config: CollectibleConfig; collected: boolean }[] = [];
  private powerupItems: { mesh: BABYLON.Mesh; config: PowerUpConfig; collected: boolean }[] = [];
  private breakableItems: { mesh: BABYLON.Mesh; config: BreakableConfig; broken: boolean }[] = [];
  private checkpointMeshes: { mesh: BABYLON.Mesh; config: CheckpointConfig; triggered: boolean }[] = [];
  private goalPortalMesh: BABYLON.Mesh | null = null;
  private hazardEntries: { config: HazardConfig; mesh: BABYLON.Mesh }[] = [];
  private movingPlatforms: { config: PlatformConfig; mesh: BABYLON.Mesh; baseX: number; baseY: number }[] = [];

  // Materials
  private platformTopMat: BABYLON.StandardMaterial;
  private platformBottomMat: BABYLON.StandardMaterial;
  private hazardMat: BABYLON.StandardMaterial;
  private lavaMat: BABYLON.StandardMaterial;
  private laserMat: BABYLON.StandardMaterial;
  private coinMat: BABYLON.StandardMaterial;
  private gemMat: BABYLON.StandardMaterial;
  private powerupMat: BABYLON.StandardMaterial;
  private breakableMat: BABYLON.StandardMaterial;
  private portalMat: BABYLON.StandardMaterial;

  constructor(scene: BABYLON.Scene, audio: AudioManager, particles: ParticleManager) {
    this.scene = scene;
    this.audio = audio;
    this.particles = particles;

    this.platformTopMat = new BABYLON.StandardMaterial('pTopMat', scene);
    this.platformBottomMat = new BABYLON.StandardMaterial('pBotMat', scene);
    this.hazardMat = new BABYLON.StandardMaterial('hazMat', scene);
    this.lavaMat = new BABYLON.StandardMaterial('lavaMat', scene);
    this.laserMat = new BABYLON.StandardMaterial('laserMat', scene);
    this.coinMat = new BABYLON.StandardMaterial('coinMat', scene);
    this.gemMat = new BABYLON.StandardMaterial('gemMat', scene);
    this.powerupMat = new BABYLON.StandardMaterial('puMat', scene);
    this.breakableMat = new BABYLON.StandardMaterial('breakMat', scene);
    this.portalMat = new BABYLON.StandardMaterial('portalMat', scene);

    this.coinMat.diffuseColor = BABYLON.Color3.FromHexString('#ffd600');
    this.coinMat.emissiveColor = BABYLON.Color3.FromHexString('#ffd600').scale(0.8);

    this.gemMat.diffuseColor = BABYLON.Color3.FromHexString('#d500f9');
    this.gemMat.emissiveColor = BABYLON.Color3.FromHexString('#d500f9').scale(0.9);

    this.hazardMat.diffuseColor = BABYLON.Color3.FromHexString('#ff1744');
    this.hazardMat.emissiveColor = BABYLON.Color3.FromHexString('#ff1744').scale(0.8);

    // LAVA reads as a hot orange glow, visually distinct from spike red.
    this.lavaMat.diffuseColor = BABYLON.Color3.FromHexString('#ff6d00');
    this.lavaMat.emissiveColor = BABYLON.Color3.FromHexString('#ff9100').scale(0.9);

    // LASER reads as a bright magenta energy beam, distinct from both.
    this.laserMat.diffuseColor = BABYLON.Color3.FromHexString('#d500f9');
    this.laserMat.emissiveColor = BABYLON.Color3.FromHexString('#ea00ff').scale(1.0);

    this.powerupMat.diffuseColor = BABYLON.Color3.FromHexString('#00e5ff');
    this.powerupMat.emissiveColor = BABYLON.Color3.FromHexString('#00e5ff').scale(0.9);

    this.breakableMat.diffuseColor = BABYLON.Color3.FromHexString('#4fc3f7');
    this.breakableMat.emissiveColor = BABYLON.Color3.FromHexString('#0288d1').scale(0.4);

    this.portalMat.diffuseColor = BABYLON.Color3.FromHexString('#00e5ff');
    this.portalMat.emissiveColor = BABYLON.Color3.FromHexString('#00e5ff');
  }

  public loadLevel(config: LevelConfig): void {
    this.clear();
    this.currentConfig = config;
    this.platforms = config.platforms.map(p => ({ ...p })); // per-object clone so runtime mutation (moving platforms) never touches the original imported level data
    this.activeCheckpointIndex = -1;

    const themeColors = GameConfig.WORLD_THEMES[config.theme] || GameConfig.WORLD_THEMES[MapTheme.SKYLINE_MEADOWS];
    this.platformTopMat.diffuseColor = BABYLON.Color3.FromHexString(themeColors.platformColor);
    this.platformTopMat.emissiveColor = BABYLON.Color3.FromHexString(themeColors.platformColor).scale(0.3);

    this.platformBottomMat.diffuseColor = BABYLON.Color3.FromHexString(themeColors.platformUndersideColor);

    // 1. Build Platforms
    config.platforms.forEach((_p, idx) => {
      const p = this.platforms[idx]; // use the cloned, mutable copy so moving platforms animate this instance only
      const mesh = BABYLON.MeshBuilder.CreateBox(`plat_${idx}`, {
        width: p.width,
        height: p.height,
        depth: 2.5
      }, this.scene);
      mesh.position.set(p.x, p.y, 0);
      mesh.material = p.isOneWay ? this.powerupMat : this.platformTopMat;
      if (p.isOneWay) mesh.visibility = 0.65;
      this.levelMeshes.push(mesh);

      if (p.moveRangeX || p.moveRangeY) {
        this.movingPlatforms.push({ config: p, mesh, baseX: p.x, baseY: p.y });
      }
    });

    // 2. Build Hazards
    config.hazards.forEach((h, idx) => {
      const mesh = BABYLON.MeshBuilder.CreateBox(`haz_${idx}`, {
        width: h.width,
        height: h.height,
        depth: 2.0
      }, this.scene);
      mesh.position.set(h.x, h.y, 0);
      mesh.material = h.type === 'LAVA' ? this.lavaMat : h.type === 'LASER' ? this.laserMat : this.hazardMat;
      this.levelMeshes.push(mesh);
      this.hazardEntries.push({ config: h, mesh });
    });

    // 3. Build Breakable Blocks
    config.breakables.forEach((b, idx) => {
      const mesh = BABYLON.MeshBuilder.CreateBox(`break_${idx}`, {
        width: b.width,
        height: b.height,
        depth: 1.5
      }, this.scene);
      mesh.position.set(b.x, b.y, 0);
      mesh.material = this.breakableMat;
      this.levelMeshes.push(mesh);
      this.breakableItems.push({ mesh, config: b, broken: false });

      // Add to platforms list so hero can stand on it until broken!
      this.platforms.push({ x: b.x, y: b.y, width: b.width, height: b.height });
    });

    // 4. Build Coins
    config.coins.forEach((c, idx) => {
      const mesh = BABYLON.MeshBuilder.CreateCylinder(`coin_${idx}`, {
        diameter: 0.65,
        height: 0.14,
        tessellation: 16
      }, this.scene);
      mesh.position.set(c.x, c.y, 0);
      mesh.rotation.x = Math.PI / 2;
      mesh.material = this.coinMat;
      this.levelMeshes.push(mesh);
      this.collectibleItems.push({ mesh, config: c, collected: false });
    });

    // 5. Build Gems
    config.gems.forEach((g, idx) => {
      const mesh = BABYLON.MeshBuilder.CreatePolyhedron(`gem_${idx}`, {
        type: 1, // Octahedron diamond
        size: 0.45
      }, this.scene);
      mesh.position.set(g.x, g.y, 0);
      mesh.material = this.gemMat;
      this.levelMeshes.push(mesh);
      this.collectibleItems.push({ mesh, config: g, collected: false });
    });

    // 6. Build Powerups
    config.powerups.forEach((pu, idx) => {
      const mesh = BABYLON.MeshBuilder.CreateSphere(`powerup_${idx}`, {
        diameter: 0.85,
        segments: 16
      }, this.scene);
      mesh.position.set(pu.x, pu.y, 0);
      mesh.material = this.powerupMat;
      this.levelMeshes.push(mesh);
      this.powerupItems.push({ mesh, config: pu, collected: false });
    });

    // 7. Checkpoints
    config.checkpoints.forEach((cp, idx) => {
      const pole = BABYLON.MeshBuilder.CreateCylinder(`cpPole_${idx}`, {
        diameter: 0.12,
        height: 2.2
      }, this.scene);
      pole.position.set(cp.x, cp.y, 0);
      pole.material = this.platformTopMat;

      const flag = BABYLON.MeshBuilder.CreateBox(`cpFlag_${idx}`, {
        width: 0.8,
        height: 0.5,
        depth: 0.05
      }, this.scene);
      flag.position.set(cp.x + 0.4, cp.y + 0.7, 0);
      flag.material = this.hazardMat; // Turns cyan when triggered

      this.levelMeshes.push(pole, flag);
      this.checkpointMeshes.push({ mesh: flag, config: cp, triggered: false });
    });

    // 8. Goal Portal
    this.goalPortalMesh = BABYLON.MeshBuilder.CreateTorus('goalPortal', {
      diameter: 2.4,
      thickness: 0.35,
      tessellation: 32
    }, this.scene);
    this.goalPortalMesh.position.set(config.goalX, config.goalY, 0);
    this.goalPortalMesh.material = this.portalMat;
    this.levelMeshes.push(this.goalPortalMesh);
  }

  public update(hero: SuperLineHero, deltaTime: number, onCoinCollect: () => void, onGemCollect: () => void, onGoalReached: () => void): void {
    if (!this.currentConfig) return;

    // 0. Animate moving platforms (mesh + collision data together, so the
    // hero never collides against a stale position). Runs first so the
    // hero's collision pass this frame (called by GameManager right before
    // this) picks up last frame's move — one-frame lag, imperceptible.
    for (const mp of this.movingPlatforms) {
      const speed = mp.config.moveSpeed || 1;
      const t = Date.now() * 0.002 * speed;
      if (mp.config.moveRangeX) mp.config.x = mp.baseX + Math.sin(t) * mp.config.moveRangeX;
      if (mp.config.moveRangeY) mp.config.y = mp.baseY + Math.sin(t) * mp.config.moveRangeY;
      mp.mesh.position.x = mp.config.x;
      mp.mesh.position.y = mp.config.y;
    }

    // 1. Animate Collectibles & Powerups
    for (const item of this.collectibleItems) {
      if (item.collected) continue;
      item.mesh.rotation.y += deltaTime * 3.5;
      item.mesh.position.y = item.config.y + Math.sin(Date.now() * 0.005) * 0.12;

      // Magnet check (if hero has Coin Magnet powerup)
      if (hero.activePowerUp === PowerUpType.COIN_MAGNET && item.config.type === 'COIN') {
        const distToHero = BABYLON.Vector3.Distance(item.mesh.position, hero.position);
        if (distToHero < 6.5) {
          const pullDir = hero.position.subtract(item.mesh.position).normalize();
          item.mesh.position.addInPlace(pullDir.scale(deltaTime * 10.0));
        }
      }

      // Collect check
      const d = BABYLON.Vector3.Distance(hero.position, item.mesh.position);
      if (d < 1.1) {
        item.collected = true;
        item.mesh.setEnabled(false);
        if (item.config.type === 'COIN') {
          this.audio.playCoin();
          this.particles.burstCollect(item.mesh.position, false);
          onCoinCollect();
        } else {
          this.audio.playGem();
          this.particles.burstCollect(item.mesh.position, true);
          onGemCollect();
        }
      }
    }

    // 2. Animate Powerups
    for (const pu of this.powerupItems) {
      if (pu.collected) continue;
      pu.mesh.rotation.y += deltaTime * 2.5;
      pu.mesh.scaling.set(1.0 + Math.sin(Date.now() * 0.006) * 0.15, 1.0 + Math.sin(Date.now() * 0.006) * 0.15, 1.0);

      const d = BABYLON.Vector3.Distance(hero.position, pu.mesh.position);
      if (d < 1.3) {
        pu.collected = true;
        pu.mesh.setEnabled(false);
        hero.applyPowerUp(pu.config.type);
      }
    }

    // 3. Breakable Blocks Check (Player Slash or Mega Line Stomp)
    for (const b of this.breakableItems) {
      if (b.broken) continue;
      const d = BABYLON.Vector3.Distance(hero.position, b.mesh.position);
      if ((hero.isAttacking && d < 2.0) || (hero.activePowerUp === PowerUpType.MEGA_LINE && d < 1.4)) {
        b.broken = true;
        b.mesh.setEnabled(false);
        this.audio.playEnemyDefeat();
        this.particles.burstExplosion(b.mesh.position, '#4fc3f7');

        // Remove from platform collision list
        const pIdx = this.platforms.findIndex(p => p.x === b.config.x && p.y === b.config.y);
        if (pIdx >= 0) this.platforms.splice(pIdx, 1);

        // Spawn reward
        if (b.config.rewardType === 'COIN') {
          this.spawnTemporaryCoin(b.config.x, b.config.y + 0.5);
        } else if (b.config.rewardType === 'GEM') {
          this.spawnTemporaryGem(b.config.x, b.config.y + 0.5);
        } else if (b.config.rewardType) {
          hero.applyPowerUp(b.config.rewardType as PowerUpType);
        }
      }
    }

    // 4. Hazards Check (LASER hazards with a laserInterval pulse on/off;
    // SPIKES and LAVA, and LASER hazards without an interval, stay always-on)
    for (const entry of this.hazardEntries) {
      const h = entry.config;
      let isActive = true;

      if (h.type === 'LASER' && h.laserInterval) {
        const cyclePos = (Date.now() * 0.001) % h.laserInterval;
        isActive = cyclePos < h.laserInterval * 0.5;
        entry.mesh.setEnabled(isActive);
      }

      if (!isActive) continue;

      const hLeft = h.x - h.width / 2;
      const hRight = h.x + h.width / 2;
      const hTop = h.y + h.height / 2;
      const hBottom = h.y - h.height / 2;

      if (hero.position.x > hLeft && hero.position.x < hRight && hero.position.y > hBottom && hero.position.y < hTop + 0.4) {
        hero.takeDamage(1, 0);
      }
    }

    // 5. Checkpoints
    this.checkpointMeshes.forEach((cp, idx) => {
      if (!cp.triggered) {
        const d = Math.abs(hero.position.x - cp.config.x);
        if (d < 1.2 && Math.abs(hero.position.y - cp.config.y) < 2.0) {
          cp.triggered = true;
          this.activeCheckpointIndex = idx;
          cp.mesh.material = this.powerupMat; // Glow cyan
          this.audio.playCheckpoint();
          this.particles.burstCollect(cp.mesh.position, false);
        }
      }
    });

    // 6. Goal Portal Check
    if (this.goalPortalMesh) {
      this.goalPortalMesh.rotation.z += deltaTime * 2.5;
      const distToGoal = BABYLON.Vector3.Distance(hero.position, this.goalPortalMesh.position);
      if (distToGoal < 1.8) {
        onGoalReached();
      }
    }
  }

  public spawnTemporaryCoin(x: number, y: number): void {
    const mesh = BABYLON.MeshBuilder.CreateCylinder(`tempCoin_${Date.now()}`, { diameter: 0.65, height: 0.14 }, this.scene);
    mesh.position.set(x, y, 0);
    mesh.rotation.x = Math.PI / 2;
    mesh.material = this.coinMat;
    this.levelMeshes.push(mesh);
    this.collectibleItems.push({ mesh, config: { x, y, type: 'COIN' }, collected: false });
  }

  public spawnTemporaryGem(x: number, y: number): void {
    const mesh = BABYLON.MeshBuilder.CreatePolyhedron(`tempGem_${Date.now()}`, { type: 1, size: 0.45 }, this.scene);
    mesh.position.set(x, y, 0);
    mesh.material = this.gemMat;
    this.levelMeshes.push(mesh);
    this.collectibleItems.push({ mesh, config: { x, y, type: 'GEM' }, collected: false });
  }

  public getRespawnPoint(): { x: number; y: number } {
    if (this.activeCheckpointIndex >= 0 && this.checkpointMeshes[this.activeCheckpointIndex]) {
      const cp = this.checkpointMeshes[this.activeCheckpointIndex].config;
      return { x: cp.x, y: cp.y };
    }
    return {
      x: this.currentConfig ? this.currentConfig.playerStartX : 0,
      y: this.currentConfig ? this.currentConfig.playerStartY : 1.5
    };
  }

  public clear(): void {
    for (const m of this.levelMeshes) {
      m.dispose();
    }
    this.levelMeshes = [];
    this.collectibleItems = [];
    this.powerupItems = [];
    this.breakableItems = [];
    this.checkpointMeshes = [];
    this.platforms = [];
    this.movingPlatforms = [];
    this.hazardEntries = [];
    this.goalPortalMesh = null;
    this.currentConfig = null;
    this.activeCheckpointIndex = -1;
  }
}
