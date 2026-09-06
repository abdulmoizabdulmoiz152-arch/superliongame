import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 9 — "Shimmering Descent"
// Design intent: the map's establishing level — a gentle downward path
// introducing the slow, tanky Shielded Golem on open ground and a first
// moving platform over a spike-lined crevice. Deliberately easier than
// Map 1's finale so the difficulty curve resets at the start of a new map.
export const level09: LevelConfig = {
  levelNumber: 9,
  mapIndex: 2,
  title: 'Shimmering Descent',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 60,
  goalY: -3.5,
  boundsX: 68,
  boundsY: 26,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 15, y: -1.0, width: 8, height: 2 },
    { x: 27, y: -1.0, width: 3.4, height: 0.8, moveRangeX: 3.0, moveSpeed: 1.3 },
    { x: 35, y: -2.2, width: 8, height: 2 },
    { x: 47, y: -2.2, width: 6, height: 2 },
    { x: 54, y: -3.5, width: 6, height: 2 },
    { x: 60, y: -3.5, width: 12, height: 2 }
  ],
  hazards: [
    { x: 24, y: -3.0, width: 8.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 19, y: -0.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 3 },
    { x: 47, y: -1.2, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 }
  ],
  coins: [
    { x: 15, y: -0.4, type: 'COIN' }, { x: 17, y: -0.4, type: 'COIN' },
    { x: 35, y: -1.6, type: 'COIN' }, { x: 37, y: -1.6, type: 'COIN' }, { x: 39, y: -1.6, type: 'COIN' },
    { x: 54, y: -2.9, type: 'COIN' }
  ],
  gems: [
    { x: 27, y: 0.4, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 35, y: -1.5 }
  ]
};
