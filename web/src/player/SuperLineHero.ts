import * as BABYLON from 'babylonjs';
import { GameConfig } from '../config/GameConfig';
import { PlayerAnimState, PowerUpType, PlatformConfig } from '../types/game';
import { AudioManager } from '../audio/AudioManager';
import { ParticleManager } from '../effects/ParticleManager';

export class SuperLineHero {
  public mesh: BABYLON.TransformNode;
  private headMesh: BABYLON.Mesh;
  private bodySpine: BABYLON.Mesh[] = [];
  private eyeLeft: BABYLON.Mesh;
  private eyeRight: BABYLON.Mesh;
  private scarfSegments: BABYLON.Mesh[] = [];
  private shieldBubble: BABYLON.Mesh;
  private slashBladeMesh: BABYLON.Mesh;

  private primaryMat: BABYLON.StandardMaterial;
  private glowMat: BABYLON.StandardMaterial;
  private eyeMat: BABYLON.StandardMaterial;
  private scarfMat: BABYLON.StandardMaterial;
  private shieldMat: BABYLON.StandardMaterial;

  // Physics state
  public position: BABYLON.Vector3;
  public velocity: BABYLON.Vector3;
  public isGrounded: boolean = false;
  public facingDirection: number = 1; // 1 = right, -1 = left

  public animState: PlayerAnimState = PlayerAnimState.IDLE;
  private animTimer: number = 0;
  private deathAnimTimer: number = 0;

  // Jump helpers
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;
  public canDoubleJump: boolean = true;
  private isJumpHolding: boolean = false;

  // Attack / Dash
  public isAttacking: boolean = false;
  private attackTimer: number = 0;
  private attackCooldown: number = 0;
  public isDashing: boolean = false;
  private dashTimer: number = 0;
  private dashCooldown: number = 0;

  // Health & I-Frames
  public health: number = 3;
  public maxHealth: number = 3;
  public isInvincible: boolean = false;
  private invincibilityTimer: number = 0;

  // Active Power-up
  public activePowerUp: PowerUpType | null = null;
  public powerUpTimer: number = 0;

  // Moving platform adherence
  public currentPlatformVelocity: BABYLON.Vector3 = BABYLON.Vector3.Zero();

  private scene: BABYLON.Scene;
  private audio: AudioManager;
  private particles: ParticleManager;

