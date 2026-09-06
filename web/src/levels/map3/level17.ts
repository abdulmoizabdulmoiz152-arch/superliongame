import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 17 — "Neon Horizon"
// Design intent: the map's establishing level. First real use of vertical
// (moveRangeY) flying platforms and pulsing LASER "energy barrier" hazards,
// introduced one at a time on otherwise generous ground so neither reads as
// unfair on first contact. A Pulse Turret watches the rooftop gap.
export const level17: LevelConfig = {
  levelNumber: 17,
  mapIndex: 3,
  title: 'Neon Horizon',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 62,
  goalY: 4.5,
  boundsX: 70,
  boundsY: 24,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 8, height: 2 },
    // First flying (vertical-moving) platform
    { x: 27, y: 2.0, width: 4, height: 0.8, moveRangeY: 2.5, moveSpeed: 1.2 },
    { x: 36, y: 0, width: 8, height: 2 },
    { x: 48, y: 2.4, width: 4, height: 0.8, moveRangeY: 3.0, moveSpeed: 1.0 },
    { x: 56, y: 4.5, width: 6, height: 2 },
    { x: 62, y: 4.5, width: 12, height: 2 }
  ],
  hazards: [
    { x: 21.5, y: -1.4, width: 6.0, height: 1.0, type: 'SPIKES' },
    { x: 42, y: 3.0, width: 1.6, height: 6.0, type: 'LASER', laserInterval: 2.4 }
  ],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 },
    { x: 56, y: 5.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 36, y: 1.6, type: 'COIN' }, { x: 38, y: 1.6, type: 'COIN' },
    { x: 56, y: 5.6, type: 'COIN' }
  ],
  gems: [
    { x: 27, y: 3.1, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 36, y: 1.5 }
  ]
};
