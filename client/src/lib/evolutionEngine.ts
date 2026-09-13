export const MAX_LEVEL = 50;
export const MILESTONE_LEVELS = [10, 20, 30, 40, 50] as const;
export const GATE_LOCK_LEVELS = [9, 19, 29, 39, 49] as const;

export interface TrialRequirement {
  id: string;
  label: string;
  current: number;
  required: number;
}

export interface AscensionTrial {
  id: string;
  fromLevel: number;
  toLevel: number;
  name: string;
  description: string;
  requirements: TrialRequirement[];
}

export interface TierEvolution {
  id: number;
  minLevel: number;
  maxLevel: number;
  name: string;
  title: string;
}

export interface ProgressionAttributes {
  STR: number;
  INT: number;
  VIT: number;
  Routine: number;
}

export interface ProgressionState {
  level: number;
  xp: number;
  xpToNext: number;
  xpPercent: number;
  gold: number;
  unallocatedPoints: number;
  spentPoints: number;
  isGateLocked: boolean;
  isMaxLevel: boolean;
  nextLevel: number | null;
  tier: TierEvolution;
  trial: AscensionTrial | null;
  trialComplete: boolean;
  attributes: ProgressionAttributes;
  name: string;
  characterClass: string;
}

export const TIERS: readonly TierEvolution[] = [
  { id: 1, minLevel: 1,  maxLevel: 9,  name: "Rustic Recruit",    title: "Iron Squire" },
  { id: 2, minLevel: 10, maxLevel: 19, name: "Steel Vanguard",    title: "Knight Protector" },
  { id: 3, minLevel: 20, maxLevel: 29, name: "Valyrian Champion", title: "King's Champion" },
  { id: 4, minLevel: 30, maxLevel: 39, name: "Lord Commander",    title: "Grand Marshal" },
  { id: 5, minLevel: 40, maxLevel: 49, name: "Mythic Warlord",    title: "High Sovereign" },
  { id: 6, minLevel: 50, maxLevel: 50, name: "The Ascended King", title: "Sovereign of the Realm" },
];

const TRIAL_BLUEPRINTS: Record<number, Omit<AscensionTrial, "requirements"> & {
  requirements: Array<Omit<TrialRequirement, "current">>;
}> = {
  9: {
    id: "gate-10",
    fromLevel: 9,
    toLevel: 10,
    name: "Trial of the Iron Gate",
    description: "Prove the discipline of a squire before the realm names you Knight Protector.",
    requirements: [
      { id: "streak",     label: "Maintain a 3-day streak",   required: 3 },
      { id: "core-tasks", label: "Complete 5 core tasks",     required: 5 },
    ],
  },
  19: {
    id: "gate-20",
    fromLevel: 19,
    toLevel: 20,
    name: "Trial of the Valyrian Flame",
    description: "Hold the vanguard through storm and steel to claim the Champion's mantle.",
    requirements: [
      { id: "streak",     label: "Maintain a 7-day streak",   required: 7 },
      { id: "core-tasks", label: "Complete 8 core tasks",     required: 8 },
      { id: "elite",      label: "Defeat 1 elite challenge",  required: 1 },
    ],
  },
  29: {
    id: "gate-30",
    fromLevel: 29,
    toLevel: 30,
    name: "Trial of the Marshal's Oath",
    description: "Command the host with unbroken resolve before the Lord Commander's seal is broken.",
    requirements: [
      { id: "streak",     label: "Maintain a 14-day streak",  required: 14 },
      { id: "core-tasks", label: "Complete 12 core tasks",    required: 12 },
      { id: "elite",      label: "Complete 3 elite trials",   required: 3 },
    ],
  },
  39: {
    id: "gate-40",
    fromLevel: 39,
    toLevel: 40,
    name: "Trial of the High Sovereign",
    description: "The war-horns of myth will not sound until the Marshal's last duty is fulfilled.",
    requirements: [
      { id: "streak",     label: "Maintain a 21-day streak",  required: 21 },
      { id: "core-tasks", label: "Complete 15 core tasks",    required: 15 },
      { id: "raid",       label: "Complete 1 realm campaign", required: 1 },
    ],
  },
  49: {
    id: "gate-50",
    fromLevel: 49,
    toLevel: 50,
    name: "Trial of the Ascended Crown",
    description: "Only a mythic warlord who masters the realm's final trial may sit the throne.",
    requirements: [
      { id: "streak",     label: "Maintain a 30-day streak",       required: 30 },
      { id: "core-tasks", label: "Complete 20 core tasks",         required: 20 },
      { id: "crown",      label: "Complete the Sovereign's Trial", required: 1 },
    ],
  },
};

