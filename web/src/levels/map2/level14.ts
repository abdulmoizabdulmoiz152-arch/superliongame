import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 14 — "Prismatic Path"
// Design intent: first appearance of the Pulse Turret, placed on ledges
// overlooking a moving-platform crossing so its projectile fire and the
// platform timing have to be read together, not solved separately. A
// stalker guards the landing zone on the far side.
export const level14: LevelConfig = {
  levelNumber: 14,
  mapIndex: 2,
  title: 'Prismatic Path',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 70,
  goalY: 2.5,
  boundsX: 78,
  boundsY: 24,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 6, height: 2 },
    { x: 16, y: 5.0, width: 4, height: 1.2 },
    { x: 27, y: 0.6, width: 3.2, height: 0.8, moveRangeX: 4.0, moveSpeed: 1.5 },
    { x: 37, y: 1.2, width: 3.2, height: 0.8, moveRangeX: 4.0, moveSpeed: 1.9 },
    { x: 47, y: 1.8, width: 3.2, height: 0.8, moveRangeX: 4.0, moveSpeed: 2.2 },
    { x: 55, y: 2.5, width: 4, height: 1.2 },
    { x: 55, y: 6.5, width: 4, height: 1.2 },
    { x: 62, y: 2.5, width: 6, height: 2 },
    { x: 70, y: 2.5, width: 12, height: 2 }
  ],
  hazards: [
    { x: 30, y: -1.6, width: 24.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 16, y: 5.9, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 55, y: 7.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 64, y: 2.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2.5 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 27, y: 1.7, type: 'COIN' }, { x: 37, y: 2.3, type: 'COIN' }, { x: 47, y: 2.9, type: 'COIN' },
    { x: 62, y: 3.6, type: 'COIN' }
  ],
  gems: [
    { x: 55, y: 3.6, type: 'GEM' }
  ],
  powerups: [
    { x: 55, y: 3.8, type: PowerUpType.ENERGY_SHIELD }
  ],
  checkpoints: [
    { x: 55, y: 2.5 }
  ]
};
