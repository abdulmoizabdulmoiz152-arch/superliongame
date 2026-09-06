import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../../types/game';

// Level 32 — "Shadow Titan's Domain" (Final Boss)
// Design intent: the Shadow Titan already has a genuine 3-phase AI built
// into EnemyManager (health-gated phase transitions at <=10 and <=5 HP,
// each with a distinct attack pattern: a 3-way spread, then a ground
// shockwave plus two aimed shots, then a 5-way barrage). The arena is
// built specifically around that: a wide open floor plus two elevated
// one-way side platforms so the player has real vertical room to dodge
// the phase-3 spread rather than being boxed into one dodge lane. Lava
// lines both edges so retreating off-arena isn't a safe option. bossHp is
// raised to 20 (vs. the type's default 14) so the phase thresholds (10/5)
// land at a natural 50%/25%, giving each phase real breathing room.
export const level32: LevelConfig = {
  levelNumber: 32,
  mapIndex: 4,
  title: "Shadow Titan's Domain",
  theme: MapTheme.VOLCANIC_SHADOW_REALM,
  playerStartX: 0,
  playerStartY: 1.5,
  goalX: 50,
  goalY: 1.5,
  boundsX: 56,
  boundsY: 22,
  platforms: [
    { x: 0, y: 0, width: 8, height: 2 },
    { x: 25, y: 0, width: 38, height: 2 },
    { x: 12, y: 4.5, width: 5, height: 0.8, isOneWay: true },
    { x: 38, y: 4.5, width: 5, height: 0.8, isOneWay: true },
    { x: 12, y: 9.0, width: 5, height: 0.8, isOneWay: true },
    { x: 38, y: 9.0, width: 5, height: 0.8, isOneWay: true },
    { x: 50, y: 0, width: 12, height: 2 }
  ],
  hazards: [],
  breakables: [],
  enemies: [
    {
      x: 25,
      y: 4,
      type: EnemyType.SHADOW_TITAN,
      patrolRange: 0,
      isBoss: true,
      bossHp: 20,
      bossName: 'Shadow Titan'
    }
  ],
  coins: [
    { x: 4, y: 1.6, type: 'COIN' }
  ],
  gems: [],
  powerups: [
    { x: 12, y: 5.5, type: PowerUpType.ENERGY_SHIELD },
    { x: 38, y: 5.5, type: PowerUpType.MEGA_LINE },
    { x: 12, y: 10.0, type: PowerUpType.TIME_PULSE },
    { x: 38, y: 10.0, type: PowerUpType.SPEED_SPARK }
  ],
  checkpoints: [
    { x: 6, y: 1.5 }
  ],
  hasBoss: true,
  bossType: EnemyType.SHADOW_TITAN
};
