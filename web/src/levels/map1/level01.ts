import { LevelConfig, MapTheme } from '../../types/game';

// Level 1 — "First Flight"
// Design intent: pure tutorial. Teaches running and single jumps over small,
// forgiving gaps on flat ground. No enemies, no hazards. A checkpoint sits
// roughly at the midpoint so a fall still feels low-stakes.
export const level01: LevelConfig = {
  levelNumber: 1,
  mapIndex: 1,
  title: 'First Flight',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 62,
  goalY: 1.5,
  boundsX: 70,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 14, y: 0, width: 8, height: 2 },
    { x: 26.5, y: 0, width: 9, height: 2 },
    { x: 38, y: 0, width: 8, height: 2 },
    { x: 46.5, y: 0.6, width: 5, height: 0.8 },
    { x: 54, y: 0, width: 8, height: 2 },
    { x: 62, y: 0, width: 10, height: 2 }
  ],
  hazards: [],
  breakables: [],
  enemies: [],
  coins: [
    { x: 2, y: 1.6, type: 'COIN' }, { x: 4, y: 1.6, type: 'COIN' }, { x: 6, y: 1.6, type: 'COIN' },
    { x: 14, y: 1.6, type: 'COIN' }, { x: 16, y: 1.6, type: 'COIN' },
    { x: 26.5, y: 1.6, type: 'COIN' }, { x: 29, y: 1.6, type: 'COIN' },
    { x: 46.5, y: 2.2, type: 'COIN' },
    { x: 54, y: 1.6, type: 'COIN' }, { x: 56, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 38, y: 3.2, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 38, y: 1.5 }
  ]
};
