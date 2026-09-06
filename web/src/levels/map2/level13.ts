import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 13 — "Stalactite Fall"
// Design intent: the map's crumbling-platform showcase. A long chain of
// unstable ledges (isCrumbling stands in for falling cave debris, since the
// engine doesn't have a dedicated falling-rock hazard) over a deep spike
// pit, with almost no room for hesitation. A Time Pulse power-up right
// before the gauntlet gives a fair way through it.
export const level13: LevelConfig = {
  levelNumber: 13,
  mapIndex: 2,
  title: 'Stalactite Fall',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 60,
  goalY: 0,
  boundsX: 68,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 6, height: 2 },
    { x: 23, y: 0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 27.5, y: 0.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 32, y: 0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 36.5, y: 0.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 41, y: 0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 45.5, y: 0.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 52, y: 0, width: 6, height: 2 },
    { x: 60, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 34, y: -3.0, width: 26.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2 }
  ],
  coins: [
    { x: 23, y: 1.1, type: 'COIN' }, { x: 32, y: 1.1, type: 'COIN' }, { x: 41, y: 1.1, type: 'COIN' },
    { x: 52, y: 1.6, type: 'COIN' }, { x: 54, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 16, y: 1.8, type: PowerUpType.TIME_PULSE }
  ],
  checkpoints: [
    { x: 16, y: 1.5 }
  ]
};
