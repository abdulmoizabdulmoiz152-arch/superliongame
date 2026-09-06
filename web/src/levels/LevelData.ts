import { LevelConfig, MapTheme, EnemyType, PowerUpType } from '../types/game';
import { MAP1_LEVELS } from './map1';
import { MAP2_LEVELS } from './map2';
import { MAP3_LEVELS } from './map3';
import { MAP4_LEVELS } from './map4';

// ---------------------------------------------------------------------------
// STATUS (project-wide level authoring):
//   Map 1 — Skyline Meadows       (levels 1-8):  fully hand-authored, ./map1/.
//   Map 2 — Crystal Caves         (levels 9-16): fully hand-authored, ./map2/.
//   Map 3 — Cyber Sky City        (levels 17-24): fully hand-authored, ./map3/.
//   Map 4 — Volcanic Shadow Realm (levels 25-32): fully hand-authored, ./map4/.
//   All 32 campaign levels are now individually authored. The formula-driven
//   generator below (generatePlaceholderLevel) is no longer used by
//   ALL_LEVELS and is kept only as a reference/fallback; see the bottom of
//   this file.
// ---------------------------------------------------------------------------

const LEVEL_NAMES = [
  // Map 1: Skyline Meadows
  'First Flight',
  'Gentle Slopes',
  'Bouncing Bridges',
  'Hidden Grottos',
  'Wind Runner',
  'Cloud Stepper',
  'Sunset Ridge',
  'Guardian of the Meadow',
  // Map 2: Crystal Caves
  'Shimmering Descent',
  'Echo Chamber',
  'Geode Grotto',
  'Luminescent Labyrinth',
  'Stalactite Fall',
  'Prismatic Path',
  'Deep Resonance',
  "Crystal Golem's Lair",
  // Map 3: Cyber Sky City
  'Neon Horizon',
  'Data Stream Highway',
  'Grid Runner',
  'Rooftop Rush',
  'Pulse Generator',
  'Laser Alley',
  'Hologram Heights',
  'Core Infiltration',
  // Map 4: Volcanic Shadow Realm
  'Ash & Cinder',
  'Magma Flow',
  'Obsidian Crags',
  'Fiery Gauntlet',
  'Infernal Ascent',
  'Brimstone Bastion',
  'The Boiling Core',
  "Shadow Titan's Domain"
];

