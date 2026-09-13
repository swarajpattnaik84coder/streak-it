// ── Player ────────────────────────────────────────────────────────────────────
export const CURRENT_LEVEL = 7;

export const PLAYER = {
  name: "Aeldric",
  class: "Shadow Warden",
  level: 7,
  xp: 1340,
  xpToNext: 1500,
  currency: 840,
  streak: 14,
  stats: [
    { key: "STR", label: "Strength",  value: 68, max: 100, color: "#ef4444" },
    { key: "INT", label: "Intellect", value: 82, max: 100, color: "#3b82f6" },
    { key: "FOC", label: "Focus",     value: 74, max: 100, color: "#a855f7" },
    { key: "AGI", label: "Agility",   value: 59, max: 100, color: "#22c55e" },
    { key: "VIT", label: "Vitality",  value: 71, max: 100, color: "#f97316" },
  ],
};

// ── Navigation ────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "calendar",    label: "Calendar" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "character",   label: "Character" },
  { id: "vault",       label: "Vault" },
  { id: "store",       label: "Store" },
];

// ── World Regions ─────────────────────────────────────────────────────────────
export const REGIONS = [
  { id: "ashlands",    name: "Ashlands",    levels: [1, 5],   color: "#d97706", desc: "Desolate volcanic barrens and ruined garrisons" },
  { id: "stonemark",   name: "Stonemark",   levels: [6, 10],  color: "#c9a84c", desc: "Ancient granite ridges guarded by stone fortresses" },
  { id: "ironveil",    name: "Ironveil",    levels: [11, 15], color: "#a855f7", desc: "Shrouded valleys beneath eternal thunderstorm peaks" },
  { id: "grimholt",    name: "Grimholt",    levels: [16, 20], color: "#3b82f6", desc: "Frozen pine wilderness surrounding the abyssal lake" },
  { id: "citadel",     name: "The Citadel", levels: [21, 25], color: "#f59e0b", desc: "The gilded throne at the peak of the realm" },
];

// ── World Map Dimensions & Segments ───────────────────────────────────────────
// Total canvas width: 3600px | Height: 600px
// 4 visible segments of 5 levels each (Segment width ~ 850px)
export const MAP_CONFIG = {
  width: 3600,
  height: 600,
  segmentWidth: 850,
  levelsPerSegment: 5,
};

export const SEGMENTS = [
  { id: 1, label: "Segment I",   name: "The Southern Reaches", levelRange: [1, 5],   centerPosition: 420 },
  { id: 2, label: "Segment II",  name: "Stonemark Highlands",  levelRange: [6, 10],  centerPosition: 1250 },
  { id: 3, label: "Segment III", name: "Ironveil Ravines",     levelRange: [11, 15], centerPosition: 2080 },
  { id: 4, label: "Segment IV",  name: "The Frozen Citadel",   levelRange: [16, 20], centerPosition: 2920 },
];

// ── World Map Levels (Structured Data) ────────────────────────────────────────
// Positioned in an organic winding path across the 3600px wide cartography canvas
export const LEVELS = [
  // Segment 1 (Ashlands - Levels 1 to 5)
  { id:  1, x:  140, y: 460, name: "The Fallen Gate",    type: "combat",      xpReward:  100, zone: "Ashlands",    tasks: 3, landmark: "ruins" },
  { id:  2, x:  310, y: 340, name: "Ashwood Watchtower", type: "exploration", xpReward:  120, zone: "Ashlands",    tasks: 4, landmark: "tower" },
  { id:  3, x:  480, y: 440, name: "Ember River Ford",   type: "task",        xpReward:  140, zone: "Ashlands",    tasks: 5, landmark: "bridge" },
  { id:  4, x:  640, y: 260, name: "Iron Barrows",       type: "combat",      xpReward:  160, zone: "Ashlands",    tasks: 3, landmark: "barrow" },
  { id:  5, x:  810, y: 390, name: "Sulfur Stronghold",  type: "boss",        xpReward:  200, zone: "Ashlands",    tasks: 6, landmark: "fortress" },

  // Segment 2 (Stonemark - Levels 6 to 10)
  { id:  6, x:  990, y: 450, name: "The Silver Road",    type: "task",        xpReward:  220, zone: "Stonemark",   tasks: 4, landmark: "road" },
  { id:  7, x: 1160, y: 270, name: "Thornwall Keep",     type: "boss",        xpReward:  280, zone: "Stonemark",   tasks: 7, landmark: "castle" },
  { id:  8, x: 1340, y: 420, name: "Cursed Plains",      type: "exploration", xpReward:  300, zone: "Stonemark",   tasks: 5, landmark: "ruins" },
  { id:  9, x: 1520, y: 230, name: "Ravens' Crag",       type: "combat",      xpReward:  320, zone: "Stonemark",   tasks: 4, landmark: "peak" },
  { id: 10, x: 1690, y: 380, name: "The Sunken Bastion", type: "challenge",   xpReward:  360, zone: "Stonemark",   tasks: 6, landmark: "bastion" },

  // Segment 3 (Ironveil & Grimholt - Levels 11 to 15)
  { id: 11, x: 1870, y: 460, name: "Ashen Vale",         type: "task",        xpReward:  380, zone: "Ironveil",    tasks: 5, landmark: "camp" },
  { id: 12, x: 2040, y: 280, name: "Ghostmarsh Crossing", type: "combat",     xpReward:  400, zone: "Ironveil",    tasks: 4, landmark: "marsh" },
  { id: 13, x: 2210, y: 420, name: "The Drowned Shrine", type: "exploration", xpReward:  420, zone: "Grimholt",    tasks: 5, landmark: "shrine" },
  { id: 14, x: 2380, y: 220, name: "Coldspire Citadel",  type: "challenge",   xpReward:  460, zone: "Grimholt",    tasks: 6, landmark: "spire" },
  { id: 15, x: 2550, y: 390, name: "Frostbite Pass",     type: "boss",        xpReward:  500, zone: "Grimholt",    tasks: 7, landmark: "fortress" },

  // Segment 4 (The Citadel - Levels 16 to 20)
  { id: 16, x: 2730, y: 450, name: "Blackwater Fen",     type: "combat",      xpReward:  520, zone: "The Citadel", tasks: 4, landmark: "fen" },
  { id: 17, x: 2900, y: 260, name: "The Pale Summit",    type: "challenge",   xpReward:  560, zone: "The Citadel", tasks: 7, landmark: "peak" },
  { id: 18, x: 3080, y: 380, name: "Voidreach Sanctuary",type: "boss",        xpReward:  620, zone: "The Citadel", tasks: 8, landmark: "sanctuary" },
  { id: 19, x: 3260, y: 220, name: "The Eternal Spire",  type: "challenge",   xpReward:  700, zone: "The Citadel", tasks: 7, landmark: "spire" },
  { id: 20, x: 3440, y: 340, name: "Throne of Ages",     type: "boss",        xpReward: 1000, zone: "The Citadel", tasks: 10, landmark: "throne" },
];

export const WORLDS = [
  { id: 1, name: "The Shattered Realm", levelRange: [1, 20] },
];
export const ACTIVE_WORLD = WORLDS[0];