export function isMilestoneLevel(level: number): boolean {
  return (MILESTONE_LEVELS as readonly number[]).includes(level);
}

export function isGateLockLevel(level: number): boolean {
  return (GATE_LOCK_LEVELS as readonly number[]).includes(level);
}

export function xpRequiredToReach(level: number): number {
  if (level <= 1) return 0;
  const base = Math.floor(90 * Math.pow(level, 1.38));
  return isMilestoneLevel(level) ? Math.floor(base * 2.5) : base;
}

export function xpToAdvanceFrom(level: number): number {
  if (level >= MAX_LEVEL) return 0;
  return xpRequiredToReach(level + 1);
}

export function getTierForLevel(level: number): TierEvolution {
  const clamped = Math.min(Math.max(level, 1), MAX_LEVEL);
  return TIERS.find((tier) => clamped >= tier.minLevel && clamped <= tier.maxLevel) ?? TIERS[0];
}

export function isRequirementComplete(req: TrialRequirement): boolean {
  return req.current >= req.required;
}

export function isTrialComplete(trial: AscensionTrial | null): boolean {
  if (!trial) return false;
  return trial.requirements.every(isRequirementComplete);
}

export function getTrialForLevel(
  level: number,
  progress: Record<string, number> = {},
): AscensionTrial | null {
  const blueprint = TRIAL_BLUEPRINTS[level];
  if (!blueprint) return null;
  return {
    ...blueprint,
    requirements: blueprint.requirements.map((req) => ({
      ...req,
      current: Math.min(Math.max(progress[req.id] ?? 0, 0), req.required),
    })),
  };
}

export function buildProgressionState(input: {
  level: number;
  xp: number;
  gold?: number;
  unallocatedPoints?: number;
  spentPoints?: number;
  attributes: ProgressionAttributes;
  trialProgress?: Record<string, number>;
  name: string;
  characterClass: string;
}): ProgressionState {
  let level = Math.min(Math.max(Math.floor(input.level), 1), MAX_LEVEL);
  let xpToNext = xpToAdvanceFrom(level);
  let xp = Math.max(0, Math.floor(input.xp));
  const spentPoints = Math.max(0, input.spentPoints ?? 0);
  let unallocatedPoints = Math.max(0, input.unallocatedPoints ?? Math.max(0, (level * 1) - spentPoints));

  // Automatic level-up check:
  // When xp >= xpToNext:
  // If not a milestone gate: automatically trigger level up, rollover remaining XP, and award +1 unallocated attribute point.
  if (!isGateLockLevel(level)) {
    while (xp >= xpToNext && level < MAX_LEVEL && !isGateLockLevel(level)) {
      xp -= xpToNext;
      level += 1;
      unallocatedPoints += 1;
      xpToNext = xpToAdvanceFrom(level);

      if (isGateLockLevel(level)) {
        xp = Math.min(xp, xpToNext);
        break;
      }
    }
  }

  const isMaxLevel = level >= MAX_LEVEL;
  if (isMaxLevel) {
    xp = 0;
  }
  const atCap = !isMaxLevel && xpToNext > 0 && xp >= xpToNext;
  const isGateLocked = isGateLockLevel(level) && atCap;
  const trial = isGateLocked
    ? getTrialForLevel(level, input.trialProgress)
    : null;
  const trialComplete = isTrialComplete(trial);
  const xpPercent = isMaxLevel ? 100 : xpToNext <= 0 ? 0 : Math.min((xp / xpToNext) * 100, 100);

  return {
    level,
    xp,
    xpToNext,
    xpPercent,
    gold: input.gold ?? 0,
    unallocatedPoints,
    spentPoints,
    isGateLocked,
    isMaxLevel,
    nextLevel: isMaxLevel ? null : level + 1,
    tier: getTierForLevel(level),
    trial,
    trialComplete,
    attributes: { ...input.attributes },
    name: input.name,
    characterClass: input.characterClass,
  };
}