function generatePlaceholderLevel(levelIndex: number): LevelConfig {
  const levelNum = levelIndex + 1;
  const mapIdx = Math.floor(levelIndex / 8);
  const title = LEVEL_NAMES[levelIndex];

  let theme = MapTheme.SKYLINE_MEADOWS;
  if (mapIdx === 1) theme = MapTheme.CRYSTAL_CAVES;
  else if (mapIdx === 2) theme = MapTheme.CYBER_SKY_CITY;
  else if (mapIdx === 3) theme = MapTheme.VOLCANIC_SHADOW_REALM;

  const isBossLevel = levelNum === 8 || levelNum === 16 || levelNum === 24 || levelNum === 32;
  const levelLength = isBossLevel ? 65 : 75 + (levelNum % 8) * 6;

  const platforms = [];
  const hazards = [];
  const breakables = [];
  const enemies = [];
  const coins = [];
  const gems = [];
  const powerups = [];
  const checkpoints = [];

  // Start Platform
  platforms.push({ x: 0, y: 0, width: 10, height: 2 });

  if (isBossLevel) {
    // Boss arena layout: Flat ground, 2 elevated floating side platforms, boss in center
    platforms.push({ x: 22, y: 0, width: 36, height: 2 });
    platforms.push({ x: 12, y: 3.5, width: 6, height: 0.8, isOneWay: true });
    platforms.push({ x: 32, y: 3.5, width: 6, height: 0.8, isOneWay: true });

    // Boss Enemy
    if (levelNum === 32) {
      enemies.push({ x: 24, y: 4.5, type: EnemyType.SHADOW_TITAN });
    } else {
      enemies.push({ x: 24, y: 3.5, type: EnemyType.NEON_MECHA });
    }

    // Powerup in boss arena
    powerups.push({ x: 8, y: 1.5, type: PowerUpType.ENERGY_SHIELD });
    powerups.push({ x: 36, y: 1.5, type: PowerUpType.SPEED_SPARK });

    // Checkpoint right before boss arena
    checkpoints.push({ x: 6, y: 1.5 });

    return {
      levelNumber: levelNum,
      mapIndex: mapIdx + 1,
      title,
      theme,
      playerStartX: 0,
      playerStartY: 1.5,
      goalX: 38,
      goalY: 1.5,
      boundsX: 45,
      boundsY: 20,
      platforms,
      hazards,
      breakables,
      enemies,
      coins,
      gems,
      powerups,
      checkpoints,
      hasBoss: true,
      bossType: levelNum === 32 ? EnemyType.SHADOW_TITAN : EnemyType.NEON_MECHA
    };
  }

  // Non-boss level handcrafted progression
  let currX = 8;
  let currY = 0;
  const sectionCount = Math.floor(levelLength / 12);

  for (let s = 0; s < sectionCount; s++) {
    const sectionType = (s + levelNum) % 6;

    switch (sectionType) {
      case 0: {
        // Flat sprint with coins and patroller
        const pLen = 9;
        platforms.push({ x: currX + pLen / 2, y: currY, width: pLen, height: 2 });
        coins.push({ x: currX + 2, y: currY + 1.5, type: 'COIN' });
        coins.push({ x: currX + 4, y: currY + 1.5, type: 'COIN' });
        coins.push({ x: currX + 6, y: currY + 1.5, type: 'COIN' });
        enemies.push({ x: currX + 5, y: currY + 1.5, type: EnemyType.SPIKY_ROLLER, patrolRange: 3 });
        currX += pLen + 3.5;
        break;
      }
      case 1: {
        // Stepping stones over hazard gap
        const step1Y = currY + 1.2;
        const step2Y = currY + 2.5;
        platforms.push({ x: currX + 2, y: step1Y, width: 3.2, height: 0.8 });
        platforms.push({ x: currX + 6.5, y: step2Y, width: 3.2, height: 0.8 });

        // Hazard below
        hazards.push({ x: currX + 4.2, y: currY - 1.5, width: 7.0, height: 1.0, type: mapIdx === 3 ? 'LAVA' : 'SPIKES' });
        coins.push({ x: currX + 2, y: step1Y + 1.2, type: 'COIN' });
        coins.push({ x: currX + 6.5, y: step2Y + 1.2, type: 'COIN' });
        enemies.push({ x: currX + 4.5, y: step2Y + 1.8, type: EnemyType.AERO_DRONE, patrolRange: 3 });

        currY = step2Y;
        currX += 9.5;
        break;
      }
      case 2: {
        // Moving platform section
        platforms.push({
          x: currX + 3.5,
          y: currY,
          width: 3.6,
          height: 0.8,
          moveRangeX: 3.0,
          moveSpeed: 1.5
        });
        coins.push({ x: currX + 3.5, y: currY + 1.5, type: 'COIN' });

        // Secret crystal gem above
        gems.push({ x: currX + 3.5, y: currY + 4.0, type: 'GEM' });

        currX += 8.5;
        break;
      }
      case 3: {
        // Breakable Energy Blocks & Power-Up Cache
        const pLen = 8;
        platforms.push({ x: currX + pLen / 2, y: currY, width: pLen, height: 2 });
        breakables.push({ x: currX + 3, y: currY + 2.5, width: 1.2, height: 1.2, rewardType: PowerUpType.SPEED_SPARK });
        breakables.push({ x: currX + 4.5, y: currY + 2.5, width: 1.2, height: 1.2, rewardType: 'GEM' });
        enemies.push({ x: currX + 6, y: currY + 1.5, type: EnemyType.CHARGING_DASHER, patrolRange: 3.5 });

        currX += pLen + 3.5;
        break;
      }
      case 4: {
        // Vertical climb / tiered one-way platforms
        platforms.push({ x: currX + 1.5, y: currY + 1.8, width: 3.0, height: 0.6, isOneWay: true });
        platforms.push({ x: currX + 4.5, y: currY + 3.6, width: 3.0, height: 0.6, isOneWay: true });
        platforms.push({ x: currX + 7.5, y: currY + 2.0, width: 3.0, height: 0.6 });

        coins.push({ x: currX + 1.5, y: currY + 2.6, type: 'COIN' });
        coins.push({ x: currX + 4.5, y: currY + 4.4, type: 'COIN' });
        coins.push({ x: currX + 7.5, y: currY + 2.8, type: 'COIN' });

        if (mapIdx >= 2) {
          enemies.push({ x: currX + 4.5, y: currY + 5.0, type: EnemyType.PULSE_TURRET });
        }

        currY += 2.0;
        currX += 10.0;
        break;
      }
      case 5: {
        // Gauntlet: crumbling platforms or laser hazards
        platforms.push({ x: currX + 2, y: currY, width: 2.8, height: 0.8, isCrumbling: true });
        platforms.push({ x: currX + 6, y: currY, width: 2.8, height: 0.8, isCrumbling: true });

        hazards.push({ x: currX + 4, y: currY - 2, width: 6.0, height: 1.0, type: 'SPIKES' });
        powerups.push({ x: currX + 4, y: currY + 1.5, type: PowerUpType.SKY_DASH });

        currX += 9.0;
        break;
      }
    }

    // Insert Checkpoint at middle section
    if (s === Math.floor(sectionCount / 2)) {
      checkpoints.push({ x: currX - 2, y: currY + 1.5 });
      // Restore platform base under checkpoint
      platforms.push({ x: currX - 2, y: currY, width: 5, height: 2 });
    }
  }

  // Final Goal Platform
  platforms.push({ x: currX + 4, y: currY, width: 8, height: 2 });

  return {
    levelNumber: levelNum,
    mapIndex: mapIdx + 1,
    title,
    theme,
    playerStartX: 0,
    playerStartY: 1.5,
    goalX: currX + 4,
    goalY: currY + 1.5,
    boundsX: currX + 10,
    boundsY: Math.max(25, currY + 15),
    platforms,
    hazards,
    breakables,
    enemies,
    coins,
    gems,
    powerups,
    checkpoints
  };
}

export const ALL_LEVELS: LevelConfig[] = [...MAP1_LEVELS, ...MAP2_LEVELS, ...MAP3_LEVELS, ...MAP4_LEVELS];

// NOTE: generatePlaceholderLevel (above) is no longer referenced by
// ALL_LEVELS now that every level 1-32 is hand-authored. Left in place
// rather than deleted so this diff stays reviewable; safe to delete in a
// follow-up cleanup pass. noUnusedLocals is off in tsconfig.json, so this
// does not fail the build.
