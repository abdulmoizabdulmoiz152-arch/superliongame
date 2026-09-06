import { LevelConfig, MapTheme, EnemyType } from '../../types/game';

// Level 10 — "Echo Chamber"
// Design intent: introduces the Crystal Stalker (a faster ground patroller)
// inside a tall, narrow vertical shaft. The chamber zig-zags upward across
// one-way ledges rather than a straight climb, forcing left-right reads
// under time pressure from the stalker below.
export const level10: LevelConfig = {
  levelNumber: 10,
  mapIndex: 2,
  title: 'Echo Chamber',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 8,
  goalY: 18,
  boundsX: 24,
  boundsY: 26,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 6, y: 2.4, width: 3.0, height: 0.6, isOneWay: true },
    { x: 1, y: 4.8, width: 3.0, height: 0.6, isOneWay: true },
    { x: 7, y: 7.2, width: 3.0, height: 0.6, isOneWay: true },
    { x: 2, y: 9.6, width: 3.0, height: 0.6, isOneWay: true },
    { x: 8, y: 12.0, width: 4.0, height: 0.8 },
    { x: 3, y: 14.4, width: 3.0, height: 0.6, isOneWay: true },
    { x: 8, y: 16.8, width: 3.0, height: 0.6, isOneWay: true },
    { x: 8, y: 18, width: 10, height: 2 }
  ],
  hazards: [
    { x: 4, y: -1.6, width: 8.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 4, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 3.5 },
    { x: 8, y: 12.8, type: EnemyType.CRYSTAL_STALKER, patrolRange: 3 }
  ],
  coins: [
    { x: 6, y: 3.4, type: 'COIN' }, { x: 1, y: 5.8, type: 'COIN' },
    { x: 7, y: 8.2, type: 'COIN' }, { x: 2, y: 10.6, type: 'COIN' },
    { x: 3, y: 15.4, type: 'COIN' }, { x: 8, y: 17.8, type: 'COIN' }
  ],
  gems: [
    { x: 8, y: 13.0, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 8, y: 12.5 }
  ]
};
