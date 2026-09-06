import * as BABYLON from 'babylonjs';
import { EnemyConfig, EnemyType, PowerUpType } from '../types/game';
import { SuperLineHero } from '../player/SuperLineHero';
import { AudioManager } from '../audio/AudioManager';
import { ParticleManager } from '../effects/ParticleManager';

export interface ActiveEnemy {
  config: EnemyConfig;
  mesh: BABYLON.Mesh;
  position: BABYLON.Vector3;
  velocity: BABYLON.Vector3;
  health: number;
  maxHealth: number;
  isAlive: boolean;
  startX: number;
  patrolDir: number;
  timer: number;
  phase: number;
  attackCooldown: number;
  isTelegraphing: boolean;
  type: EnemyType;
}

export interface BossAttackProjectile {
  mesh: BABYLON.Mesh;
  position: BABYLON.Vector3;
  velocity: BABYLON.Vector3;
  alive: boolean;
}

export class EnemyManager {
  private scene: BABYLON.Scene;
  private audio: AudioManager;
  private particles: ParticleManager;

  public enemies: ActiveEnemy[] = [];
  public projectiles: BossAttackProjectile[] = [];
  public activeBoss: ActiveEnemy | null = null;

  // Materials
  private enemyMatRed: BABYLON.StandardMaterial;
  private enemyMatCyan: BABYLON.StandardMaterial;
  private enemyMatPurple: BABYLON.StandardMaterial;
  private enemyMatOrange: BABYLON.StandardMaterial;
  private enemyMatBoss: BABYLON.StandardMaterial;

  constructor(scene: BABYLON.Scene, audio: AudioManager, particles: ParticleManager) {
    this.scene = scene;
    this.audio = audio;
    this.particles = particles;

    this.enemyMatRed = new BABYLON.StandardMaterial('enemyMatRed', scene);
    this.enemyMatRed.diffuseColor = BABYLON.Color3.FromHexString('#ff1744');
    this.enemyMatRed.emissiveColor = BABYLON.Color3.FromHexString('#ff1744').scale(0.5);

    this.enemyMatCyan = new BABYLON.StandardMaterial('enemyMatCyan', scene);
    this.enemyMatCyan.diffuseColor = BABYLON.Color3.FromHexString('#00e5ff');
    this.enemyMatCyan.emissiveColor = BABYLON.Color3.FromHexString('#00e5ff').scale(0.5);

    this.enemyMatPurple = new BABYLON.StandardMaterial('enemyMatPurple', scene);
    this.enemyMatPurple.diffuseColor = BABYLON.Color3.FromHexString('#d500f9');
    this.enemyMatPurple.emissiveColor = BABYLON.Color3.FromHexString('#d500f9').scale(0.5);

    this.enemyMatOrange = new BABYLON.StandardMaterial('enemyMatOrange', scene);
    this.enemyMatOrange.diffuseColor = BABYLON.Color3.FromHexString('#ff6d00');
    this.enemyMatOrange.emissiveColor = BABYLON.Color3.FromHexString('#ff6d00').scale(0.5);

    this.enemyMatBoss = new BABYLON.StandardMaterial('enemyMatBoss', scene);
    this.enemyMatBoss.diffuseColor = BABYLON.Color3.FromHexString('#311b92');
    this.enemyMatBoss.emissiveColor = BABYLON.Color3.FromHexString('#ff1744').scale(0.7);
  }

