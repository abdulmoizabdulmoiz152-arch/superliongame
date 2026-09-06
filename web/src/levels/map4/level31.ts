import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 31 — "The Boiling Core"
// Design intent: the hardest non-boss level in the game. Combines lava,
// pulsing lasers, crumbling ledges, moving platforms in both axes, and
// four enemy types in one long descent-then-climb, ending on a checkpoint
// right outside the final boss gate.
export const level31: LevelConfig = {
  levelNumber: 31,
  mapIndex: 4,
  title: 'The Boiling Core',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 84,
  goalY: 2,
  boundsX: 92,
  boundsY: 26,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 16, y: 0, width: 8, height: 2 },
    { x: 25, y: -0.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 29.5, y: -1.0, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 34, y: -1.5, width: 2.6, height: 0.7, isCrumbling: true },
    { x: 40, y: -2, width: 8, height: 2 },
    { x: 52, y: -1.2, width: 3.2, height: 0.8, moveRangeX: 4.0, moveSpeed: 1.7 },
    { x: 61, y: -0.4, width: 3.2, height: 0.8, moveRangeY: 2.0, moveSpeed: 1.3 },
    { x: 70, y: 0.5, width: 8, height: 2 },
    { x: 84, y: 2, width: 12, height: 2 }
  ],
  hazards: [
    { x: 29, y: -3.5, width: 12.0, height: 1.0, type: 'LAVA' },
    { x: 58, y: -3.5, width: 26.0, height: 1.0, type: 'LAVA' },
    { x: 74, y: 2.5, width: 1.6, height: 4.5, type: 'LASER', laserInterval: 2.0 }
  ],
  breakables: [],
  enemies: [
    { x: 20, y: 1.5, type: EnemyType.SHIELDED_GOLEM, patrolRange: 3 },
    { x: 44, y: -0.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3 },
    { x: 70, y: 1.5, type: EnemyType.CRYSTAL_STALKER, patrolRange: 3 },
    { x: 76, y: 0.5, type: EnemyType.PULSE_TURRET, patrolRange: 0 }
  ],
  coins: [
    { x: 16, y: 1.6, type: 'COIN' }, { x: 18, y: 1.6, type: 'COIN' },
    { x: 40, y: -0.4, type: 'COIN' }, { x: 42, y: -0.4, type: 'COIN' },
    { x: 70, y: 2.6, type: 'COIN' }
  ],
  gems: [
    { x: 61, y: 0.6, type: 'GEM' }
  ],
  powerups: [
    { x: 16, y: 1.8, type: PowerUpType.MEGA_LINE }
  ],
  checkpoints: [
    { x: 70, y: 0.5 }
  ]
};
