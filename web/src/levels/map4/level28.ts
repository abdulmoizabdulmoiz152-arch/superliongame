import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 28 — "Fiery Gauntlet"
// Design intent: the map's advanced-combination showcase — Shielded Golem,
// Pulse Turret and Crystal Stalker together over lava, plus pulsing LASER
// hazards reflavored as vent geysers (now genuinely toggling on/off per
// the LevelManager fix, not a permanent wall).
export const level28: LevelConfig = {
  levelNumber: 28,
  mapIndex: 4,
  title: 'Fiery Gauntlet',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 66,
  goalY: 1.5,
  boundsX: 74,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 14, y: 0, width: 40, height: 2 },
    { x: 24, y: 4.5, width: 4, height: 1.0 },
    { x: 44, y: 4.5, width: 4, height: 1.0 },
    { x: 58, y: 0, width: 8, height: 2 },
    { x: 66, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 30, y: 2.4, width: 1.6, height: 4.4, type: 'LASER', laserInterval: 1.6 },
    { x: 38, y: 2.4, width: 1.6, height: 4.4, type: 'LASER', laserInterval: 2.1 },
    { x: 53, y: -1.6, width: 4.0, height: 1.0, type: 'LAVA' }
  ],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 },
    { x: 24, y: 5.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 34, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2.5 },
    { x: 44, y: 5.4, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 50, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 }
  ],
  coins: [
    { x: 14, y: 1.6, type: 'COIN' }, { x: 16, y: 1.6, type: 'COIN' },
    { x: 58, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 24, y: 5.6, type: 'GEM' }, { x: 44, y: 5.6, type: 'GEM' }
  ],
  powerups: [
    { x: 14, y: 1.8, type: PowerUpType.ENERGY_SHIELD }
  ],
  checkpoints: [
    { x: 58, y: 1.5 }
  ]
};
