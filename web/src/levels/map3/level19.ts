import { LevelConfig, MapTheme, EnemyType } from '../../types/game';

// Level 19 — "Grid Runner"
// Design intent: a tower climb told almost entirely through vertically
// moving ("flying") platforms rather than static ledges — the player has
// to time boardings, not just jumps. Aero Drones patrol the gaps between
// tiers.
export const level19: LevelConfig = {
  levelNumber: 19,
  mapIndex: 3,
  title: 'Grid Runner',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 10,
  goalY: 22,
  boundsX: 26,
  boundsY: 30,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 8, y: 3.2, width: 4, height: 0.8, moveRangeY: 2.2, moveSpeed: 1.3 },
    { x: 4, y: 7.5, width: 4, height: 0.8, moveRangeY: 2.2, moveSpeed: 1.6 },
    { x: 10, y: 11.8, width: 4, height: 0.8, moveRangeY: 2.2, moveSpeed: 1.1 },
    { x: 5, y: 16.0, width: 4, height: 0.8 },
    { x: 10, y: 19.0, width: 4, height: 0.8, moveRangeY: 1.8, moveSpeed: 1.4 },
    { x: 10, y: 22, width: 12, height: 2 }
  ],
  hazards: [
    { x: 6, y: -1.6, width: 10.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 4, y: 8.4, type: EnemyType.AERO_DRONE, patrolRange: 2.5 },
    { x: 5, y: 16.9, type: EnemyType.AERO_DRONE, patrolRange: 2.5 }
  ],
  coins: [
    { x: 8, y: 4.2, type: 'COIN' }, { x: 4, y: 8.5, type: 'COIN' },
    { x: 10, y: 12.8, type: 'COIN' }, { x: 5, y: 17.0, type: 'COIN' },
    { x: 10, y: 20.0, type: 'COIN' }
  ],
  gems: [
    { x: 5, y: 17.2, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 5, y: 15.8 }
  ]
};
