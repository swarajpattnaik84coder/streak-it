export type TaskDifficulty = "ROUTINE" | "CORE";

export type FatigueTier = "full" | "fatigued" | "exhausted";

export interface CalculateEffectiveXpParams {
  baseReward: number;
  taskDifficulty: TaskDifficulty;
  completionCountToday: number;
}

export interface EffectiveXpResult {
  effectiveXp: number;
  penaltyPercent: number;
  isDiminished: boolean;
  multiplier: number;
  attemptNumber: number;
  fatigueTier: FatigueTier;
  canonicalBase: number;
}

export interface DailyCompletionLedger {
  localDateKey: string;
  /** Completions today keyed by task id. */
  tasksCompletedToday: Record<string, number>;
  /** Completions today keyed by difficulty tier. */
  byDifficulty: Record<TaskDifficulty, number>;
}

export interface RecordCompletionInput {
  taskId: string;
  taskDifficulty: TaskDifficulty;
  claimedBaseReward?: number;
}

export interface RecordCompletionResult {
  ledger: DailyCompletionLedger;
  award: EffectiveXpResult;
}

export const BASE_XP: Record<TaskDifficulty, number> = {
  ROUTINE: 100,
  CORE: 250,
};

const FULL_ATTEMPTS = 3;
const FATIGUE_ATTEMPT = 4;
const EXHAUST_ATTEMPT = 5;
const FLOOR_MULTIPLIER = 0.2;
export const LEDGER_STORAGE_KEY = "streak-it:anti-spam-ledger:v1";

function isDifficulty(value: string): value is TaskDifficulty {
  return value === "ROUTINE" || value === "CORE";
}

/** Local calendar day key (YYYY-MM-DD) — resets the ledger at local midnight. */
export function localDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createEmptyLedger(now: Date = new Date()): DailyCompletionLedger {
  return {
    localDateKey: localDateKey(now),
    tasksCompletedToday: {},
    byDifficulty: { ROUTINE: 0, CORE: 0 },
  };
}

/**
 * Canonical grant for a difficulty. Inflated client `claimedBase` is clamped
 * so XP cannot be farmed by mutating the payload.
 */
export function resolveCanonicalBaseReward(
  taskDifficulty: TaskDifficulty,
  claimedBaseReward?: number,
): number {
  const catalog = BASE_XP[taskDifficulty];
  if (claimedBaseReward == null || !Number.isFinite(claimedBaseReward)) {
    return catalog;
  }
  return Math.min(catalog, Math.max(0, Math.floor(claimedBaseReward)));
}

/**
 * 1-based attempt for the *next* completion given how many are already done today.
 * `completionCountToday === 0` → attempt 1.
 */
export function nextAttemptNumber(completionCountToday: number): number {
  if (!Number.isFinite(completionCountToday) || completionCountToday < 0) return 1;
  return Math.floor(completionCountToday) + 1;
}

export function rewardMultiplier(attemptNumber: number): number {
  if (attemptNumber <= FULL_ATTEMPTS) return 1;
  if (attemptNumber === FATIGUE_ATTEMPT) return 0.8;
  if (attemptNumber === EXHAUST_ATTEMPT) return 0.5;
  return FLOOR_MULTIPLIER;
}

export function fatigueTierForAttempt(attemptNumber: number): FatigueTier {
  if (attemptNumber <= FULL_ATTEMPTS) return "full";
  if (attemptNumber === FATIGUE_ATTEMPT) return "fatigued";
  return "exhausted";
}

/**
 * Pure, deterministic XP grant. `completionCountToday` is how many times this
 * difficulty (or task) has already been completed today (0-based). The result
 * is the award for the upcoming attempt.
 */
