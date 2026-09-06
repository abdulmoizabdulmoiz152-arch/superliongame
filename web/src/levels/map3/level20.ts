import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 20 — "Rooftop Rush"
// Design intent: crumbling rooftop hopping (isCrumbling) across a skyline
// gap, with two Pulse Turrets positioned to cross-fire the crumbling
// stretch — the platforms themselves aren't the only pressure, the player
// has to keep moving through turret fire too.
export const level20: LevelConfig = {
  levelNumber: 20,
  mapIndex: 3,
  title: 'Rooftop Rush',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 62,
  goalY: 1.5,
  boundsX: 70,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 6, height: 2 },
    { x: 16, y: 5.5, width: 3, height: 1.0 },
    { x: 24, y: 0.4, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 28.5, y: 0.4, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 33, y: 0.4, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 37.5, y: 0.4, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 42, y: 0.4, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 42, y: 5.5, width: 3, height: 1.0 },
    { x: 50, y: 0, width: 6, height: 2 },
    { x: 62, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 33, y: -2.0, width: 20.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 16, y: 6.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 42, y: 6.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 54, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 }
  ],
  coins: [
    { x: 24, y: 1.4, type: 'COIN' }, { x: 33, y: 1.4, type: 'COIN' }, { x: 42, y: 1.4, type: 'COIN' },
    { x: 50, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 16, y: 6.7, type: PowerUpType.ENERGY_SHIELD }
  ],
  checkpoints: [
    { x: 50, y: 1.5 }
  ]
};
