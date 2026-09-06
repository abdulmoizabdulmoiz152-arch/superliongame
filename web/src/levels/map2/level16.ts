import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 16 — "The Crystal Golem's Lair" (Map 2 Boss)
// Design intent: an enclosed circular chamber. The Golem itself moves slowly
// and patrols the floor, so the real pressure comes from the arena — two
// pulsing laser hazards along the chamber walls that force repositioning
// while the player chips away at the Golem's much larger health pool.
// This is a deliberately different fight shape from Map 1's charge boss:
// slow, attritional, environment-driven rather than a fast dodge check.
export const level16: LevelConfig = {
  levelNumber: 16,
  mapIndex: 2,
  title: "The Crystal Golem's Lair",
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 46,
  goalY: 1.5,
  boundsX: 52,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 20, y: 0, width: 30, height: 2 },
    { x: 12, y: 3.4, width: 5, height: 0.8, isOneWay: true },
    { x: 28, y: 3.4, width: 5, height: 0.8, isOneWay: true },
    { x: 46, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 14, y: 4.6, width: 2.0, height: 8.0, type: 'LASER', laserInterval: 2.6 },
    { x: 30, y: 4.6, width: 2.0, height: 8.0, type: 'LASER', laserInterval: 3.1 }
  ],
  breakables: [],
  enemies: [
    {
      x: 20,
      y: 1.5,
      type: EnemyType.SHIELDED_GOLEM,
      patrolRange: 12,
      isBoss: true,
      bossHp: 14,
      bossName: 'Crystal Golem'
    }
  ],
  coins: [
    { x: 4, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 12, y: 4.6, type: PowerUpType.ENERGY_SHIELD },
    { x: 28, y: 4.6, type: PowerUpType.TIME_PULSE }
  ],
  checkpoints: [
    { x: 8, y: 1.5 }
  ],
  hasBoss: true,
  bossType: EnemyType.SHIELDED_GOLEM
};
