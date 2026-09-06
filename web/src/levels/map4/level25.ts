import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 25 — "Ash & Cinder"
// Design intent: the map's establishing level, deliberately reset in
// difficulty like the start of every previous map. First appearance of
// LAVA hazards (now visually distinct — hot orange glow vs. spike red)
// on otherwise generous platforms, with a familiar roller/dasher combo.
export const level25: LevelConfig = {
  levelNumber: 25,
  mapIndex: 4,
  title: 'Ash & Cinder',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 62,
  goalY: 1.5,
  boundsX: 70,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 8, height: 2 },
    { x: 28, y: 0, width: 6, height: 2 },
    { x: 40, y: 0, width: 6, height: 2 },
    { x: 52, y: 0, width: 6, height: 2 },
    { x: 62, y: 0, width: 12, height: 2 }
  ],
  hazards: [
    { x: 22, y: -1.4, width: 4.0, height: 1.0, type: 'LAVA' },
    { x: 34, y: -1.4, width: 4.0, height: 1.0, type: 'LAVA' },
    { x: 46, y: -1.4, width: 4.0, height: 1.0, type: 'LAVA' }
  ],
  breakables: [],
  enemies: [
    { x: 16, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 },
    { x: 40, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3 },
    { x: 52, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 2.5 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 28, y: 1.6, type: 'COIN' },
    { x: 52, y: 1.6, type: 'COIN' }, { x: 54, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 28, y: 2.6, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 28, y: 1.5 }
  ]
};
