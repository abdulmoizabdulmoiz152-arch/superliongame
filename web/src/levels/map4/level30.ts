import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 30 — "Brimstone Bastion" (Mini-Boss)
// Design intent: the required mini-boss before the final fight. Uses the
// Crystal Stalker's already-fast, erratic native movement (2.0 units/s,
// pulsing scale) as the base for a scaled-up "Ember Stalker" — a
// melee-only, no-ranged-attack mini-boss whose threat comes from speed and
// the lava floor it fights over, not projectiles. Meant to feel like a
// step down in complexity from level 29 but a step up in raw pressure,
// ahead of the true final boss two levels later.
export const level30: LevelConfig = {
  levelNumber: 30,
  mapIndex: 4,
  title: 'Brimstone Bastion',
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 40,
  goalY: 1.5,
  boundsX: 46,
  boundsY: 20,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 20, y: 0, width: 24, height: 2 },
    { x: 12, y: 3.6, width: 4, height: 0.8, isOneWay: true },
    { x: 28, y: 3.6, width: 4, height: 0.8, isOneWay: true },
    { x: 40, y: 0, width: 10, height: 2 }
  ],
  hazards: [
    { x: 10, y: -1.6, width: 3.0, height: 1.0, type: 'LAVA' },
    { x: 30, y: -1.6, width: 3.0, height: 1.0, type: 'LAVA' }
  ],
  breakables: [],
  enemies: [
    {
      x: 20,
      y: 1.5,
      type: EnemyType.CRYSTAL_STALKER,
      patrolRange: 10,
      isBoss: true,
      bossHp: 8,
      bossName: 'Ember Stalker'
    }
  ],
  coins: [
    { x: 3, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 12, y: 4.6, type: PowerUpType.TIME_PULSE },
    { x: 28, y: 4.6, type: PowerUpType.ENERGY_SHIELD }
  ],
  checkpoints: [
    { x: 6, y: 1.5 }
  ],
  hasBoss: true,
  bossType: EnemyType.CRYSTAL_STALKER
};
