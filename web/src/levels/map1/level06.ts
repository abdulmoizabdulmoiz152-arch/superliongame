import { LevelConfig, MapTheme, EnemyType } from '../../types/game';

// Level 6 — "Cloud Stepper"
// Design intent: the map's first real vertical challenge — a tiered climb
// of one-way cloud platforms up the side of a long spike chasm, with a
// mid-climb checkpoint so a fall doesn't send the player back to the start.
export const level06: LevelConfig = {
  levelNumber: 6,
  mapIndex: 1,
  title: 'Cloud Stepper',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 46,
  goalY: 13.5,
  boundsX: 54,
  boundsY: 30,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 14, y: 0, width: 8, height: 2 },
    // Climb begins here, over the chasm
    { x: 20, y: 2.4, width: 3.2, height: 0.6, isOneWay: true },
    { x: 25, y: 4.6, width: 3.2, height: 0.6, isOneWay: true },
    { x: 20, y: 6.8, width: 3.2, height: 0.6, isOneWay: true },
    { x: 27, y: 9.0, width: 3.2, height: 0.6, isOneWay: true },
    { x: 22, y: 11.2, width: 4.0, height: 0.8 },
    { x: 30, y: 13.4, width: 3.2, height: 0.6, isOneWay: true },
    { x: 38, y: 13.4, width: 3.2, height: 0.6 },
    { x: 46, y: 13.5, width: 12, height: 2 }
  ],
  hazards: [
    { x: 25, y: -1.2, width: 26.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 22, y: 11.9, type: EnemyType.AERO_DRONE, patrolRange: 3 }
  ],
  coins: [
    { x: 20, y: 3.4, type: 'COIN' }, { x: 25, y: 5.6, type: 'COIN' },
    { x: 20, y: 7.8, type: 'COIN' }, { x: 27, y: 10.0, type: 'COIN' },
    { x: 30, y: 14.4, type: 'COIN' }, { x: 38, y: 14.4, type: 'COIN' }
  ],
  gems: [
    { x: 22, y: 12.9, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 22, y: 11.7 }
  ]
};
