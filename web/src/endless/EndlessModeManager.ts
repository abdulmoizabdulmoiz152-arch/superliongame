import * as BABYLON from 'babylonjs';
import { PlatformConfig, HazardConfig, CollectibleConfig, PowerUpType, EnemyType, MapTheme } from '../types/game';
import { SuperLineHero } from '../player/SuperLineHero';
import { EnemyManager } from '../enemies/EnemyManager';
import { AudioManager } from '../audio/AudioManager';
import { ParticleManager } from '../effects/ParticleManager';
import { GameConfig } from '../config/GameConfig';

// ---------------------------------------------------------------------------
// Reachability validation (Part 11): every gap the generator proposes is
// checked against the hero's REAL physics constants from GameConfig, not
// just a hand-picked constant that was never actually verified. A gap is
// only used if it is physically clearable; otherwise the generator falls
// back to a safe distance instead of placing it.
//
// This is a deliberately conservative model, not a frame-perfect physics
// simulation: it computes the horizontal distance covered by holding max
// run speed for the full airtime of a projectile-motion jump arc, then
// applies a safety margin so generated content stays comfortably within
// what a real player can execute, not right at the theoretical limit.
// ---------------------------------------------------------------------------
const GRAVITY = Math.abs(GameConfig.PHYSICS.GRAVITY);
const MOVE_SPEED = GameConfig.PHYSICS.MOVE_SPEED;
const SINGLE_JUMP_FORCE = GameConfig.PHYSICS.JUMP_FORCE;
const DOUBLE_JUMP_FORCE = GameConfig.PHYSICS.DOUBLE_JUMP_FORCE;
const REACH_SAFETY_MARGIN = 0.78; // use only 78% of the theoretical max reach

/** Horizontal distance reachable with a single jump, landing at height `dy`
 * relative to the takeoff point (dy > 0 = jumping up, dy < 0 = jumping down
 * onto a lower platform). Returns null if `dy` itself is too high to reach
 * with a single jump at all. */
function maxSingleJumpReach(dy: number): number | null {
  const disc = SINGLE_JUMP_FORCE * SINGLE_JUMP_FORCE - 2 * GRAVITY * dy;
  if (disc < 0) return null;
  const airTime = (SINGLE_JUMP_FORCE + Math.sqrt(disc)) / GRAVITY;
  return MOVE_SPEED * airTime * REACH_SAFETY_MARGIN;
}

/** Horizontal distance reachable using the double jump. Modeled as a
 * combined force budget rather than simulating the exact frame the second
 * jump fires — the 0.7 factor reflects that the second jump is rarely
 * thrown in at the mathematically optimal moment, so this stays a
 * conservative (i.e. safe, not generous) estimate. */
function maxDoubleJumpReach(dy: number): number | null {
  const combinedForce = SINGLE_JUMP_FORCE + DOUBLE_JUMP_FORCE * 0.7;
  const disc = combinedForce * combinedForce - 2 * GRAVITY * dy;
  if (disc < 0) return null;
  const airTime = (combinedForce + Math.sqrt(disc)) / GRAVITY;
  return MOVE_SPEED * airTime * REACH_SAFETY_MARGIN;
}

/** Clamps a desired gap down to whatever is actually reachable for the
 * given height delta, preferring a single jump and falling back to the
 * double jump's larger (but still safety-margined) reach. Never returns
 * more than `desiredGap`, and never less than a small guaranteed-clearable
 * floor so chunks don't collapse into zero-width gaps. */
function clampGapToReachable(desiredGap: number, dy: number): number {
  const singleReach = maxSingleJumpReach(dy);
  const doubleReach = maxDoubleJumpReach(dy);
  const maxReach = Math.max(singleReach ?? 0, doubleReach ?? 0);
  if (maxReach <= 0) {
    // dy itself is too high for any jump — this should never happen given
    // how chunk types bound their own dy, but fail safe rather than place
    // an impossible gap.
    return Math.min(desiredGap, 1.5);
  }
  return Math.max(1.2, Math.min(desiredGap, maxReach));
}

interface EndlessChunk {
  startX: number;
  endX: number;
  platforms: PlatformConfig[];
  hazards: HazardConfig[];
  coins: CollectibleConfig[];
  meshes: BABYLON.Mesh[];
}

export class EndlessModeManager {
  private scene: BABYLON.Scene;
  private audio: AudioManager;
  private particles: ParticleManager;
  private enemyManager: EnemyManager;

  public active: boolean = false;
  public distanceTraveled: number = 0;
  public score: number = 0;
  public coinsCollected: number = 0;
  public enemiesDefeated: number = 0;

