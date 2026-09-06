import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 3 — "Bouncing Bridges"
// Design intent: first enemy encounter (a slow patrolling Spiky Roller on
// open ground, easy to jump over or avoid) followed by a moving-platform
// bridge over a spike hazard. Ends with a second, faster roller guarding the
// goal platform.
export const level03: LevelConfig = {
  levelNumber: 3,
  mapIndex: 1,
  title: 'Bouncing Bridges',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 64,
  goalY: 1.5,
  boundsX: 72,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 14, height: 2 },
    // Two moving platforms shuttling over a hazard gap
    { x: 36, y: 1.2, width: 3.4, height: 0.8, moveRangeX: 2.5, moveSpeed: 1.4 },
    { x: 44, y: 1.2, width: 3.4, height: 0.8, moveRangeX: 2.5, moveSpeed: 1.8 },
    { x: 52, y: 0, width: 8, height: 2 },
    { x: 64, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 40, y: -1.2, width: 12.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 22, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 5 },
    { x: 58, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 }
  ],
  coins: [
    { x: 17, y: 1.6, type: 'COIN' }, { x: 19, y: 1.6, type: 'COIN' }, { x: 21, y: 1.6, type: 'COIN' },
    { x: 36, y: 2.3, type: 'COIN' }, { x: 44, y: 2.3, type: 'COIN' },
    { x: 52, y: 1.6, type: 'COIN' }, { x: 54, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 16, y: 3.8, type: 'GEM' }
  ],
  powerups: [
    { x: 52, y: 1.8, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 52, y: 1.5 }
  ]
};
