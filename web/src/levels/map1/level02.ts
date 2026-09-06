import { LevelConfig, MapTheme } from '../../types/game';

// Level 2 — "Gentle Slopes"
// Design intent: introduce the double jump over a real gap with a hazard pit
// beneath it, then a rolling terrace climb. Still no active enemies — the
// challenge is entirely platforming.
export const level02: LevelConfig = {
  levelNumber: 2,
  mapIndex: 1,
  title: 'Gentle Slopes',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 66,
  goalY: 4.5,
  boundsX: 74,
  boundsY: 24,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 13, y: 0, width: 6, height: 2 },
    // Wide gap requiring the double jump
    { x: 28, y: 0.5, width: 7, height: 2 },
    { x: 37, y: 1.6, width: 4.5, height: 0.8 },
    { x: 45, y: 2.8, width: 4.5, height: 0.8 },
    { x: 53, y: 4.0, width: 4.5, height: 0.8 },
    { x: 61, y: 4.5, width: 6, height: 2 },
    { x: 66, y: 4.5, width: 10, height: 2 }
  ],
  hazards: [
    { x: 20.5, y: -1.0, width: 9.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [],
  coins: [
    { x: 13, y: 1.6, type: 'COIN' }, { x: 15, y: 1.6, type: 'COIN' },
    { x: 37, y: 2.7, type: 'COIN' },
    { x: 45, y: 3.9, type: 'COIN' },
    { x: 53, y: 5.1, type: 'COIN' },
    { x: 61, y: 6.1, type: 'COIN' }
  ],
  gems: [
    { x: 28, y: 2.6, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 28, y: 2.0 }
  ]
};
