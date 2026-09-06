import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 23 — "Hologram Heights"
// Design intent: the map's hardest non-boss level, combining flying
// platforms, lasers, crumbling ledges, and every enemy type introduced so
// far into one longer ascent, ending on a checkpoint right outside the
// boss core.
export const level23: LevelConfig = {
  levelNumber: 23,
  mapIndex: 3,
  title: 'Hologram Heights',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 20,
  goalY: 20,
  boundsX: 34,
  boundsY: 28,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 14, y: 0, width: 6, height: 2 },
    { x: 14, y: 4.5, width: 3.6, height: 0.8, moveRangeY: 2.5, moveSpeed: 1.4 },
    { x: 8, y: 8.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 13, y: 8.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 18, y: 8.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 20, y: 12.5, width: 6, height: 1.2 },
    { x: 20, y: 16.5, width: 3.6, height: 0.8, moveRangeY: 2.0, moveSpeed: 1.7 },
    { x: 20, y: 20, width: 12, height: 2 }
  ],
  hazards: [
    { x: 10, y: -1.6, width: 8.0, height: 1.0, type: 'SPIKES' },
    { x: 24, y: 9.5, width: 1.4, height: 5.0, type: 'LASER', laserInterval: 2.0 }
  ],
  breakables: [],
  enemies: [
    { x: 16, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3 },
    { x: 20, y: 13.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 8, y: 9.4, type: EnemyType.AERO_DRONE, patrolRange: 2.5 },
    { x: 20, y: 21.0, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 }
  ],
  coins: [
    { x: 14, y: 1.6, type: 'COIN' },
    { x: 8, y: 9.5, type: 'COIN' }, { x: 13, y: 9.5, type: 'COIN' }, { x: 18, y: 9.5, type: 'COIN' },
    { x: 20, y: 13.6, type: 'COIN' }
  ],
  gems: [
    { x: 20, y: 13.8, type: 'GEM' }
  ],
  powerups: [
    { x: 14, y: 5.5, type: PowerUpType.MEGA_LINE }
  ],
  checkpoints: [
    { x: 20, y: 12.3 }
  ]
};
