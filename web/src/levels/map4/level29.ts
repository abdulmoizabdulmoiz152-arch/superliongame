import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 29 — "Infernal Ascent"
// Design intent: the map's longest vertical challenge — three distinct
// climbing techniques stacked in sequence (crumbling ledges, then a
// horizontal moving-platform traverse, then a vertical flying-platform
// finish) over a lava floor, with a checkpoint after each third.
export const level29: LevelConfig = {
  levelNumber: 29,
  mapIndex: 4,
  title: 'Infernal Ascent',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 10,
  goalY: 24,
  boundsX: 26,
  boundsY: 32,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 8, y: 2.0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 4, y: 4.0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 8, y: 6.0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 6, y: 8.5, width: 5, height: 1.0 },
    { x: 2, y: 11.5, width: 3.2, height: 0.8, moveRangeX: 3.0, moveSpeed: 1.6 },
    { x: 10, y: 13.5, width: 3.2, height: 0.8, moveRangeX: 3.0, moveSpeed: 1.9 },
    { x: 6, y: 16.0, width: 5, height: 1.0 },
    { x: 6, y: 19.0, width: 4, height: 0.8, moveRangeY: 2.4, moveSpeed: 1.4 },
    { x: 10, y: 22.0, width: 4, height: 0.8, moveRangeY: 1.8, moveSpeed: 1.7 },
    { x: 10, y: 24, width: 12, height: 2 }
  ],
  hazards: [
    { x: 5, y: -1.6, width: 10.0, height: 1.0, type: 'LAVA' }
  ],
  breakables: [],
  enemies: [
    { x: 6, y: 9.4, type: EnemyType.AERO_DRONE, patrolRange: 2.5 },
    { x: 6, y: 16.9, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2 }
  ],
  coins: [
    { x: 8, y: 2.9, type: 'COIN' }, { x: 4, y: 4.9, type: 'COIN' }, { x: 8, y: 6.9, type: 'COIN' },
    { x: 2, y: 12.5, type: 'COIN' }, { x: 10, y: 14.5, type: 'COIN' },
    { x: 6, y: 20.0, type: 'COIN' }, { x: 10, y: 23.0, type: 'COIN' }
  ],
  gems: [
    { x: 6, y: 17.2, type: 'GEM' }
  ],
  powerups: [
    { x: 6, y: 8.8, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 6, y: 8.3 },
    { x: 6, y: 15.8 }
  ]
};
