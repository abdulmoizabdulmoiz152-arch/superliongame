import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 7 — "Sunset Ridge"
// Design intent: the pre-boss gauntlet. Combines everything Map 1 has
// taught — moving platforms, crumbling platforms, breakables, one-way
// climbs, both enemy types — into one longer, denser level, ending with a
// checkpoint right before the boss gate.
export const level07: LevelConfig = {
  levelNumber: 7,
  mapIndex: 1,
  title: 'Sunset Ridge',
  theme: MapTheme.SKYLINE_MEADOWS,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 90,
  goalY: 1.5,
  boundsX: 98,
  boundsY: 26,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 10, height: 2 },
    // Crumbling stretch over spikes
    { x: 25, y: 0, width: 2.6, height: 0.8, isCrumbling: true },
    { x: 29, y: 0, width: 2.6, height: 0.8, isCrumbling: true },
    { x: 33, y: 0, width: 2.6, height: 0.8, isCrumbling: true },
    { x: 39, y: 0, width: 8, height: 2 },
    // Moving platform bridge, higher up
    { x: 51, y: 1.5, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 2.0 },
    { x: 60, y: 1.5, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 2.4 },
    { x: 68, y: 0, width: 8, height: 2 },
    // One-way climb to a breakable cache
    { x: 68, y: 2.6, width: 3.0, height: 0.6, isOneWay: true },
    { x: 72, y: 4.4, width: 3.0, height: 0.6, isOneWay: true },
    { x: 80, y: 0, width: 10, height: 2 },
    { x: 90, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 29, y: -1.6, width: 12.0, height: 1.0, type: 'SPIKES' },
    { x: 55, y: -1.6, width: 18.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [
    { x: 72, y: 5.4, width: 1.2, height: 1.2, rewardType: PowerUpType.ENERGY_SHIELD },
    { x: 73.4, y: 5.4, width: 1.2, height: 1.2, rewardType: 'GEM' }
  ],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 },
    { x: 43, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3 },
    { x: 51, y: 2.6, type: EnemyType.AERO_DRONE, patrolRange: 4 },
    { x: 84, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 4 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 39, y: 1.6, type: 'COIN' }, { x: 41, y: 1.6, type: 'COIN' }, { x: 43, y: 1.6, type: 'COIN' },
    { x: 68, y: 1.6, type: 'COIN' },
    { x: 80, y: 1.6, type: 'COIN' }, { x: 82, y: 1.6, type: 'COIN' }, { x: 84, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 39, y: 1.8, type: PowerUpType.MEGA_LINE }
  ],
  checkpoints: [
    { x: 80, y: 1.5 }
  ]
};
