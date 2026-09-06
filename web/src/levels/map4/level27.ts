import { LevelConfig, MapTheme, EnemyType } from '../../types/game';

// Level 27 — "Obsidian Crags"
// Design intent: a vertical climb up a lava chimney using vertically
// moving obsidian ledges (moveRangeY), similar in shape to Map 3's tower
// but with a lethal floor instead of a spike pit, and a Crystal Stalker
// pacing one of the static rest platforms.
export const level27: LevelConfig = {
  levelNumber: 27,
  mapIndex: 4,
  title: 'Obsidian Crags',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 8,
  goalY: 20,
  boundsX: 24,
  boundsY: 28,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 6, y: 3.5, width: 4, height: 0.8, moveRangeY: 2.2, moveSpeed: 1.3 },
    { x: 2, y: 7.8, width: 4, height: 0.8, moveRangeY: 2.2, moveSpeed: 1.6 },
    { x: 8, y: 11.5, width: 5, height: 1.0 },
    { x: 3, y: 15.2, width: 4, height: 0.8, moveRangeY: 2.4, moveSpeed: 1.1 },
    { x: 8, y: 18.0, width: 4, height: 0.8, moveRangeY: 1.8, moveSpeed: 1.5 },
    { x: 8, y: 20, width: 12, height: 2 }
  ],
  hazards: [
    { x: 4, y: -1.6, width: 10.0, height: 1.0, type: 'LAVA' }
  ],
  breakables: [],
  enemies: [
    { x: 8, y: 12.4, type: EnemyType.CRYSTAL_STALKER, patrolRange: 2 }
  ],
  coins: [
    { x: 6, y: 4.5, type: 'COIN' }, { x: 2, y: 8.8, type: 'COIN' },
    { x: 8, y: 12.5, type: 'COIN' }, { x: 3, y: 16.2, type: 'COIN' }, { x: 8, y: 19.0, type: 'COIN' }
  ],
  gems: [
    { x: 8, y: 12.7, type: 'GEM' }
  ],
  powerups: [],
  checkpoints: [
    { x: 8, y: 11.3 }
  ]
};