  public spawnEnemies(configs: EnemyConfig[]): void {
    this.clear();

    for (const cfg of configs) {
      const mesh = this.createProceduralEnemyMesh(cfg.type);
      mesh.position.set(cfg.x, cfg.y, 0);
      if (cfg.isBoss && cfg.type !== EnemyType.SHADOW_TITAN && cfg.type !== EnemyType.NEON_MECHA) {
        // Bosses read visually larger than their base enemy type, even when
        // reusing a regular enemy's mesh/behavior as its boss variant.
        mesh.scaling.scaleInPlace(1.9);
        mesh.material = this.enemyMatBoss;
      }

      let hp = 1;
      if (cfg.type === EnemyType.SHIELDED_GOLEM) hp = 2;
      if (cfg.type === EnemyType.NEON_MECHA) hp = 6;
      if (cfg.type === EnemyType.SHADOW_TITAN) hp = 14;
      // Explicit boss HP override always wins — lets any enemy type serve
      // as a level's boss with an appropriately scaled health pool.
      if (cfg.isBoss) hp = cfg.bossHp ?? Math.max(hp, 8);

      const enemy: ActiveEnemy = {
        config: cfg,
        mesh,
        position: new BABYLON.Vector3(cfg.x, cfg.y, 0),
        velocity: new BABYLON.Vector3(0, 0, 0),
        health: hp,
        maxHealth: hp,
        isAlive: true,
        startX: cfg.x,
        patrolDir: 1,
        timer: Math.random() * 3,
        phase: 1,
        attackCooldown: 1.5,
        isTelegraphing: false,
        type: cfg.type
      };

      // A level's boss is either explicitly flagged via isBoss, or (for
      // backward compatibility with older level data) one of the two
      // originally boss-only types.
      if (cfg.isBoss || cfg.type === EnemyType.SHADOW_TITAN || cfg.type === EnemyType.NEON_MECHA) {
        this.activeBoss = enemy;
      }

      this.enemies.push(enemy);
    }
  }

  private createProceduralEnemyMesh(type: EnemyType): BABYLON.Mesh {
    let mesh: BABYLON.Mesh;

    switch (type) {
      case EnemyType.SPIKY_ROLLER: {
        // Futuristic rolling gear/octahedron
        mesh = BABYLON.MeshBuilder.CreatePolyhedron('spikyRoller', { type: 1, size: 0.5 }, this.scene);
        mesh.material = this.enemyMatRed;
        break;
      }
      case EnemyType.AERO_DRONE: {
        // Floating diamond drone with glowing wings
        mesh = BABYLON.MeshBuilder.CreateCylinder('aeroDrone', { diameterTop: 0, diameterBottom: 0.8, height: 0.8, tessellation: 4 }, this.scene);
        mesh.rotation.x = Math.PI;
        mesh.material = this.enemyMatCyan;
        break;
      }
      case EnemyType.CHARGING_DASHER: {
        // Sleek wedge shaped runner
        mesh = BABYLON.MeshBuilder.CreateBox('chargingDasher', { width: 0.9, height: 0.6, depth: 0.5 }, this.scene);
        mesh.material = this.enemyMatOrange;
        break;
      }
      case EnemyType.PULSE_TURRET: {
        // High-tech static pedestal with plasma core
        mesh = BABYLON.MeshBuilder.CreateCylinder('pulseTurret', { diameter: 0.7, height: 0.9, tessellation: 6 }, this.scene);
        mesh.material = this.enemyMatPurple;
        break;
      }
      case EnemyType.SHIELDED_GOLEM: {
        // Heavy armored cuboid
        mesh = BABYLON.MeshBuilder.CreateBox('shieldedGolem', { width: 1.0, height: 1.2, depth: 0.6 }, this.scene);
        mesh.material = this.enemyMatPurple;
        break;
      }
      case EnemyType.CRYSTAL_STALKER: {
        // Spiky crystal cluster
        mesh = BABYLON.MeshBuilder.CreateTorus('crystalStalker', { diameter: 0.8, thickness: 0.25, tessellation: 8 }, this.scene);
        mesh.material = this.enemyMatCyan;
        break;
      }
      case EnemyType.NEON_MECHA: {
        // Mini-Boss mecha
        mesh = BABYLON.MeshBuilder.CreateBox('neonMecha', { width: 1.8, height: 2.0, depth: 1.0 }, this.scene);
        mesh.material = this.enemyMatOrange;
        break;
      }
      case EnemyType.SHADOW_TITAN: {
        // Final Boss: Colossal dark void core surrounded by glowing plasma spikes
        mesh = BABYLON.MeshBuilder.CreateSphere('shadowTitan', { diameter: 3.2, segments: 16 }, this.scene);
        mesh.material = this.enemyMatBoss;
        break;
      }
    }

    return mesh;
  }