  private currentTheme: MapTheme = MapTheme.SKYLINE_MEADOWS;
  private nextGenerateX: number = 0;
  private lastChunkY: number = 0;
  private chunks: EndlessChunk[] = [];
  // Mirrors the same fix applied to campaign levels' LevelManager: without
  // this, a moving platform's mesh and collision box never actually moved,
  // so standing on one would slide the hero off into empty space.
  private movingPlatforms: { config: PlatformConfig; mesh: BABYLON.Mesh; baseX: number }[] = [];

  // Reusable Materials
  private platformMat: BABYLON.StandardMaterial;
  private hazardMat: BABYLON.StandardMaterial;
  private coinMat: BABYLON.StandardMaterial;

  constructor(scene: BABYLON.Scene, audio: AudioManager, particles: ParticleManager, enemyManager: EnemyManager) {
    this.scene = scene;
    this.audio = audio;
    this.particles = particles;
    this.enemyManager = enemyManager;

    this.platformMat = new BABYLON.StandardMaterial('endlessPlatMat', scene);
    this.platformMat.diffuseColor = BABYLON.Color3.FromHexString('#00e5ff');
    this.platformMat.emissiveColor = BABYLON.Color3.FromHexString('#00e5ff').scale(0.3);

    this.hazardMat = new BABYLON.StandardMaterial('endlessHazMat', scene);
    this.hazardMat.diffuseColor = BABYLON.Color3.FromHexString('#ff1744');

    this.coinMat = new BABYLON.StandardMaterial('endlessCoinMat', scene);
    this.coinMat.diffuseColor = BABYLON.Color3.FromHexString('#ffd600');
    this.coinMat.emissiveColor = BABYLON.Color3.FromHexString('#ffd600').scale(0.8);
  }

  public start(): void {
    this.clear();
    this.active = true;
    this.distanceTraveled = 0;
    this.score = 0;
    this.coinsCollected = 0;
    this.enemiesDefeated = 0;
    this.currentTheme = MapTheme.SKYLINE_MEADOWS;
    this.lastChunkY = 0;
    this.nextGenerateX = -5;

    // Spawn starting flat runway
    this.spawnStartRunway();

    // Pre-generate several chunks ahead
    for (let i = 0; i < 4; i++) {
      this.generateNextChunk();
    }
  }

  private spawnStartRunway(): void {
    const meshes: BABYLON.Mesh[] = [];
    const pConfig: PlatformConfig = { x: 5, y: 0, width: 22, height: 2 };
    const pMesh = BABYLON.MeshBuilder.CreateBox('startRunway', { width: 22, height: 2, depth: 2.5 }, this.scene);
    pMesh.position.set(5, 0, 0);
    pMesh.material = this.platformMat;
    meshes.push(pMesh);

    this.chunks.push({
      startX: -5,
      endX: 16,
      platforms: [pConfig],
      hazards: [],
      coins: [],
      meshes
    });

    this.nextGenerateX = 16;
    this.lastChunkY = 0;
  }

  public update(hero: SuperLineHero, deltaTime: number, onCoinCollect: () => void): void {
    if (!this.active) return;

    // Update distance & score
    const currentDist = Math.max(0, Math.floor(hero.position.x));
    if (currentDist > this.distanceTraveled) {
      const deltaDist = currentDist - this.distanceTraveled;
      this.distanceTraveled = currentDist;
      this.score += deltaDist * 10;
    }

    // Dynamic Theme cycling every 250m
    const themeIdx = Math.floor(this.distanceTraveled / 250) % 4;
    const themes = [MapTheme.SKYLINE_MEADOWS, MapTheme.CRYSTAL_CAVES, MapTheme.CYBER_SKY_CITY, MapTheme.VOLCANIC_SHADOW_REALM];
    if (themes[themeIdx] !== this.currentTheme) {
      this.currentTheme = themes[themeIdx];
      this.particles.setWorldThemeAmbient(this.currentTheme, hero.position);
    }

    // Generate new chunks ahead
    if (hero.position.x + 35 > this.nextGenerateX) {
      this.generateNextChunk();
    }

    // Animate moving platforms (mesh + collision data together, same fix
    // applied to campaign levels' LevelManager).
    for (const mp of this.movingPlatforms) {
      const speed = mp.config.moveSpeed || 1;
      const t = Date.now() * 0.002 * speed;
      if (mp.config.moveRangeX) {
        mp.config.x = mp.baseX + Math.sin(t) * mp.config.moveRangeX;
        mp.mesh.position.x = mp.config.x;
      }
    }

    // Recycle old chunks behind hero (beyond 25 units)
    for (let i = this.chunks.length - 1; i >= 0; i--) {
      const chunk = this.chunks[i];
      if (chunk.endX < hero.position.x - 25) {
        chunk.meshes.forEach(m => m.dispose());
        this.movingPlatforms = this.movingPlatforms.filter(mp => !chunk.meshes.includes(mp.mesh));
        this.chunks.splice(i, 1);
      }
    }

    // Check coin collection within active chunks
    for (const chunk of this.chunks) {
      for (let i = chunk.coins.length - 1; i >= 0; i--) {
        const c = chunk.coins[i];
        const dist = Math.sqrt(Math.pow(hero.position.x - c.x, 2) + Math.pow(hero.position.y - c.y, 2));
        if (dist < 1.1) {
          chunk.coins.splice(i, 1);
          this.coinsCollected++;
          this.score += 50;
          this.audio.playCoin();
          this.particles.burstCollect(new BABYLON.Vector3(c.x, c.y, 0), false);
          onCoinCollect();
        }
      }
    }

    // Check hazards
    for (const chunk of this.chunks) {
      for (const h of chunk.hazards) {
        if (hero.position.x > h.x - h.width / 2 && hero.position.x < h.x + h.width / 2 &&
            hero.position.y > h.y - h.height / 2 && hero.position.y < h.y + h.height / 2 + 0.4) {
          hero.takeDamage(1, 0);
        }
      }
    }
  }

