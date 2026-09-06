import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 5 — "Wind Runner"
// Design intent: a longer, faster-paced sprint level with more enemy
// density than anything before it — alternating ground rollers and aerial
// drones along a mostly-flat run, rewarded with a Speed Spark near the
// start to lean into the "runner" feel.
export const level05: LevelConfig = {
  levelNumber: 5,
  mapIndex: 1,
  title: 'Wind Runner',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 84,
  goalY: 1.5,
  boundsX: 92,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 15, y: 0, width: 40, height: 2 },
    { x: 40, y: 2.2, width: 4, height: 0.8 },
    { x: 60, y: 0, width: 14, height: 2 },
    { x: 78, y: 0.4, width: 5, height: 0.8 },
    { x: 84, y: 0, width: 16, height: 2 }
  ],
  hazards: [],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 4 },
    { x: 30, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 4 },
    { x: 40, y: 3.3, type: EnemyType.AERO_DRONE, patrolRange: 3 },
    { x: 50, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 5 },
    { x: 66, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 4 },
    { x: 78, y: 1.5, type: EnemyType.AERO_DRONE, patrolRange: 3 }
  ],
  coins: [
    { x: 6, y: 1.6, type: 'COIN' },
    { x: 17, y: 1.6, type: 'COIN' }, { x: 23, y: 1.6, type: 'COIN' }, { x: 27, y: 1.6, type: 'COIN' },
    { x: 33, y: 1.6, type: 'COIN' }, { x: 44, y: 1.6, type: 'COIN' }, { x: 48, y: 1.6, type: 'COIN' },
    { x: 60, y: 1.6, type: 'COIN' }, { x: 64, y: 1.6, type: 'COIN' }, { x: 70, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 40, y: 3.4, type: 'GEM' }
  ],
  powerups: [
    { x: 3, y: 1.8, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 60, y: 1.5 }
  ]
};
