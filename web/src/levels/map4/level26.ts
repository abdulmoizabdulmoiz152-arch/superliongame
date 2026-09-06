import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 26 — "Magma Flow"
// Design intent: a single wide lava river crossed entirely by moving
// platforms (now correctly synced between mesh, collision, and the hero's
// carry velocity — see the LevelManager fix). No solid ground under the
// whole middle third of the level; commit to the crossing or fall.
export const level26: LevelConfig = {
  levelNumber: 26,
  mapIndex: 4,
  title: 'Magma Flow',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 66,
  goalY: 1.5,
  boundsX: 74,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 6, height: 2 },
    { x: 26, y: 1.0, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 1.4 },
    { x: 35, y: 1.0, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 1.7 },
    { x: 44, y: 1.0, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 2.0 },
    { x: 53, y: 1.0, width: 3.4, height: 0.8, moveRangeX: 3.5, moveSpeed: 1.5 },
    { x: 60, y: 0, width: 6, height: 2 },
    { x: 66, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 40, y: -1.6, width: 30.0, height: 1.0, type: 'LAVA' }
  ],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 2.5 },
    { x: 35, y: 3.0, type: EnemyType.AERO_DRONE, patrolRange: 3.5 },
    { x: 62, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' },
    { x: 26, y: 2.1, type: 'COIN' }, { x: 44, y: 2.1, type: 'COIN' }, { x: 53, y: 2.1, type: 'COIN' },
    { x: 60, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 16, y: 1.8, type: PowerUpType.ENERGY_SHIELD }
  ],
  checkpoints: [
    { x: 16, y: 1.5 }
  ]
};
