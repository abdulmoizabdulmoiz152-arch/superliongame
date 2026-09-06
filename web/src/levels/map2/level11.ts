import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 11 — "Geode Grotto"
// Design intent: a mostly-easy main path with an optional hidden branch —
// a one-way ledge tucked behind the third platform leads to a small
// breakable-geode vault stacked with gems and a power-up, guarded by a
// single stalker. Skippable entirely for a speedrun-style path.
export const level11: LevelConfig = {
  levelNumber: 11,
  mapIndex: 2,
  title: 'Geode Grotto',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 66,
  goalY: 1.5,
  boundsX: 74,
  boundsY: 24,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 10, height: 2 },
    // Hidden branch: one-way ledge tucked above the main path
    { x: 16, y: 3.4, width: 3.5, height: 0.6, isOneWay: true },
    { x: 21, y: 5.2, width: 6.0, height: 1.0 },
    { x: 34, y: 0, width: 8, height: 2 },
    { x: 46, y: 0, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 1.6 },
    { x: 54, y: 0, width: 8, height: 2 },
    { x: 66, y: 0, width: 12, height: 2 }
  ],
  hazards: [],
  breakables: [
    { x: 19, y: 6.2, width: 1.2, height: 1.2, rewardType: 'GEM' },
    { x: 20.5, y: 6.2, width: 1.2, height: 1.2, rewardType: 'GEM' },
    { x: 22, y: 6.2, width: 1.2, height: 1.2, rewardType: PowerUpType.COIN_MAGNET }
  ],
  enemies: [
    { x: 21, y: 6.2, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2 },
    { x: 38, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 3 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 34, y: 1.6, type: 'COIN' }, { x: 36, y: 1.6, type: 'COIN' },
    { x: 54, y: 1.6, type: 'COIN' }, { x: 56, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [],
  checkpoints: [
    { x: 54, y: 1.5 }
  ]
};
