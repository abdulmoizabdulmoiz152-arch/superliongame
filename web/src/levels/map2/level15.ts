import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 15 — "Deep Resonance"
// Design intent: the map's hardest non-boss level, combining crumbling
// ledges, moving platforms, a turret, and both ground enemy types in one
// longer descent, ending on a checkpoint right outside the boss chamber.
export const level15: LevelConfig = {
  levelNumber: 15,
  mapIndex: 2,
  title: 'Deep Resonance',
  theme: MapTheme.CRYSTAL_CAVES,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 78,
  goalY: -4,
  boundsX: 86,
  boundsY: 26,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 8, height: 2 },
    { x: 27, y: -0.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 31.5, y: -1.0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 36, y: -1.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 42, y: -2, width: 8, height: 2 },
    { x: 54, y: -2, width: 3.2, height: 0.8, moveRangeX: 4.5, moveSpeed: 1.8 },
    { x: 64, y: -2, width: 6, height: 2 },
    { x: 64, y: 2.0, width: 4, height: 1.2 },
    { x: 72, y: -4, width: 6, height: 2 },
    { x: 78, y: -4, width: 12, height: 2 }
  ],
  hazards: [
    { x: 31, y: -3.5, width: 12.0, height: 1.0, type: 'SPIKES' },
    { x: 58, y: -3.5, width: 10.0, height: 1.0, type: 'SPIKES' }
  ],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 3 },
    { x: 45, y: -0.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 3 },
    { x: 64, y: 2.9, type: EnemyType.PULSE_TURRET, patrolRange: 0 },
    { x: 68, y: -2, type: EnemyType.SHIELDED_GOLEM, patrolRange: 2.5 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 42, y: -0.4, type: 'COIN' }, { x: 44, y: -0.4, type: 'COIN' }, { x: 46, y: -0.4, type: 'COIN' },
    { x: 72, y: -3.4, type: 'COIN' }
  ],
  gems: [
    { x: 64, y: 3.1, type: 'GEM' }
  ],
  powerups: [
    { x: 16, y: 1.8, type: PowerUpType.MEGA_LINE }
  ],
  checkpoints: [
    { x: 72, y: -4 }
  ]
};