  constructor(scene: BABYLON.Scene, audio: AudioManager, particles: ParticleManager, startX: number, startY: number, skinHex: string = '#00e5ff', secondaryHex: string = '#0077ff') {
    this.scene = scene;
    this.audio = audio;
    this.particles = particles;
    this.position = new BABYLON.Vector3(startX, startY, 0);
    this.velocity = BABYLON.Vector3.Zero();

    this.mesh = new BABYLON.TransformNode('SuperLineRoot', scene);
    this.mesh.position = this.position;

    // Materials
    this.primaryMat = new BABYLON.StandardMaterial('heroPrimaryMat', scene);
    this.primaryMat.diffuseColor = BABYLON.Color3.FromHexString(skinHex);
    this.primaryMat.emissiveColor = BABYLON.Color3.FromHexString(skinHex).scale(0.6);
    this.primaryMat.specularColor = new BABYLON.Color3(1, 1, 1);

    this.glowMat = new BABYLON.StandardMaterial('heroGlowMat', scene);
    this.glowMat.diffuseColor = BABYLON.Color3.FromHexString(secondaryHex);
    this.glowMat.emissiveColor = BABYLON.Color3.FromHexString(secondaryHex).scale(0.8);

    this.eyeMat = new BABYLON.StandardMaterial('heroEyeMat', scene);
    this.eyeMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    this.eyeMat.emissiveColor = new BABYLON.Color3(1, 1, 1);

    this.scarfMat = new BABYLON.StandardMaterial('heroScarfMat', scene);
    this.scarfMat.diffuseColor = BABYLON.Color3.FromHexString('#ffd600');
    this.scarfMat.emissiveColor = BABYLON.Color3.FromHexString('#ffd600').scale(0.7);

    this.shieldMat = new BABYLON.StandardMaterial('heroShieldMat', scene);
    this.shieldMat.diffuseColor = new BABYLON.Color3(0, 0.9, 1);
    this.shieldMat.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
    this.shieldMat.alpha = 0.45;

    // Procedural Super Line Hero Geometry
    // 1. Head (Rounded capsule / sphere)
    this.headMesh = BABYLON.MeshBuilder.CreateSphere('heroHead', { diameterX: 0.85, diameterY: 0.9, diameterZ: 0.7, segments: 16 }, scene);
    this.headMesh.parent = this.mesh;
    this.headMesh.position.y = 0.9;
    this.headMesh.material = this.primaryMat;

    // Digital Eyes (visors)
    this.eyeLeft = BABYLON.MeshBuilder.CreateBox('eyeL', { width: 0.16, height: 0.22, depth: 0.08 }, scene);
    this.eyeLeft.parent = this.headMesh;
    this.eyeLeft.position = new BABYLON.Vector3(0.22, 0.08, -0.32);
    this.eyeLeft.material = this.eyeMat;

    this.eyeRight = BABYLON.MeshBuilder.CreateBox('eyeR', { width: 0.16, height: 0.22, depth: 0.08 }, scene);
    this.eyeRight.parent = this.headMesh;
    this.eyeRight.position = new BABYLON.Vector3(-0.06, 0.08, -0.32);
    this.eyeRight.material = this.eyeMat;

    // 2. Spine / Torso segments (fluid dynamic line rings)
    for (let i = 0; i < 3; i++) {
      const seg = BABYLON.MeshBuilder.CreateTorus(`spineSeg_${i}`, {
        diameter: 0.65 - i * 0.1,
        thickness: 0.15,
        tessellation: 20
      }, scene);
      seg.parent = this.mesh;
      seg.position.y = 0.5 - i * 0.22;
      seg.rotation.x = Math.PI / 2;
      seg.material = i % 2 === 0 ? this.primaryMat : this.glowMat;
      this.bodySpine.push(seg);
    }

    // 3. Dynamic Trailing Energy Scarf
    for (let i = 0; i < 5; i++) {
      const ribbon = BABYLON.MeshBuilder.CreateBox(`scarf_${i}`, {
        width: 0.24 - i * 0.03,
        height: 0.14 - i * 0.015,
        depth: 0.06
      }, scene);
      ribbon.parent = this.mesh;
      ribbon.position.set(-0.3 - i * 0.22, 0.7 - i * 0.1, 0.1);
      ribbon.material = this.scarfMat;
      this.scarfSegments.push(ribbon);
    }

    // 4. Energy Shield Bubble
    this.shieldBubble = BABYLON.MeshBuilder.CreateSphere('shieldBubble', { diameter: 2.2, segments: 16 }, scene);
    this.shieldBubble.parent = this.mesh;
    this.shieldBubble.position.y = 0.6;
    this.shieldBubble.material = this.shieldMat;
    this.shieldBubble.setEnabled(false);

    // 5. Slash Blade Mesh (for attacks)
    this.slashBladeMesh = BABYLON.MeshBuilder.CreateTorus('slashBlade', {
      diameter: 1.8,
      thickness: 0.15,
      tessellation: 24
    }, scene);
    this.slashBladeMesh.parent = this.mesh;
    this.slashBladeMesh.position.set(0.9, 0.6, 0);
    this.slashBladeMesh.rotation.y = Math.PI / 4;
    const slashMat = new BABYLON.StandardMaterial('slashMat', scene);
    slashMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
    slashMat.alpha = 0.85;
    this.slashBladeMesh.material = slashMat;
    this.slashBladeMesh.setEnabled(false);
  }

  public updateSkin(skinHex: string, secondaryHex: string): void {
    this.primaryMat.diffuseColor = BABYLON.Color3.FromHexString(skinHex);
    this.primaryMat.emissiveColor = BABYLON.Color3.FromHexString(skinHex).scale(0.6);
    this.glowMat.diffuseColor = BABYLON.Color3.FromHexString(secondaryHex);
    this.glowMat.emissiveColor = BABYLON.Color3.FromHexString(secondaryHex).scale(0.8);
  }

