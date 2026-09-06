import { LevelConfig, MapTheme, EnemyType } from '../../types/game';

// Level 12 — "Luminescent Labyrinth"
// Design intent: a genuine fork. After the second platform the path splits
// into a low route (flat, hazard-lined, enemy-heavy) and a high route
// (one-way ledges, fewer enemies, tighter jumps) that rejoin before the
// goal. Different risk/reward, not just a cosmetic branch.
export const level12: LevelConfig = {
  levelNumber: 12,
  mapIndex: 2,
  title: 'Luminescent Labyrinth',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 76,
  goalY: 1.5,
  boundsX: 84,
  boundsY: 26,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 8, height: 2 },
    // Low route
    { x: 26, y: 0, width: 6, height: 2 },
    { x: 36, y: 0, width: 6, height: 2 },
    { x: 46, y: 0, width: 6, height: 2 },
    // High route (one-way ledges above the low route)
    { x: 26, y: 4.5, width: 3.0, height: 0.6, isOneWay: true },
    { x: 32, y: 6.0, width: 3.0, height: 0.6, isOneWay: true },
    { x: 38, y: 6.0, width: 3.0, height: 0.6, isOneWay: true },
    { x: 44, y: 4.5, width: 3.0, height: 0.6, isOneWay: true },
    // Rejoin
    { x: 56, y: 0, width: 10, height: 2 },
    { x: 76, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 31, y: -1.5, width: 5.0, height: 1.0, type: 'SPIKES' },
    { x: 41, y: -1.5, width: 5.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 26, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 },
    { x: 36, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2.5 },
    { x: 46, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 },
    { x: 35, y: 6.9, type: EnemyType.AERO_DRONE, patrolRange: 3 }
  ],
  coins: [
    { x: 26, y: 5.5, type: 'COIN' }, { x: 32, y: 7.0, type: 'COIN' },
    { x: 38, y: 7.0, type: 'COIN' }, { x: 44, y: 5.5, type: 'COIN' },
    { x: 56, y: 1.6, type: 'COIN' }, { x: 58, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 32, y: 7.2, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 56, y: 1.5 }
  ]
};
