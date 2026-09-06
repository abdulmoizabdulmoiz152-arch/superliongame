import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 24 — "Core Infiltration" (Map 3 Boss)
// Design intent: unlike Map 1's melee charge-boss and Map 2's slow
// attritional golem, the Core Sentinel (NEON_MECHA) already has its own
// bespoke ranged AI in the enemy system — it weaves side to side and
// fires projectile bursts rather than chasing on foot. The arena is built
// around that: wide and open with elevated side platforms as dodge routes
// for the projectile bursts, no ground hazards competing for attention.
export const level24: LevelConfig = {
  levelNumber: 24,
  mapIndex: 3,
  title: 'Core Infiltration',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 50,
  goalY: 1.5,
  boundsX: 56,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 22, y: 0, width: 34, height: 2 },
    { x: 14, y: 4.0, width: 5, height: 0.8, isOneWay: true },
    { x: 32, y: 4.0, width: 5, height: 0.8, isOneWay: true },
    { x: 50, y: 0, width: 12, height: 2 }
  ],
  hazards: [],
  breakables: [],
  enemies: [
    {
      x: 22,
      y: 1.5,
      type: EnemyType.NEON_MECHA,
      patrolRange: 14,
      isBoss: true,
      bossHp: 16,
      bossName: 'Core Sentinel'
    }
  ],
  coins: [
    { x: 4, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 14, y: 5.0, type: PowerUpType.ENERGY_SHIELD },
    { x: 32, y: 5.0, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 8, y: 1.5 }
  ],
  hasBoss: true,
  bossType: EnemyType.NEON_MECHA
};