  public handleInput(moveX: number, jumpPressed: boolean, jumpHeld: boolean, attackPressed: boolean, dashPressed: boolean, deltaTime: number): void {
    if (this.animState === PlayerAnimState.DEATH) return;

    this.isJumpHolding = jumpHeld;

    // 1. Horizontal Movement
    let targetSpeed = moveX * GameConfig.PHYSICS.MOVE_SPEED;
    if (this.activePowerUp === PowerUpType.SPEED_SPARK) {
      targetSpeed *= 1.45;
    } else if (this.activePowerUp === PowerUpType.MEGA_LINE) {
      targetSpeed *= 1.15;
    }

    if (Math.abs(moveX) > 0.05) {
      this.facingDirection = Math.sign(moveX);
      const accel = this.isGrounded ? GameConfig.PHYSICS.ACCELERATION : GameConfig.PHYSICS.ACCELERATION * GameConfig.PHYSICS.AIR_CONTROL;
      this.velocity.x = BABYLON.Scalar.Lerp(this.velocity.x, targetSpeed, deltaTime * (accel / GameConfig.PHYSICS.MOVE_SPEED));
    } else {
      const decel = this.isGrounded ? GameConfig.PHYSICS.DECELERATION : GameConfig.PHYSICS.DECELERATION * 0.4;
      this.velocity.x = BABYLON.Scalar.Lerp(this.velocity.x, 0, deltaTime * decel);
    }

    // 2. Jump Buffering & Coyote Time
    if (this.isGrounded) {
      this.coyoteTimer = GameConfig.PHYSICS.COYOTE_TIME;
      this.canDoubleJump = true;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaTime);
    }