  /** 0 at the start of a run, ramping to 1 by ~1200m and staying there —
   * used to widen gap targets and increase hazard/enemy frequency over
   * time. Gaps are still always clamped to what's physically reachable
   * regardless of this value; difficulty controls how close to that safe
   * ceiling the generator aims, not whether the ceiling is respected. */
  private difficultyLevel(): number {
    return Math.min(1, this.distanceTraveled / 1200);
  }

  private generateNextChunk(): void {
    const chunkType = Math.floor(Math.random() * 5);
    const meshes: BABYLON.Mesh[] = [];
    const platforms: PlatformConfig[] = [];
    const hazards: HazardConfig[] = [];
    const coins: CollectibleConfig[] = [];
    const difficulty = this.difficultyLevel();

    // Entry gap connecting the end of the previous chunk to this one, at
    // the same height (dy = 0) — widened by difficulty, then clamped to
    // whatever is actually reachable.
    const desiredGap = 2.2 + difficulty * 2.6 + Math.random() * 1.5;
    const gap = clampGapToReachable(desiredGap, 0);
    const startX = this.nextGenerateX + gap;
    let endX = startX;

    const ASCENT_CEILING = 12.0;
    const DESCENT_FLOOR = -4.0;

    switch (chunkType) {
      case 0: {
        // Flat speedway with coins
        const len = 12 + Math.random() * 6;
        const p: PlatformConfig = { x: startX + len / 2, y: this.lastChunkY, width: len, height: 2 };
        platforms.push(p);

        for (let x = startX + 2; x < startX + len - 2; x += 2.2) {
          coins.push({ x, y: this.lastChunkY + 1.4, type: 'COIN' });
        }

        // More enemies as difficulty rises, never more than one per speedway
        if (Math.random() < 0.4 + difficulty * 0.35) {
          this.enemyManager.spawnEnemies([{
            x: startX + len / 2,
            y: this.lastChunkY + 1.5,
            type: EnemyType.SPIKY_ROLLER,
            patrolRange: len / 3
          }]);
        }

        endX = startX + len;
        break;
      }
      case 1: {
        // Ascending stepped platforms — only ascend if there's ceiling
        // room left; otherwise fall through to a flat step instead of
        // climbing indefinitely.
        const stepUp = Math.min(1.8, ASCENT_CEILING - this.lastChunkY);
        const dy1 = Math.max(0, stepUp * 0.55);
        const dy2 = Math.max(0, stepUp * 0.45);

        const p1Y = this.lastChunkY + dy1;
        const dx1 = clampGapToReachable(2.5 + difficulty * 1.5, dy1);
        const p2Y = p1Y + dy2;
        const dx2 = clampGapToReachable(2.5 + difficulty * 1.5, dy2);

        const p1: PlatformConfig = { x: startX + dx1, y: p1Y, width: 4.0, height: 0.8 };
        const p2: PlatformConfig = { x: startX + dx1 + dx2, y: p2Y, width: 4.0, height: 0.8 };
        platforms.push(p1, p2);

        coins.push({ x: p1.x, y: p1Y + 1.3, type: 'COIN' });
        coins.push({ x: p2.x, y: p2Y + 1.3, type: 'COIN' });

        this.lastChunkY = p2Y;
        endX = p2.x + 2.5;
        break;
      }
      case 2: {
        // Descending staircase, floor-clamped so it can't sink forever
        const p1Y = Math.max(DESCENT_FLOOR, this.lastChunkY - 1.2);
        const p2Y = Math.max(DESCENT_FLOOR, p1Y - 1.2);
        const dy1 = p1Y - this.lastChunkY;
        const dy2 = p2Y - p1Y;

        const dx1 = clampGapToReachable(2.5 + difficulty * 1.5, dy1);
        const dx2 = clampGapToReachable(2.5 + difficulty * 1.5, dy2);

        const p1: PlatformConfig = { x: startX + dx1, y: p1Y, width: 4.0, height: 0.8 };
        const p2: PlatformConfig = { x: startX + dx1 + dx2, y: p2Y, width: 4.0, height: 0.8 };
        platforms.push(p1, p2);

        coins.push({ x: p1.x, y: p1Y + 1.3, type: 'COIN' });
        coins.push({ x: p2.x, y: p2Y + 1.3, type: 'COIN' });

        this.lastChunkY = p2Y;
        endX = p2.x + 2.5;
        break;
      }
      case 3: {
        // Hazard pit with island in the middle
        const islandY = this.lastChunkY;
        const p: PlatformConfig = { x: startX + 3.5, y: islandY, width: 3.5, height: 0.8 };
        platforms.push(p);

        // Hazard below
        const h: HazardConfig = { x: startX + 3.5, y: islandY - 2.5, width: 7.0, height: 1.0, type: 'SPIKES' };
        hazards.push(h);

        coins.push({ x: startX + 3.5, y: islandY + 1.4, type: 'COIN' });
        coins.push({ x: startX + 3.5, y: islandY + 2.8, type: 'COIN' });

        endX = startX + 7.0;
        break;
      }
      case 4: {
        // Moving platform gap — speed scales gently with difficulty, but
        // the static approach/exit distances stay within the same
        // dy=0 reachability bound as every other chunk (well under the
        // ~7.4-unit safe single-jump reach at this height delta, so this
        // is already comfortably clearable even at max difficulty).
        const p: PlatformConfig = {
          x: startX + 3.5,
          y: this.lastChunkY,
          width: 3.6,
          height: 0.8,
          moveRangeX: 2.5,
          moveSpeed: 1.4 + difficulty * 0.8
        };
        platforms.push(p);
        coins.push({ x: startX + 3.5, y: this.lastChunkY + 1.5, type: 'COIN' });

        endX = startX + 7.5;
        break;
      }
    }

    // Instantiate 3D Meshes for platforms
    for (const p of platforms) {
      const mesh = BABYLON.MeshBuilder.CreateBox(`endlessP_${startX}`, { width: p.width, height: p.height, depth: 2.5 }, this.scene);
      mesh.position.set(p.x, p.y, 0);
      mesh.material = this.platformMat;
      meshes.push(mesh);
      if (p.moveRangeX) {
        this.movingPlatforms.push({ config: p, mesh, baseX: p.x });
      }
    }

    // Instantiate Meshes for hazards
    for (const h of hazards) {
      const mesh = BABYLON.MeshBuilder.CreateBox(`endlessH_${startX}`, { width: h.width, height: h.height, depth: 2.0 }, this.scene);
      mesh.position.set(h.x, h.y, 0);
      mesh.material = this.hazardMat;
      meshes.push(mesh);
    }

    // Instantiate Meshes for coins
    for (const c of coins) {
      const mesh = BABYLON.MeshBuilder.CreateCylinder(`endlessC_${startX}`, { diameter: 0.6, height: 0.12 }, this.scene);
      mesh.position.set(c.x, c.y, 0);
      mesh.rotation.x = Math.PI / 2;
      mesh.material = this.coinMat;
      meshes.push(mesh);
    }

    this.chunks.push({
      startX,
      endX,
      platforms,
      hazards,
      coins,
      meshes
    });

    this.nextGenerateX = endX;
  }

  public getAllPlatforms(): PlatformConfig[] {
    const all: PlatformConfig[] = [];
    for (const chunk of this.chunks) {
      all.push(...chunk.platforms);
    }
    return all;
  }

  public clear(): void {
    for (const chunk of this.chunks) {
      chunk.meshes.forEach(m => m.dispose());
    }
    this.chunks = [];
    this.movingPlatforms = [];
    this.active = false;
  }
}
