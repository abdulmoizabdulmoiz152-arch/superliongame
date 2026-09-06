export enum GameMode {
  CAMPAIGN = 'CAMPAIGN',
  ENDLESS = 'ENDLESS'
}

export enum GameState {
  SPLASH = 'SPLASH',
  LOADING = 'LOADING',
  MAIN_MENU = 'MAIN_MENU',
  PLAY_MENU = 'PLAY_MENU',
  MAP_SELECT = 'MAP_SELECT',
  LEVEL_SELECT = 'LEVEL_SELECT',
  ENDLESS_MENU = 'ENDLESS_MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  MAP_COMPLETE = 'MAP_COMPLETE',
  ENDLESS_RESULTS = 'ENDLESS_RESULTS',
  SHOP = 'SHOP',
  SETTINGS = 'SETTINGS',
  CREDITS = 'CREDITS'
}

export enum PlayerAnimState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  JUMP = 'JUMP',
  DOUBLE_JUMP = 'DOUBLE_JUMP',
  FALLING = 'FALLING',
  LANDING = 'LANDING',
  HURT = 'HURT',
  VICTORY = 'VICTORY',
  DEATH = 'DEATH'
}

export enum PowerUpType {
  SPEED_SPARK = 'SPEED_SPARK',
  SKY_DASH = 'SKY_DASH',
  ENERGY_SHIELD = 'ENERGY_SHIELD',
  COIN_MAGNET = 'COIN_MAGNET',
  MEGA_LINE = 'MEGA_LINE',
  TIME_PULSE = 'TIME_PULSE'
}

export enum EnemyType {
  SPIKY_ROLLER = 'SPIKY_ROLLER',
  AERO_DRONE = 'AERO_DRONE',
  CHARGING_DASHER = 'CHARGING_DASHER',
  PULSE_TURRET = 'PULSE_TURRET',
  SHIELDED_GOLEM = 'SHIELDED_GOLEM',
  CRYSTAL_STALKER = 'CRYSTAL_STALKER',
  NEON_MECHA = 'NEON_MECHA',
  SHADOW_TITAN = 'SHADOW_TITAN'
}

export enum MapTheme {
  SKYLINE_MEADOWS = 'SKYLINE_MEADOWS',
  CRYSTAL_CAVES = 'CRYSTAL_CAVES',
  CYBER_SKY_CITY = 'CYBER_SKY_CITY',
  VOLCANIC_SHADOW_REALM = 'VOLCANIC_SHADOW_REALM'
}

export interface PlatformConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  isOneWay?: boolean;
  moveRangeX?: number;
  moveRangeY?: number;
  moveSpeed?: number;
  isCrumbling?: boolean;
  colorHex?: string;
}

export interface HazardConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'SPIKES' | 'LAVA' | 'LASER';
  laserInterval?: number;
}

export interface BreakableConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  rewardType?: 'COIN' | 'GEM' | PowerUpType;
}

export interface CollectibleConfig {
  x: number;
  y: number;
  type: 'COIN' | 'GEM';
}

export interface PowerUpConfig {
  x: number;
  y: number;
  type: PowerUpType;
}

export interface EnemyConfig {
  x: number;
  y: number;
  type: EnemyType;
  patrolRange?: number;
  // Boss-specific overrides. Any EnemyType can serve as a level's boss —
  // isBoss drives the HUD boss-health-bar hookup and a heavier HP pool
  // instead of hard-coding boss status to two specific enemy types.
  isBoss?: boolean;
  bossHp?: number;
  bossName?: string;
}

export interface CheckpointConfig {
  x: number;
  y: number;
}

export interface LevelConfig {
  levelNumber: number;
  mapIndex: number;
  title: string;
  theme: MapTheme;
  playerStartX: number;
  playerStartY: number;
  goalX: number;
  goalY: number;
  boundsX: number;
  boundsY: number;
  platforms: PlatformConfig[];
  hazards: HazardConfig[];
  breakables: BreakableConfig[];
  enemies: EnemyConfig[];
  coins: CollectibleConfig[];
  gems: CollectibleConfig[];
  powerups: PowerUpConfig[];
  checkpoints: CheckpointConfig[];
  hasBoss?: boolean;
  bossType?: EnemyType;
}

export interface PlayerSaveData {
  unlockedLevel: number; // 1 to 32
  unlockedMaps: number; // 1 to 4
  levelStars: Record<number, number>; // levelNum -> stars (1-3)
  levelBestTimes: Record<number, number>; // levelNum -> seconds
  coins: number;
  gems: number;
  endlessHighScore: number;
  endlessBestDistance: number;
  endlessTotalRuns: number;
  equippedSkin: string;
  equippedTrail: string;
  unlockedSkins: string[];
  unlockedTrails: string[];
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    isMuted: boolean;
    graphicsQuality: 'low' | 'med' | 'high';
  };
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'skin' | 'trail';
  costType: 'COIN' | 'GEM';
  cost: number;
  colorHex: string;
  secondaryHex: string;
  description: string;
}