  public update(hero: SuperLineHero, deltaTime: number, onCoinDrop: (x: number, y: number) => void, onGemDrop: (x: number, y: number) => void): void {
    // Time Pulse Powerup: slow enemies if active
    const timeScale = hero.activePowerUp === PowerUpType.TIME_PULSE ? 0.35 : 1.0;
    const effectiveDt = deltaTime * timeScale;

    // Update enemies
    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue;

      enemy.timer += effectiveDt;

      // Enemy AI behaviors
      switch (enemy.type) {
        case EnemyType.SPIKY_ROLLER: {
          const range = enemy.config.patrolRange || 4.0;
          const distFromStart = enemy.position.x - enemy.startX;

          if (Math.abs(distFromStart) > range) {
            enemy.patrolDir = -Math.sign(distFromStart);
          }
          enemy.velocity.x = enemy.patrolDir * 2.8;
          enemy.position.x += enemy.velocity.x * effectiveDt;
          enemy.mesh.rotation.z -= enemy.patrolDir * effectiveDt * 6.0; // Roll
          break;
        }
        case EnemyType.AERO_DRONE: {
          const range = enemy.config.patrolRange || 5.0;
          const distFromStart = enemy.position.x - enemy.startX;
          if (Math.abs(distFromStart) > range) {
            enemy.patrolDir = -Math.sign(distFromStart);
          }
          enemy.velocity.x = enemy.patrolDir * 2.4;
          enemy.position.x += enemy.velocity.x * effectiveDt;
          // Hover sine wave
          enemy.position.y = enemy.config.y + Math.sin(enemy.timer * 3.0) * 0.7;
          enemy.mesh.rotation.y += effectiveDt * 3.0;
          break;
        }
        case EnemyType.CHARGING_DASHER: {
          const distToHero = hero.position.x - enemy.position.x;
          const absDist = Math.abs(distToHero);
          // If player within 7 units and on similar Y, charge!
          if (absDist < 7.0 && Math.abs(hero.position.y - enemy.position.y) < 2.0) {
            enemy.patrolDir = Math.sign(distToHero);
            enemy.velocity.x = enemy.patrolDir * 6.0; // Fast charge
          } else {
            enemy.velocity.x = enemy.patrolDir * 1.5;
            if (Math.abs(enemy.position.x - enemy.startX) > (enemy.config.patrolRange || 3.0)) {
              enemy.patrolDir = -enemy.patrolDir;
            }
          }
          enemy.position.x += enemy.velocity.x * effectiveDt;
          break;
        }
        case EnemyType.PULSE_TURRET: {
          enemy.attackCooldown -= effectiveDt;
          if (enemy.attackCooldown <= 0) {
            enemy.attackCooldown = 2.4;
            // Shoot projectile toward hero
            this.spawnProjectile(enemy.position, hero.position);
          }
          break;
        }
        case EnemyType.SHIELDED_GOLEM: {
          enemy.position.x += enemy.patrolDir * 1.2 * effectiveDt;
          if (Math.abs(enemy.position.x - enemy.startX) > (enemy.config.patrolRange || 3.5)) {
            enemy.patrolDir = -enemy.patrolDir;
          }
          break;
        }
        case EnemyType.CRYSTAL_STALKER: {
          enemy.position.x += enemy.patrolDir * 2.0 * effectiveDt;
          if (Math.abs(enemy.position.x - enemy.startX) > (enemy.config.patrolRange || 4.0)) {
            enemy.patrolDir = -enemy.patrolDir;
          }
          enemy.mesh.scaling.y = 1.0 + Math.sin(enemy.timer * 6.0) * 0.2;
          break;
        }
        case EnemyType.NEON_MECHA: {
          // Mini-Boss AI
          enemy.attackCooldown -= effectiveDt;
          enemy.position.x = enemy.startX + Math.sin(enemy.timer * 1.5) * 3.5;

          if (enemy.attackCooldown <= 0) {
            enemy.attackCooldown = 2.0;
            // Burst 2 projectiles
            this.spawnProjectile(enemy.position, hero.position);
            setTimeout(() => this.spawnProjectile(enemy.position, hero.position), 300);
          }
          break;
        }
        case EnemyType.SHADOW_TITAN: {
          // Final Boss Level 32 multi-phase AI
          enemy.attackCooldown -= effectiveDt;
          enemy.mesh.rotation.y += effectiveDt * 1.2;
          enemy.mesh.rotation.z = Math.sin(enemy.timer * 2.0) * 0.15;

          // Float animation
          enemy.position.y = enemy.config.y + Math.sin(enemy.timer * 2.0) * 1.2;

          // Phase changes based on health
          if (enemy.health <= 5 && enemy.phase < 3) {
            enemy.phase = 3;
            this.particles.burstExplosion(enemy.position, '#ffd600');
          } else if (enemy.health <= 10 && enemy.phase < 2) {
            enemy.phase = 2;
            this.particles.burstExplosion(enemy.position, '#d500f9');
          }

          // Attack patterns
          if (enemy.attackCooldown <= 0) {
            enemy.attackCooldown = enemy.phase === 3 ? 1.4 : enemy.phase === 2 ? 2.0 : 2.8;

            if (enemy.phase === 1) {
              // Laser Barrage: 3 radial plasma spheres
              [-0.3, 0, 0.3].forEach(angleOffset => {
                const target = hero.position.clone();
                target.y += angleOffset * 4;
                this.spawnProjectile(enemy.position, target);
              });
            } else if (enemy.phase === 2) {
              // Shockwave Stomp + Minion Summon
              this.particles.burstExplosion(new BABYLON.Vector3(enemy.position.x, enemy.config.y - 2, 0), '#ff1744');
              this.spawnProjectile(enemy.position, hero.position);
              this.spawnProjectile(enemy.position, hero.position.add(new BABYLON.Vector3(2, 1, 0)));
            } else {
              // Phase 3: Intense Barrage of 5 projectiles
              for (let i = -2; i <= 2; i++) {
                const target = hero.position.clone();
                target.y += i * 1.8;
                this.spawnProjectile(enemy.position, target);
              }
            }
          }
          break;
        }
      }

      enemy.mesh.position.copyFrom(enemy.position);

      // Check collision with Hero Attack Slash
      if (hero.isAttacking) {
        const slashDist = BABYLON.Vector3.Distance(hero.position, enemy.position);
        if (slashDist < 2.0) {
          this.damageEnemy(enemy, 1, onCoinDrop, onGemDrop);
          continue;
        }
      }

      // Check collision with Hero (Body or Stomp)
      const baseRadius = enemy.type === EnemyType.SHADOW_TITAN ? 1.6 : enemy.type === EnemyType.NEON_MECHA ? 1.0 : 0.6;
      const enemyRadius = enemy.config.isBoss && enemy.type !== EnemyType.SHADOW_TITAN && enemy.type !== EnemyType.NEON_MECHA ? baseRadius * 1.9 : baseRadius;
      const dx = hero.position.x - enemy.position.x;
      const dy = hero.position.y - enemy.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < enemyRadius + 0.45) {
        // Check stomp: Hero falling onto enemy head
        const isStomp = hero.velocity.y < -1.0 && hero.position.y > enemy.position.y + enemyRadius * 0.6;

        if (isStomp || hero.activePowerUp === PowerUpType.MEGA_LINE) {
          hero.velocity.y = 11.0; // Stomp bounce
          hero.canDoubleJump = true;
          this.audio.playJump();
          this.damageEnemy(enemy, hero.activePowerUp === PowerUpType.MEGA_LINE ? 3 : 1, onCoinDrop, onGemDrop);
        } else {
          // Hero takes damage
          const knockback = Math.sign(dx) || 1;
          hero.takeDamage(1, knockback);
        }
      }
    }

    // Update Boss Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      if (!proj.alive) continue;

      proj.position.addInPlace(proj.velocity.scale(effectiveDt));
      proj.mesh.position.copyFrom(proj.position);

      // Check hit with hero
      if (BABYLON.Vector3.Distance(proj.position, hero.position) < 0.7) {
        hero.takeDamage(1, Math.sign(proj.velocity.x));
        proj.alive = false;
        proj.mesh.dispose();
        this.projectiles.splice(i, 1);
        continue;
      }

      // Out of bounds cleanup
      if (BABYLON.Vector3.Distance(proj.position, hero.position) > 25.0) {
        proj.alive = false;
        proj.mesh.dispose();
        this.projectiles.splice(i, 1);
      }
    }
  }

  private spawnProjectile(from: BABYLON.Vector3, target: BABYLON.Vector3): void {
    const mesh = BABYLON.MeshBuilder.CreateSphere('bossBullet', { diameter: 0.45, segments: 8 }, this.scene);
    mesh.material = this.enemyMatRed;
    mesh.position.copyFrom(from);

    const dir = target.subtract(from).normalize();
    const speed = 7.5;

    this.projectiles.push({
      mesh,
      position: from.clone(),
      velocity: dir.scale(speed),
      alive: true
    });
  }

  public damageEnemy(enemy: ActiveEnemy, amount: number, onCoinDrop: (x: number, y: number) => void, onGemDrop: (x: number, y: number) => void): void {
    enemy.health -= amount;
    this.particles.burstExplosion(enemy.position, '#ffd600');
    this.audio.playEnemyDefeat();

    if (enemy.health <= 0) {
      enemy.isAlive = false;
      enemy.mesh.setEnabled(false);
      this.particles.burstExplosion(enemy.position, '#ff1744');

      // Drop rewards
      if (enemy.type === EnemyType.SHADOW_TITAN) {
        for (let i = 0; i < 15; i++) onCoinDrop(enemy.position.x + (i - 7) * 0.4, enemy.position.y);
        for (let i = 0; i < 5; i++) onGemDrop(enemy.position.x + (i - 2) * 0.6, enemy.position.y + 1);
      } else if (enemy.type === EnemyType.NEON_MECHA || enemy.config.isBoss) {
        for (let i = 0; i < 8; i++) onCoinDrop(enemy.position.x + (i - 4) * 0.3, enemy.position.y);
        onGemDrop(enemy.position.x, enemy.position.y + 1);
      } else {
        onCoinDrop(enemy.position.x, enemy.position.y);
        if (Math.random() < 0.25) onGemDrop(enemy.position.x, enemy.position.y + 0.5);
      }
    }
  }

  /**
   * Checkpoint respawn support: snap every still-alive enemy back to its
   * spawn position/state so the player has to face the same challenge
   * again after dying. Deliberately does NOT resurrect enemies already
   * defeated before the death — doing so would let the player farm the
   * same enemy's coin/gem drop repeatedly by dying next to it on purpose.
   * Bosses keep whatever health they had (no free healing on respawn).
   */
  public repositionAliveEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue;
      enemy.position.set(enemy.config.x, enemy.config.y, 0);
      enemy.mesh.position.set(enemy.config.x, enemy.config.y, 0);
      enemy.velocity.set(0, 0, 0);
      enemy.patrolDir = 1;
      enemy.timer = Math.random() * 3;
      enemy.attackCooldown = 1.5;
      enemy.isTelegraphing = false;
    }
    // Any projectiles already in flight shouldn't hang around after a
    // checkpoint respawn — they'd be tracking a hero position that just
    // teleported away.
    for (const proj of this.projectiles) {
      proj.mesh.dispose();
    }
    this.projectiles = [];
  }

  public clear(): void {
    for (const enemy of this.enemies) {
      enemy.mesh.dispose();
    }
    this.enemies = [];

    for (const proj of this.projectiles) {
      proj.mesh.dispose();
    }
    this.projectiles = [];
    this.activeBoss = null;
  }
}
