import * as BABYLON from 'babylonjs';
import { MapTheme } from '../types/game';

export class ParticleManager {
  private scene: BABYLON.Scene;
  private ambientSystem: BABYLON.ParticleSystem | null = null;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  // Helper to create circular particle texture procedurally
  private createCircleTexture(name: string, color: string = '#ffffff'): BABYLON.DynamicTexture {
    const size = 64;
    const dynamicTexture = new BABYLON.DynamicTexture(name, size, this.scene, false);
    const ctx = dynamicTexture.getContext();

    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Soft glow rim
    const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fill();

    dynamicTexture.update();
    return dynamicTexture;
  }

  public burstJumpRing(position: BABYLON.Vector3, colorHex: string = '#00e5ff'): void {
    const ps = new BABYLON.ParticleSystem('jumpRing', 30, this.scene);
    ps.particleTexture = this.createCircleTexture('jumpTex', colorHex);
    ps.emitter = position.clone();
    ps.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, 0);
    ps.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0);

    const c = BABYLON.Color3.FromHexString(colorHex);
    ps.color1 = new BABYLON.Color4(c.r, c.g, c.b, 1.0);
    ps.color2 = new BABYLON.Color4(c.r, c.g, c.b, 0.4);
    ps.colorDead = new BABYLON.Color4(c.r, c.g, c.b, 0.0);

    ps.minSize = 0.15;
    ps.maxSize = 0.35;
    ps.minLifeTime = 0.15;
    ps.maxLifeTime = 0.35;
    ps.emitRate = 300;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    ps.gravity = new BABYLON.Vector3(0, -5, 0);

    ps.direction1 = new BABYLON.Vector3(-2.5, -0.5, 0);
    ps.direction2 = new BABYLON.Vector3(2.5, -0.5, 0);
    ps.minEmitPower = 1.5;
    ps.maxEmitPower = 3.5;
    ps.targetStopDuration = 0.12;
    ps.disposeOnStop = true;
    ps.start();
  }

  public burstCollect(position: BABYLON.Vector3, isGem: boolean = false): void {
    const count = isGem ? 40 : 25;
    const ps = new BABYLON.ParticleSystem('collectBurst', count, this.scene);
    const colorHex = isGem ? '#d500f9' : '#ffd600';
    ps.particleTexture = this.createCircleTexture('collectTex', colorHex);
    ps.emitter = position.clone();

    const c = BABYLON.Color3.FromHexString(colorHex);
    ps.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
    ps.color2 = new BABYLON.Color4(c.r, c.g, c.b, 0.8);
    ps.colorDead = new BABYLON.Color4(c.r, c.g, c.b, 0.0);

    ps.minSize = 0.12;
    ps.maxSize = isGem ? 0.35 : 0.25;
    ps.minLifeTime = 0.25;
    ps.maxLifeTime = 0.55;
    ps.emitRate = 250;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    ps.direction1 = new BABYLON.Vector3(-3, -3, 0);
    ps.direction2 = new BABYLON.Vector3(3, 4, 0);
    ps.minEmitPower = 2.0;
    ps.maxEmitPower = 5.0;
    ps.targetStopDuration = 0.1;
    ps.disposeOnStop = true;
    ps.start();
  }

  public burstExplosion(position: BABYLON.Vector3, colorHex: string = '#ff1744'): void {
    const ps = new BABYLON.ParticleSystem('explosionBurst', 50, this.scene);
    ps.particleTexture = this.createCircleTexture('expTex', colorHex);
    ps.emitter = position.clone();

    const c = BABYLON.Color3.FromHexString(colorHex);
    ps.color1 = new BABYLON.Color4(1.0, 0.9, 0.2, 1.0);
    ps.color2 = new BABYLON.Color4(c.r, c.g, c.b, 0.8);
    ps.colorDead = new BABYLON.Color4(0.2, 0.0, 0.0, 0.0);

    ps.minSize = 0.2;
    ps.maxSize = 0.55;
    ps.minLifeTime = 0.3;
    ps.maxLifeTime = 0.65;
    ps.emitRate = 400;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    ps.gravity = new BABYLON.Vector3(0, -9.8, 0);

    ps.direction1 = new BABYLON.Vector3(-4, -2, 0);
    ps.direction2 = new BABYLON.Vector3(4, 5, 0);
    ps.minEmitPower = 3.0;
    ps.maxEmitPower = 7.0;
    ps.targetStopDuration = 0.15;
    ps.disposeOnStop = true;
    ps.start();
  }

  public setWorldThemeAmbient(theme: MapTheme, cameraPosition: BABYLON.Vector3): void {
    if (this.ambientSystem) {
      this.ambientSystem.stop();
      this.ambientSystem.dispose();
      this.ambientSystem = null;
    }

    let pColor = '#ffffff';
    let pSize = 0.15;
    let rate = 30;
    let dir = new BABYLON.Vector3(0, -1, 0);

    switch (theme) {
      case MapTheme.SKYLINE_MEADOWS:
        pColor = '#e0f7fa';
        pSize = 0.12;
        rate = 25;
        dir = new BABYLON.Vector3(-0.4, -0.6, 0);
        break;
      case MapTheme.CRYSTAL_CAVES:
        pColor = '#00e5ff';
        pSize = 0.16;
        rate = 40;
        dir = new BABYLON.Vector3(0.1, 0.5, 0);
        break;
      case MapTheme.CYBER_SKY_CITY:
        pColor = '#d500f9';
        pSize = 0.14;
        rate = 45;
        dir = new BABYLON.Vector3(-0.2, -1.5, 0);
        break;
      case MapTheme.VOLCANIC_SHADOW_REALM:
        pColor = '#ff5722';
        pSize = 0.2;
        rate = 55;
        dir = new BABYLON.Vector3(0.3, 1.8, 0);
        break;
    }

    this.ambientSystem = new BABYLON.ParticleSystem('worldAmbient', 100, this.scene);
    this.ambientSystem.particleTexture = this.createCircleTexture('ambientTex', pColor);
    this.ambientSystem.emitter = cameraPosition;
    this.ambientSystem.minEmitBox = new BABYLON.Vector3(-15, -10, 2);
    this.ambientSystem.maxEmitBox = new BABYLON.Vector3(15, 10, 2);

    const c = BABYLON.Color3.FromHexString(pColor);
    this.ambientSystem.color1 = new BABYLON.Color4(c.r, c.g, c.b, 0.7);
    this.ambientSystem.color2 = new BABYLON.Color4(c.r, c.g, c.b, 0.3);
    this.ambientSystem.colorDead = new BABYLON.Color4(c.r, c.g, c.b, 0.0);

    this.ambientSystem.minSize = pSize * 0.7;
    this.ambientSystem.maxSize = pSize * 1.5;
    this.ambientSystem.minLifeTime = 2.0;
    this.ambientSystem.maxLifeTime = 4.0;
    this.ambientSystem.emitRate = rate;
    this.ambientSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    this.ambientSystem.direction1 = dir.add(new BABYLON.Vector3(-0.5, -0.5, 0));
    this.ambientSystem.direction2 = dir.add(new BABYLON.Vector3(0.5, 0.5, 0));
    this.ambientSystem.minEmitPower = 0.5;
    this.ambientSystem.maxEmitPower = 1.5;
    this.ambientSystem.start();
  }

  public updateAmbientEmitter(pos: BABYLON.Vector3): void {
    if (this.ambientSystem) {
      this.ambientSystem.emitter = pos;
    }
  }

  public dispose(): void {
    if (this.ambientSystem) {
      this.ambientSystem.stop();
      this.ambientSystem.dispose();
      this.ambientSystem = null;
    }
  }
}
