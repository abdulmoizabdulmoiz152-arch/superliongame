import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 21 — "Pulse Generator"
// Design intent: the map's laser showcase — four energy-barrier lasers with
// staggered intervals across a single long room, requiring the player to
// read and thread multiple independent timings rather than one at a time.
export const level21: LevelConfig = {
  levelNumber: 21,
  mapIndex: 3,
  title: 'Pulse Generator',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 66,
  goalY: 1.5,
  boundsX: 74,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 52, height: 2 },
    { x: 66, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 22, y: 2.5, width: 1.6, height: 5.0, type: 'LASER', laserInterval: 1.8 },
    { x: 32, y: 2.5, width: 1.6, height: 5.0, type: 'LASER', laserInterval: 2.3 },
    { x: 42, y: 2.5, width: 1.6, height: 5.0, type: 'LASER', laserInterval: 2.8 },
    { x: 52, y: 2.5, width: 1.6, height: 5.0, type: 'LASER', laserInterval: 3.3 }
  ],
  breakables: [],
  enemies: [
    { x: 27, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2 },
    { x: 47, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2 }
  ],
  coins: [
    { x: 18, y: 1.6, type: 'COIN' }, { x: 37, y: 1.6, type: 'COIN' }, { x: 57, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 42, y: 1.8, type: 'GEM' }
  ],
  powerups: [
    { x: 16, y: 1.8, type: PowerUpType.TIME_PULSE }
  ],
  checkpoints: [
    { x: 37, y: 1.5 }
  ]
};
