import * as BABYLON from 'babylonjs';
import { GameConfig } from '../config/GameConfig';

export class CameraManager {
  private camera: BABYLON.UniversalCamera;
  private targetPosition: BABYLON.Vector3;
  private lookAheadOffset: number = 0;
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;

  private minX: number = -5;
  private maxX: number = 100;
  private minY: number = -3;
  private maxY: number = 30;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
    // 2.5D Orthographic-like perspective camera looking at Z = 0
    this.camera = new BABYLON.UniversalCamera('MainCamera', new BABYLON.Vector3(0, 3, GameConfig.CAMERA.OFFSET_Z), scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 3, 0));
    this.camera.fov = 0.85; // Natural viewing angle
    this.targetPosition = new BABYLON.Vector3(0, 3, GameConfig.CAMERA.OFFSET_Z);
  }

  public setBounds(minX: number, maxX: number, minY: number, maxY: number): void {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }

  public snapTo(pos: BABYLON.Vector3): void {
    this.targetPosition.x = pos.x;
    this.targetPosition.y = pos.y + GameConfig.CAMERA.OFFSET_Y;
    this.targetPosition.z = GameConfig.CAMERA.OFFSET_Z;

    this.clampTarget();
    this.camera.position.copyFrom(this.targetPosition);
    this.camera.setTarget(new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, 0));
  }

  public triggerShake(intensity: number = 0.4, duration: number = 0.3): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  public update(playerPos: BABYLON.Vector3, playerVelocityX: number, deltaTime: number): void {
    // Smooth Look-ahead
    const targetLookAhead = Math.sign(playerVelocityX) * GameConfig.CAMERA.LOOK_AHEAD_DISTANCE;
    this.lookAheadOffset = BABYLON.Scalar.Lerp(this.lookAheadOffset, targetLookAhead, deltaTime * 3.0);

    const desiredX = playerPos.x + this.lookAheadOffset;
    const desiredY = playerPos.y + GameConfig.CAMERA.OFFSET_Y;

    // Smooth Lerp
    const lerpFactor = Math.min(1.0, deltaTime * GameConfig.CAMERA.LERP_SPEED);
    this.targetPosition.x = BABYLON.Scalar.Lerp(this.targetPosition.x, desiredX, lerpFactor);
    this.targetPosition.y = BABYLON.Scalar.Lerp(this.targetPosition.y, desiredY, lerpFactor);
    this.targetPosition.z = GameConfig.CAMERA.OFFSET_Z;

    this.clampTarget();

    // Apply Screen Shake
    let shakeOffset = BABYLON.Vector3.Zero();
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      const currentIntensity = this.shakeIntensity * (this.shakeDuration / 0.3);
      shakeOffset = new BABYLON.Vector3(
        (Math.random() - 0.5) * 2 * currentIntensity,
        (Math.random() - 0.5) * 2 * currentIntensity,
        0
      );
    }

    this.camera.position.x = this.targetPosition.x + shakeOffset.x;
    this.camera.position.y = this.targetPosition.y + shakeOffset.y;
    this.camera.position.z = this.targetPosition.z;

    this.camera.setTarget(new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, 0));
  }

  private clampTarget(): void {
    this.targetPosition.x = Math.max(this.minX + 8, Math.min(this.maxX - 8, this.targetPosition.x));
    this.targetPosition.y = Math.max(this.minY + 4, Math.min(this.maxY - 3, this.targetPosition.y));
  }

  public getPosition(): BABYLON.Vector3 {
    return this.camera.position;
  }
}