export function calculateEffectiveXp(params: CalculateEffectiveXpParams): EffectiveXpResult {
  const difficulty: TaskDifficulty = isDifficulty(params.taskDifficulty)
    ? params.taskDifficulty
    : "ROUTINE";
  const canonicalBase = resolveCanonicalBaseReward(difficulty, params.baseReward);
  const attemptNumber = nextAttemptNumber(params.completionCountToday);
  const multiplier = rewardMultiplier(attemptNumber);
  const floorXp = Math.max(1, Math.floor(canonicalBase * FLOOR_MULTIPLIER));
  const scaled = Math.floor(canonicalBase * multiplier);
  const effectiveXp = Math.max(floorXp, scaled);
  const penaltyPercent = Math.round((1 - multiplier) * 100);

  return {
    effectiveXp,
    penaltyPercent,
    isDiminished: multiplier < 1,
    multiplier,
    attemptNumber,
    fatigueTier: fatigueTierForAttempt(attemptNumber),
    canonicalBase,
  };
}

export function ensureCurrentDay(
  ledger: DailyCompletionLedger | null | undefined,
  now: Date = new Date(),
): DailyCompletionLedger {
  const today = localDateKey(now);
  if (!ledger || ledger.localDateKey !== today) {
    return createEmptyLedger(now);
  }
  return {
    localDateKey: today,
    tasksCompletedToday: { ...ledger.tasksCompletedToday },
    byDifficulty: {
      ROUTINE: Math.max(0, Math.floor(ledger.byDifficulty?.ROUTINE ?? 0)),
      CORE: Math.max(0, Math.floor(ledger.byDifficulty?.CORE ?? 0)),
    },
  };
}

export function getDifficultyCount(
  ledger: DailyCompletionLedger,
  difficulty: TaskDifficulty,
  now: Date = new Date(),
): number {
  return ensureCurrentDay(ledger, now).byDifficulty[difficulty];
}

export function getTaskCount(
  ledger: DailyCompletionLedger,
  taskId: string,
  now: Date = new Date(),
): number {
  return ensureCurrentDay(ledger, now).tasksCompletedToday[taskId] ?? 0;
}

export function previewTaskXp(
  ledger: DailyCompletionLedger,
  input: RecordCompletionInput,
  now: Date = new Date(),
): EffectiveXpResult {
  const fresh = ensureCurrentDay(ledger, now);
  const count = fresh.byDifficulty[input.taskDifficulty] ?? 0;
  return calculateEffectiveXp({
    baseReward: resolveCanonicalBaseReward(input.taskDifficulty, input.claimedBaseReward),
    taskDifficulty: input.taskDifficulty,
    completionCountToday: count,
  });
}

/** Pure ledger transition — award XP only from this result, never from the client payload. */
export function recordCompletion(
  ledger: DailyCompletionLedger,
  input: RecordCompletionInput,
  now: Date = new Date(),
): RecordCompletionResult {
  const next = ensureCurrentDay(ledger, now);
  const award = calculateEffectiveXp({
    baseReward: resolveCanonicalBaseReward(input.taskDifficulty, input.claimedBaseReward),
    taskDifficulty: input.taskDifficulty,
    completionCountToday: next.byDifficulty[input.taskDifficulty] ?? 0,
  });
  const taskId = input.taskId.trim();
  return {
    award,
    ledger: {
      localDateKey: next.localDateKey,
      tasksCompletedToday: {
        ...next.tasksCompletedToday,
        [taskId]: (next.tasksCompletedToday[taskId] ?? 0) + 1,
      },
      byDifficulty: {
        ...next.byDifficulty,
        [input.taskDifficulty]: (next.byDifficulty[input.taskDifficulty] ?? 0) + 1,
      },
    },
  };
}

export function loadLedgerFromStorage(
  storage: Pick<Storage, "getItem"> | null = typeof localStorage === "undefined" ? null : localStorage,
  now: Date = new Date(),
): DailyCompletionLedger {
  if (!storage) return createEmptyLedger(now);
  try {
    const raw = storage.getItem(LEDGER_STORAGE_KEY);
    if (!raw) return createEmptyLedger(now);
    const parsed = JSON.parse(raw) as DailyCompletionLedger;
    return ensureCurrentDay(parsed, now);
  } catch {
    return createEmptyLedger(now);
  }
}

export function saveLedgerToStorage(
  ledger: DailyCompletionLedger,
  storage: Pick<Storage, "setItem"> | null = typeof localStorage === "undefined" ? null : localStorage,
): void {
  if (!storage) return;
  try {
    storage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
  } catch {
    /* quota / private mode — tracking still works in-memory */
  }
}
