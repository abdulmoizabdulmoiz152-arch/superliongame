import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 18 — "Data Stream Highway"
// Design intent: the map's speed level — a long, mostly-flat highway with
// the densest enemy combination yet (rollers and chargers interleaved),
// leaning on the spec's "faster sequences" note rather than new mechanics.
export const level18: LevelConfig = {
  levelNumber: 18,
  mapIndex: 3,
  title: 'Data Stream Highway',
  theme: MapTheme.CYBER_SKY_CITY,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 88,
  goalY: 1.5,
  boundsX: 96,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 10, height: 2 },
    { x: 15, y: 0, width: 44, height: 2 },
    { x: 44, y: 2.2, width: 4, height: 0.8 },
    { x: 63, y: 0, width: 16, height: 2 },
    { x: 88, y: 0, width: 16, height: 2 }
  ],
  hazards: [],
  breakables: [],
  enemies: [
    { x: 19, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 },
    { x: 26, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 4 },
    { x: 34, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 },
    { x: 44, y: 3.3, type: EnemyType.AERO_DRONE, patrolRange: 3 },
    { x: 52, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 4 },
    { x: 67, y: 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 },
    { x: 74, y: 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3 }
  ],
  coins: [
    { x: 6, y: 1.6, type: 'COIN' },
    { x: 22, y: 1.6, type: 'COIN' }, { x: 30, y: 1.6, type: 'COIN' }, { x: 38, y: 1.6, type: 'COIN' },
    { x: 63, y: 1.6, type: 'COIN' }, { x: 69, y: 1.6, type: 'COIN' }
  ],
  gems: [
    { x: 44, y: 3.4, type: 'GEM' }
  ],
  powerups: [
    { x: 3, y: 1.8, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 63, y: 1.5 }
  ]
};