function trialProgressMap(trial: AscensionTrial | null): Record<string, number> {
  if (!trial) return {};
  return Object.fromEntries(trial.requirements.map((req) => [req.id, req.current]));
}

export function completeTrialRequirement(
  state: ProgressionState,
  requirementId: string,
): ProgressionState {
  if (!state.trial) return state;
  const progress = trialProgressMap(state.trial);
  const req = state.trial.requirements.find((item) => item.id === requirementId);
  if (!req || isRequirementComplete(req)) return state;
  progress[requirementId] = req.required;
  return buildProgressionState({
    level: state.level,
    xp: state.xp,
    gold: state.gold,
    unallocatedPoints: state.unallocatedPoints,
    spentPoints: state.spentPoints,
    attributes: state.attributes,
    trialProgress: progress,
    name: state.name,
    characterClass: state.characterClass,
  });
}

export function ascend(state: ProgressionState): ProgressionState {
  if (!state.isGateLocked || !state.trialComplete || state.nextLevel == null) {
    return state;
  }
  const nextLevel = state.nextLevel;
  const bump = nextLevel % 10 === 0 ? 6 : 3;
  return buildProgressionState({
    level: nextLevel,
    xp: 0,
    gold: state.gold,
    unallocatedPoints: (state.unallocatedPoints ?? 0) + 1,
    spentPoints: state.spentPoints ?? 0,
    attributes: {
      STR: Math.min(100, state.attributes.STR + bump),
      INT: Math.min(100, state.attributes.INT + bump),
      VIT: Math.min(100, state.attributes.VIT + bump),
      Routine: Math.min(100, state.attributes.Routine + bump),
    },
    name: state.name,
    characterClass: state.characterClass,
  });
}

export function createInitialProgression(input: {
  level: number;
  xp?: number;
  gold?: number;
  unallocatedPoints?: number;
  spentPoints?: number;
  attributes: ProgressionAttributes;
  trialProgress?: Record<string, number>;
  name: string;
  characterClass: string;
}): ProgressionState {
  const level = Math.min(Math.max(input.level, 1), MAX_LEVEL);
  const xpToNext = xpToAdvanceFrom(level);
  const xp = input.xp ?? (isGateLockLevel(level) ? xpToNext : Math.floor(xpToNext * 0.7));
  return buildProgressionState({
    ...input,
    level,
    xp,
    gold: input.gold ?? 0,
    unallocatedPoints: input.unallocatedPoints,
    spentPoints: input.spentPoints ?? 0,
  });
}

/**
 * Apply earned XP, gold, and an attribute point to the current state.
 * Handles automatic level-ups and gate locking at milestone boundaries.
 */
export function applyXpToState(
  state: ProgressionState,
  earnedXp: number,
  goldReward: number,
  attribute: keyof ProgressionAttributes,
): ProgressionState {
  if (state.isMaxLevel) {
    return {
      ...state,
      gold: state.gold + goldReward,
      attributes: {
        ...state.attributes,
        [attribute]: Math.min(100, state.attributes[attribute] + 1),
      },
    };
  }

  let xp = state.xp + earnedXp;
  let lvl = state.level;
  let xpToNext = state.xpToNext;
  let unallocatedPoints = state.unallocatedPoints ?? 0;

  // If at a gate lock level and XP is at cap, don't level up — just cap
  if (isGateLockLevel(lvl) && xp >= xpToNext) {
    xp = xpToNext; // cap at 100%
  } else {
    // Level up loop for non-gate levels
    while (xp >= xpToNext && lvl < MAX_LEVEL) {
      xp -= xpToNext;
      lvl += 1;
      unallocatedPoints += 1;
      xpToNext = xpToAdvanceFrom(lvl);

      // If we hit a gate lock level, cap and stop
      if (isGateLockLevel(lvl)) {
        xp = Math.min(xp, xpToNext);
        break;
      }
    }
  }

  const trialProgress = state.trial
    ? Object.fromEntries(state.trial.requirements.map((r) => [r.id, r.current]))
    : undefined;

  return buildProgressionState({
    level: lvl,
    xp,
    gold: state.gold + goldReward,
    unallocatedPoints,
    spentPoints: state.spentPoints ?? 0,
    attributes: {
      ...state.attributes,
      [attribute]: Math.min(100, state.attributes[attribute] + 1),
    },
    trialProgress,
    name: state.name,
    characterClass: state.characterClass,
  });
}
