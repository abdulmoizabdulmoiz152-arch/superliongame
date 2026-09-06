import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 4 — "Hidden Grottos"
// Design intent: introduces breakable blocks that hide rewards, one-way
// platforms for a small vertical detour to a secret gem cache, and the
// first Aero Drone (flies a short patrol above a gap).
export const level04: LevelConfig = {
  levelNumber: 4,
  mapIndex: 1,
  title: 'Hidden Grottos',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 68,
  goalY: 1.5,
  boundsX: 76,
  boundsY: 24,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 15, y: 0, width: 10, height: 2 },
    // One-way detour platforms leading up to a secret cache
    { x: 15, y: 3.0, width: 3.0, height: 0.6, isOneWay: true },
    { x: 19, y: 4.6, width: 3.0, height: 0.6, isOneWay: true },
    { x: 30, y: 0, width: 8, height: 2 },
    { x: 42, y: 0.8, width: 5, height: 0.8 },
    { x: 50, y: 0.8, width: 5, height: 0.8 },
    { x: 58, y: 0, width: 8, height: 2 },
    { x: 68, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 46, y: -1.4, width: 6.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [
    { x: 20, y: 1.6, width: 1.2, height: 1.2, rewardType: 'COIN' },
    { x: 21.5, y: 1.6, width: 1.2, height: 1.2, rewardType: PowerUpType.COIN_MAGNET },
    { x: 19, y: 5.6, width: 1.2, height: 1.2, rewardType: 'GEM' }
  ],
  enemies: [
    { x: 46, y: 3.5, type: EnemyType.AERO_DRONE, patrolRange: 4 }
  ],
  coins: [
    { x: 15, y: 1.6, type: 'COIN' }, { x: 17, y: 1.6, type: 'COIN' },
    { x: 30, y: 1.6, type: 'COIN' }, { x: 32, y: 1.6, type: 'COIN' }, { x: 34, y: 1.6, type: 'COIN' },
    { x: 58, y: 1.6, type: 'COIN' }, { x: 60, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [],
  checkpoints: [
    { x: 30, y: 1.5 }
  ]
};