    if (jumpPressed) {
      this.jumpBufferTimer = GameConfig.PHYSICS.JUMP_BUFFER;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - deltaTime);
    }

    // Execute Ground Jump
    if (this.jumpBufferTimer > 0 && (this.isGrounded || this.coyoteTimer > 0)) {
      this.velocity.y = GameConfig.PHYSICS.JUMP_FORCE;
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.isGrounded = false;
      this.audio.playJump();
      this.animState = PlayerAnimState.JUMP;
      this.particles.burstJumpRing(this.position);
    } else if (jumpPressed && !this.isGrounded && this.canDoubleJump) {
      // Execute Double Jump
      this.velocity.y = GameConfig.PHYSICS.DOUBLE_JUMP_FORCE;
      this.canDoubleJump = false;
      this.audio.playDoubleJump();
      this.animState = PlayerAnimState.DOUBLE_JUMP;
      this.particles.burstJumpRing(this.position, '#ffd600');
    }

    // Variable Jump Height: If player releases jump while moving up, cut upward velocity
    if (!this.isJumpHolding && this.velocity.y > 0) {
      this.velocity.y += GameConfig.PHYSICS.GRAVITY * GameConfig.PHYSICS.VARIABLE_JUMP_FALLOFF * deltaTime;
    }

    // 3. Attack Action
    if (attackPressed && this.attackCooldown <= 0) {
      this.executeAttack();
    }

    // 4. Dash Action (Available via Sky Dash powerup or attack combo)
    if (dashPressed && this.dashCooldown <= 0 && (this.activePowerUp === PowerUpType.SKY_DASH || this.canDoubleJump)) {
      this.executeDash();
    }
  }

  private executeAttack(): void {
    this.isAttacking = true;
    this.attackTimer = GameConfig.PHYSICS.ATTACK_SLASH_DURATION;
    this.attackCooldown = GameConfig.PHYSICS.ATTACK_SLASH_COOLDOWN;
    this.slashBladeMesh.setEnabled(true);
    this.slashBladeMesh.position.x = this.facingDirection * 1.1;
    this.audio.playAttackSlash();
  }

  private executeDash(): void {
    this.isDashing = true;
    this.dashTimer = GameConfig.PHYSICS.DASH_DURATION;
    this.dashCooldown = GameConfig.PHYSICS.DASH_COOLDOWN;
    this.velocity.x = this.facingDirection * GameConfig.PHYSICS.DASH_SPEED;
    this.velocity.y = 0;
    this.audio.playDash();
    this.particles.burstJumpRing(this.position, '#00e5ff');
  }

  public updatePhysicsAndCollisions(deltaTime: number, platforms: PlatformConfig[], mapMinY: number = -10): void {
    if (this.animState === PlayerAnimState.DEATH) {
      this.updateDeathAnimation(deltaTime);
      return;
    }
    if (this.animState === PlayerAnimState.VICTORY) {
      this.updateVictoryPose(deltaTime);
      return;
    }

    // Cooldown timers
    if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;
    if (this.attackTimer > 0) {
      this.attackTimer -= deltaTime;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.slashBladeMesh.setEnabled(false);
      }
    }

    if (this.dashCooldown > 0) this.dashCooldown -= deltaTime;
    if (this.dashTimer > 0) {
      this.dashTimer -= deltaTime;
      this.velocity.y = 0; // Freeze vertical drop during dash
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    }

    // Invincibility blink
    if (this.isInvincible) {
      this.invincibilityTimer -= deltaTime;
      this.headMesh.visibility = Math.sin(this.invincibilityTimer * 25) > 0 ? 0.9 : 0.2;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
        this.headMesh.visibility = 1.0;
      }
    }

    // Power-up timer
    if (this.activePowerUp) {
      this.powerUpTimer -= deltaTime;
      if (this.powerUpTimer <= 0) {
        this.clearPowerUp();
      }
    }

    // Apply gravity
    if (!this.isDashing) {
      this.velocity.y += GameConfig.PHYSICS.GRAVITY * deltaTime;
      if (this.velocity.y < GameConfig.PHYSICS.MAX_FALL_SPEED) {
        this.velocity.y = GameConfig.PHYSICS.MAX_FALL_SPEED;
      }
    }

    // Add moving platform velocity
    const effectiveVx = this.velocity.x + this.currentPlatformVelocity.x;
    const effectiveVy = this.velocity.y + this.currentPlatformVelocity.y;

    // Projected position
    const nextX = this.position.x + effectiveVx * deltaTime;
    const nextY = this.position.y + effectiveVy * deltaTime;

    const heroHalfW = 0.35;
    const heroHeight = 1.2;

    this.isGrounded = false;
    this.currentPlatformVelocity.set(0, 0, 0);

    // Platform Collisions (AABB)
    for (const p of platforms) {
      const pLeft = p.x - p.width / 2;
      const pRight = p.x + p.width / 2;
      const pTop = p.y + p.height / 2;
      const pBottom = p.y - p.height / 2;

      // Check horizontal overlap
      const hasHorizontalOverlap = (nextX + heroHalfW > pLeft) && (nextX - heroHalfW < pRight);

      if (hasHorizontalOverlap) {
        // Landing on top of platform (Falling down)
        if (this.position.y >= pTop - 0.1 && nextY <= pTop && this.velocity.y <= 0) {
          this.position.y = pTop;
          this.velocity.y = 0;
          this.isGrounded = true;

          // Check if platform is moving
          if (p.moveSpeed && p.moveRangeX) {
            this.currentPlatformVelocity.x = Math.sin(Date.now() * 0.002 * p.moveSpeed) * p.moveRangeX;
          }
          continue;
        }

        // Hitting ceiling from below (not for one-way platforms)
        if (!p.isOneWay && this.position.y + heroHeight <= pBottom + 0.15 && nextY + heroHeight >= pBottom && this.velocity.y > 0) {
          this.position.y = pBottom - heroHeight;
          this.velocity.y = -1; // Bounce down
          continue;
        }
      }

      // Solid side collisions (not one-way)
      if (!p.isOneWay) {
        const hasVerticalOverlap = (this.position.y < pTop) && (this.position.y + heroHeight > pBottom);
        if (hasVerticalOverlap) {
          // Walking into left side
          if (this.position.x + heroHalfW <= pLeft + 0.1 && nextX + heroHalfW > pLeft && this.velocity.x > 0) {
            this.position.x = pLeft - heroHalfW;
            this.velocity.x = 0;
          }
          // Walking into right side
          else if (this.position.x - heroHalfW >= pRight - 0.1 && nextX - heroHalfW < pRight && this.velocity.x < 0) {
            this.position.x = pRight + heroHalfW;
            this.velocity.x = 0;
          }
        }
      }
    }

    // Apply resolved position
    if (!this.isGrounded) {
      this.position.y += effectiveVy * deltaTime;
    }
    this.position.x += effectiveVx * deltaTime;

    // Check Fall Death (Pit)
    if (this.position.y < mapMinY) {
      this.takeDamage(999, 0); // Instant pit kill
    }

    this.mesh.position.copyFrom(this.position);
    this.updateVisualAnimation(deltaTime);
  }

  private updateVisualAnimation(deltaTime: number): void {
    this.animTimer += deltaTime;

    // Face direction
    this.headMesh.rotation.y = this.facingDirection > 0 ? 0 : Math.PI;

    // Determine state
    if (!this.isGrounded) {
      if (this.velocity.y > 1.5) {
        this.animState = this.canDoubleJump ? PlayerAnimState.JUMP : PlayerAnimState.DOUBLE_JUMP;
      } else {
        this.animState = PlayerAnimState.FALLING;
      }
    } else if (Math.abs(this.velocity.x) > 0.4) {
      this.animState = PlayerAnimState.RUNNING;
    } else {
      this.animState = PlayerAnimState.IDLE;
    }

    // Squash & Stretch & Animations
    switch (this.animState) {
      case PlayerAnimState.IDLE: {
        const breath = Math.sin(this.animTimer * 4.0) * 0.05;
        this.headMesh.scaling.set(1.0 + breath, 1.0 - breath, 1.0);
        this.scarfSegments.forEach((s, idx) => {
          s.position.x = -0.3 * this.facingDirection - (idx * 0.15 * this.facingDirection);
          s.position.y = 0.7 + Math.sin(this.animTimer * 4.0 + idx * 0.8) * 0.08;
        });
        break;
      }
      case PlayerAnimState.RUNNING: {
        const runBounce = Math.sin(this.animTimer * 14.0) * 0.08;
        this.headMesh.scaling.set(0.95, 1.05 + runBounce, 0.95);
        this.headMesh.rotation.z = -this.facingDirection * 0.12;
        this.scarfSegments.forEach((s, idx) => {
          s.position.x = -0.4 * this.facingDirection - (idx * 0.22 * this.facingDirection);
          s.position.y = 0.7 + Math.sin(this.animTimer * 14.0 - idx * 0.6) * 0.14;
        });
        break;
      }
      case PlayerAnimState.JUMP:
      case PlayerAnimState.DOUBLE_JUMP: {
        this.headMesh.scaling.set(0.85, 1.25, 0.85); // Stretch
        this.scarfSegments.forEach((s, idx) => {
          s.position.y = 0.5 - idx * 0.12;
          s.position.x = -0.3 * this.facingDirection - (idx * 0.1 * this.facingDirection);
        });
        if (this.animState === PlayerAnimState.DOUBLE_JUMP) {
          this.mesh.rotation.z += this.facingDirection * deltaTime * 16.0;
        } else {
          this.mesh.rotation.z = 0;
        }
        break;
      }
      case PlayerAnimState.FALLING: {
        this.headMesh.scaling.set(1.15, 0.85, 1.15); // Squash
        this.mesh.rotation.z = 0;
        this.scarfSegments.forEach((s, idx) => {
          s.position.y = 0.8 + idx * 0.14;
        });
        break;
      }
    }

    if (this.isGrounded) {
      this.mesh.rotation.z = 0;
    }

    // Active shield animation
    if (this.shieldBubble.isEnabled()) {
      this.shieldBubble.rotation.y += deltaTime * 2.0;
      this.shieldBubble.rotation.x += deltaTime * 1.5;
    }
  }

  private updateVictoryPose(deltaTime: number): void {
    // A real victory state, distinct from every other pose: an arms-up
    // bounce with a slow spin, replacing the old `animState = animState`
    // no-op that never actually showed anything different.
    this.animTimer += deltaTime;
    const bounce = Math.abs(Math.sin(this.animTimer * 6.0)) * 0.25;
    this.headMesh.scaling.set(1.0 - bounce * 0.3, 1.15 + bounce, 1.0 - bounce * 0.3);
    this.mesh.rotation.y += deltaTime * 3.0;
    this.scarfSegments.forEach((s, idx) => {
      s.position.y = 0.7 + Math.sin(this.animTimer * 6.0 + idx * 0.5) * 0.2;
    });
  }

  private updateDeathAnimation(deltaTime: number): void {
    // A real death animation: spin, shrink, and sink over ~0.6s, instead
    // of instantly hiding the mesh with no animation at all.
    this.deathAnimTimer += deltaTime;
    const t = Math.min(1, this.deathAnimTimer / 0.6);
    this.mesh.rotation.z += deltaTime * 10.0;
    const scale = 1 - t;
    this.mesh.scaling.set(scale, scale, scale);
    this.mesh.position.y = this.position.y - t * 1.5;
    if (t >= 1 && this.mesh.isEnabled()) {
      this.mesh.setEnabled(false);
    }
  }

  public triggerVictory(): void {
    if (this.animState === PlayerAnimState.DEATH) return;
    this.animState = PlayerAnimState.VICTORY;
    this.velocity.set(0, 0, 0);
    this.animTimer = 0;
  }

  public takeDamage(amount: number, knockbackDir: number = 0): boolean {
    if (this.isInvincible || this.animState === PlayerAnimState.DEATH) return false;

    // If Energy Shield powerup is active, absorb hit
    if (this.activePowerUp === PowerUpType.ENERGY_SHIELD) {
      this.clearPowerUp();
      this.isInvincible = true;
      this.invincibilityTimer = 1.0;
      this.audio.playEnemyDefeat();
      this.particles.burstExplosion(this.position, '#00e5ff');
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    this.audio.playHurt();
    this.particles.burstExplosion(this.position, '#ff1744');

    if (this.health <= 0) {
      this.triggerDeath();
      return true;
    }

    // Knockback & I-Frames
    this.isInvincible = true;
    this.invincibilityTimer = GameConfig.PHYSICS.INVINCIBILITY_DURATION;
    this.velocity.x = knockbackDir * GameConfig.PHYSICS.KNOCKBACK_FORCE;
    this.velocity.y = 8.0;
    this.isGrounded = false;
    return false;
  }

  public triggerDeath(): void {
    this.animState = PlayerAnimState.DEATH;
    this.velocity.set(0, 0, 0);
    this.audio.playGameOver();
    this.particles.burstExplosion(this.position, '#ff1744');
    this.deathAnimTimer = 0;
    // Mesh stays visible and plays updateDeathAnimation() instead of being
    // hidden instantly — GameManager waits ~800ms before showing results,
    // which is enough time for the animation to finish on its own.
  }

  public respawn(x: number, y: number): void {
    this.position.set(x, y, 0);
    this.velocity.set(0, 0, 0);
    this.health = this.maxHealth;
    this.isInvincible = true;
    this.invincibilityTimer = 1.2;
    this.animState = PlayerAnimState.IDLE;
    this.mesh.setEnabled(true);
    this.mesh.rotation.z = 0;
    this.mesh.rotation.y = 0;
    this.mesh.position.copyFrom(this.position);
    this.clearPowerUp();
  }

  public applyPowerUp(type: PowerUpType): void {
    this.activePowerUp = type;
    this.powerUpTimer = GameConfig.PHYSICS.POWERUP_DURATION;
    this.audio.playPowerUp();
    this.particles.burstCollect(this.position, true);

    if (type === PowerUpType.ENERGY_SHIELD) {
      this.shieldBubble.setEnabled(true);
    } else if (type === PowerUpType.MEGA_LINE) {
      this.mesh.scaling.set(1.6, 1.6, 1.6);
    }
  }

  public clearPowerUp(): void {
    this.activePowerUp = null;
    this.powerUpTimer = 0;
    this.shieldBubble.setEnabled(false);
    this.mesh.scaling.set(1.0, 1.0, 1.0);
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
