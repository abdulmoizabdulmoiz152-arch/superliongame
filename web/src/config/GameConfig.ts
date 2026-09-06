import { MapTheme, ShopItem } from '../types/game';

export const GameConfig = {
  PHYSICS: {
    GRAVITY: -26.0,
    MAX_FALL_SPEED: -18.0,
    MOVE_SPEED: 8.5,
    ACCELERATION: 40.0,
    DECELERATION: 35.0,
    AIR_CONTROL: 0.85,
    JUMP_FORCE: 14.5,
    VARIABLE_JUMP_FALLOFF: 0.45,
    DOUBLE_JUMP_FORCE: 13.5,
    COYOTE_TIME: 0.12, // 120ms
    JUMP_BUFFER: 0.12, // 120ms
    DASH_SPEED: 18.0,
    DASH_DURATION: 0.22,
    DASH_COOLDOWN: 1.0,
    KNOCKBACK_FORCE: 9.0,
    INVINCIBILITY_DURATION: 1.5, // seconds
    ATTACK_SLASH_DURATION: 0.28,
    ATTACK_SLASH_RANGE: 1.8,
    ATTACK_SLASH_COOLDOWN: 0.35,
    POWERUP_DURATION: 12.0 // seconds
  },

  CAMERA: {
    LERP_SPEED: 5.5,
    LOOK_AHEAD_DISTANCE: 2.2,
    OFFSET_Y: 1.2,
    OFFSET_Z: -16.0,
    SCREEN_SHAKE_DECAY: 6.0
  },

  WORLD_THEMES: {
    [MapTheme.SKYLINE_MEADOWS]: {
      name: 'Skyline Meadows',
      clearColor: '#70c5ff',
      fogColor: '#a0e0ff',
      lightColor: '#ffffff',
      ambientColor: '#2b5070',
      platformColor: '#43a047',
      platformUndersideColor: '#5d4037',
      hazardColor: '#d32f2f',
      particleColor: '#ffffff'
    },
    [MapTheme.CRYSTAL_CAVES]: {
      name: 'Crystal Caves',
      clearColor: '#0a0d1a',
      fogColor: '#121829',
      lightColor: '#00e5ff',
      ambientColor: '#1a0933',
      platformColor: '#283593',
      platformUndersideColor: '#1a237e',
      hazardColor: '#e91e63',
      particleColor: '#00e5ff'
    },
    [MapTheme.CYBER_SKY_CITY]: {
      name: 'Cyber Sky City',
      clearColor: '#050814',
      fogColor: '#0c1226',
      lightColor: '#d500f9',
      ambientColor: '#091533',
      platformColor: '#0091ea',
      platformUndersideColor: '#002f6c',
      hazardColor: '#ff1744',
      particleColor: '#d500f9'
    },
    [MapTheme.VOLCANIC_SHADOW_REALM]: {
      name: 'Volcanic Shadow Realm',
      clearColor: '#150604',
      fogColor: '#240a06',
      lightColor: '#ff5722',
      ambientColor: '#1f0d09',
      platformColor: '#424242',
      platformUndersideColor: '#212121',
      hazardColor: '#ff1744',
      particleColor: '#ffab00'
    }
  },

  COSMETICS: {
    SKINS: [
      {
        id: 'skin_default',
        name: 'Quantum Cyan',
        type: 'skin',
        costType: 'COIN',
        cost: 0,
        colorHex: '#00e5ff',
        secondaryHex: '#0077ff',
        description: 'The iconic glowing signature line form.'
      },
      {
        id: 'skin_solar',
        name: 'Solar Blaze',
        type: 'skin',
        costType: 'COIN',
        cost: 200,
        colorHex: '#ffd600',
        secondaryHex: '#ff6d00',
        description: 'Infused with raw solar energy.'
      },
      {
        id: 'skin_crimson',
        name: 'Crimson Fury',
        type: 'skin',
        costType: 'COIN',
        cost: 500,
        colorHex: '#ff1744',
        secondaryHex: '#b71c1c',
        description: 'Vigorous crimson plasma line.'
      },
      {
        id: 'skin_violet',
        name: 'Phantom Violet',
        type: 'skin',
        costType: 'COIN',
        cost: 800,
        colorHex: '#d500f9',
        secondaryHex: '#651fff',
        description: 'Mystical high-frequency resonance.'
      },
      {
        id: 'skin_matrix',
        name: 'Matrix Emerald',
        type: 'skin',
        costType: 'GEM',
        cost: 15,
        colorHex: '#00e676',
        secondaryHex: '#00b0ff',
        description: 'Digitized emerald crystalline runner.'
      },
      {
        id: 'skin_pearl',
        name: 'Cyber Pearl',
        type: 'skin',
        costType: 'GEM',
        cost: 30,
        colorHex: '#ffffff',
        secondaryHex: '#ffd600',
        description: 'Pure radiant sovereign light.'
      }
    ] as ShopItem[],

    TRAILS: [
      {
        id: 'trail_default',
        name: 'Cyan Spark',
        type: 'trail',
        costType: 'COIN',
        cost: 0,
        colorHex: '#00e5ff',
        secondaryHex: '#0077ff',
        description: 'Standard electric line sparks.'
      },
      {
        id: 'trail_gold',
        name: 'Star Dust',
        type: 'trail',
        costType: 'COIN',
        cost: 300,
        colorHex: '#ffd600',
        secondaryHex: '#fff9c4',
        description: 'Cascading golden cosmic fragments.'
      },
      {
        id: 'trail_fire',
        name: 'Flame Surge',
        type: 'trail',
        costType: 'COIN',
        cost: 600,
        colorHex: '#ff3d00',
        secondaryHex: '#ff9100',
        description: 'Scorching fiery exhaust trail.'
      },
      {
        id: 'trail_rainbow',
        name: 'Prismatic Rift',
        type: 'trail',
        costType: 'GEM',
        cost: 20,
        colorHex: '#00e5ff',
        secondaryHex: '#d500f9',
        description: 'Shifting multicolored light spectrum.'
      }
    ] as ShopItem[]
  }
};
