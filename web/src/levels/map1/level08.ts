import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 8 — "Guardian of the Meadow" (Map 1 Boss)
// Design intent: a wide, flat open arena so the boss's charge attack has
// room to build up and overshoot, giving the player a real dodge-and-punish
// window. Two floating side platforms offer an escape route above the
// charge lane. The boss is a scaled-up Charging Dasher — fast, aggressive,
// telegraphed by its run-up rather than a ranged attack.
export const level08: LevelConfig = {
  levelNumber: 8,
  mapIndex: 1,
  title: 'Guardian of the Meadow',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 42,
  goalY: 1.5,
  boundsX: 48,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 24, y: 0, width: 40, height: 2 },
    { x: 14, y: 3.6, width: 6, height: 0.8, isOneWay: true },
    { x: 34, y: 3.6, width: 6, height: 0.8, isOneWay: true },
    { x: 42, y: 0, width: 12, height: 2 }
  ],
  hazards: [],
  breakables: [],
  enemies: [
    {
      x: 24,
      y: 1.5,
      type: EnemyType.CHARGING_DASHER,
      patrolRange: 10,
      isBoss: true,
      bossHp: 10,
      bossName: 'Meadow Guardian'
    }
  ],
  coins: [
    { x: 4, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 14, y: 4.6, type: PowerUpType.ENERGY_SHIELD },
    { x: 34, y: 4.6, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 8, y: 1.5 }
  ],
  hasBoss: true,
  bossType: EnemyType.CHARGING_DASHER
};
