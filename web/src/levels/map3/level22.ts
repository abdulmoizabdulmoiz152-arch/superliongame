import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 22 — "Laser Alley"
// Design intent: a tight corridor (short platforms, no wide runways) where
// alternating-interval lasers and a Crystal Stalker share the same narrow
// space, so dodging one often means stepping toward the other. The
// hardest non-gauntlet level in the map.
export const level22: LevelConfig = {
  levelNumber: 22,
  mapIndex: 3,
  title: 'Laser Alley',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 58,
  goalY: 1.5,
  boundsX: 66,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 12, y: 0, width: 5, height: 2 },
    { x: 21, y: 0, width: 5, height: 2 },
    { x: 30, y: 0, width: 5, height: 2 },
    { x: 39, y: 0, width: 5, height: 2 },
    { x: 48, y: 0, width: 5, height: 2 },
    { x: 58, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 16.5, y: 2.5, width: 1.4, height: 5.0, type: 'LASER', laserInterval: 1.6 },
    { x: 25.5, y: 2.5, width: 1.4, height: 5.0, type: 'LASER', laserInterval: 2.0 },
    { x: 34.5, y: 2.5, width: 1.4, height: 5.0, type: 'LASER', laserInterval: 1.4 },
    { x: 43.5, y: 2.5, width: 1.4, height: 5.0, type: 'LASER', laserInterval: 2.2 },
    { x: 30, y: -1.6, width: 4.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 21, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2 },
    { x: 39, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2 }
  ],
  coins: [
    { x: 12, y: 1.6, type: 'COIN' }, { x: 48, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 12, y: 1.8, type: PowerUpType.ENERGY_SHIELD }
  ],
  checkpoints: [
    { x: 30, y: 1.5 }
  ]
};
