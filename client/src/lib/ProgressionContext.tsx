import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PLAYER, NEW_PLAYER_PRESET } from "../data/mockData.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ascend as ascendState,
  applyXpToState,
  buildProgressionState,
  completeTrialRequirement,
  createInitialProgression,
  type ProgressionAttributes,
  type ProgressionState,
} from "./evolutionEngine";

const PROGRESSION_STORAGE_KEY = "streak_player_progression";

interface ProgressionContextValue {
  state: ProgressionState;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  completeRequirement: (requirementId: string) => void;
  breakSealAndAscend: () => boolean;
  awardXp: (earnedXp: number, attribute: keyof ProgressionAttributes, gold: number) => void;
  addXp: (earnedXp: number, attribute?: keyof ProgressionAttributes, gold?: number) => void;
  allocatePoint: (statKey: string) => void;
  spendGold: (amount: number) => boolean;
  levelUpToast: string | null;
  resetProgression: (preset?: any) => void;
}

const ProgressionContext = createContext<ProgressionContextValue | null>(null);

function loadInitialProgression(): ProgressionState {
  try {
    const saved = localStorage.getItem(PROGRESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.level === "number" && typeof parsed.xp === "number") {
        return buildProgressionState({
          level: parsed.level,
          xp: parsed.xp,
          gold: parsed.gold ?? 50,
          unallocatedPoints: parsed.unallocatedPoints ?? 0,
          spentPoints: parsed.spentPoints ?? 0,
          attributes: parsed.attributes ?? { STR: 50, INT: 50, VIT: 50, Routine: 50 },
          name: parsed.name ?? "Adventurer",
          characterClass: parsed.characterClass ?? "Novice",
        });
      }
    }
  } catch (err) {
    console.error("Error reading progression from localStorage:", err);
  }

  return createInitialProgression({
    level: PLAYER.level,
    xp: PLAYER.xp,
    gold: PLAYER.currency,
    unallocatedPoints: PLAYER.unallocatedStatPoints ?? 3,
    spentPoints: 0,
    attributes: {
      STR: PLAYER.stats.find((s: { key: string }) => s.key === "STR")?.value ?? 68,
      INT: PLAYER.stats.find((s: { key: string }) => s.key === "INT")?.value ?? 82,
      VIT: PLAYER.stats.find((s: { key: string }) => s.key === "VIT")?.value ?? 71,
      Routine: 64,
    },
    trialProgress: {
      streak: PLAYER.streak,
      "core-tasks": 3,
    },
    name: PLAYER.name,
    characterClass: PLAYER.class,
  });
}

export function ProgressionProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuth();
  const [state, setState] = useState<ProgressionState>(loadInitialProgression);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);
  const resetProgression = useCallback((preset = NEW_PLAYER_PRESET) => {
    const fresh = createInitialProgression({
      level: preset.level ?? 1,
      xp: preset.xp ?? 0,
      gold: preset.gold ?? preset.currency ?? 50,
      unallocatedPoints: preset.unallocatedStatPoints ?? 0,
      spentPoints: 0,
      attributes: {
        STR: 50,
        INT: 50,
        VIT: 50,
        Routine: 50,
      },
      name: preset.name ?? "Novice Wanderer",
      characterClass: preset.class ?? "Novice",
    });
    setState(fresh);
    try {
      localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(fresh));
    } catch {}
  }, []);

  // Sync with AuthContext user when account switches
  useEffect(() => {
    if (user && user.name && user.name !== state.name) {
      resetProgression(user);
    }
  }, [user, state.name, resetProgression]);

  // Persist state to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Error writing progression to localStorage:", err);
    }
  }, [state]);

  // Level-up celebration toast listener
  useEffect(() => {
    if (state.lastLevelUp) {
      const msg = `LEVEL UP! You reached Level ${state.lastLevelUp.level}! +${state.lastLevelUp.goldAwarded} Gold Awarded!`;
      setLevelUpToast(msg);
      const timer = setTimeout(() => setLevelUpToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [state.lastLevelUp]);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const completeRequirement = useCallback((requirementId: string) => {
    setState((prev) => completeTrialRequirement(prev, requirementId));
  }, []);

  const breakSealAndAscend = useCallback(() => {
    let didAscend = false;
    setState((prev) => {
      const next = ascendState(prev);
      didAscend = next.level !== prev.level;
      if (setUser && next.gold !== prev.gold) {
        setUser((u: any) => ({ ...u, currency: next.gold, gold: next.gold }));
      }
      return next;
    });
    return didAscend;
  }, [setUser]);

  const awardXp = useCallback(
    (earnedXp: number, attribute: keyof ProgressionAttributes, gold: number) => {
      setState((prev) => {
        const next = applyXpToState(prev, earnedXp, gold, attribute);
        if (setUser && next.gold !== prev.gold) {
          setUser((u: any) => ({ ...u, currency: next.gold, gold: next.gold }));
        }
        return next;
      });
    },
    [setUser],
  );

  const addXp = useCallback(
    (earnedXp: number, attribute: keyof ProgressionAttributes = "Routine", gold: number = 0) => {
      setState((prev) => {
        const next = applyXpToState(prev, earnedXp, gold, attribute);
        if (setUser && next.gold !== prev.gold) {
          setUser((u: any) => ({ ...u, currency: next.gold, gold: next.gold }));
        }
        return next;
      });
    },
    [setUser],
  );

  const spendGold = useCallback((amount: number): boolean => {
    let success = false;
    setState((prev) => {
      const current = prev.gold ?? 0;
      if (current < amount) {
        success = false;
        return prev;
      }
      success = true;
      const nextGold = current - amount;
      if (setUser) {
        setUser((u: any) => ({ ...u, currency: nextGold, gold: nextGold }));
      }
      return {
        ...prev,
        gold: nextGold,
      };
    });
    return success;
  }, [setUser]);

  const allocatePoint = useCallback((statKey: string) => {
    setState((prev) => {
      const unallocated = prev.unallocatedPoints ?? 0;
      if (unallocated <= 0) return prev;

      const upper = statKey.toUpperCase();
      const attrKey: keyof ProgressionAttributes | null =
        upper === "ROUTINE" ? "Routine"
        : upper === "STR" ? "STR"
        : upper === "INT" ? "INT"
        : upper === "VIT" ? "VIT"
        : null;

      if (!attrKey) return prev;
      const currentVal = prev.attributes[attrKey] ?? 50;
      if (currentVal >= 100) return prev;

      return {
        ...prev,
        unallocatedPoints: Math.max(0, unallocated - 1),
        spentPoints: (prev.spentPoints ?? 0) + 1,
        attributes: {
          ...prev.attributes,
          [attrKey]: Math.min(100, currentVal + 1),
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      sheetOpen,
      openSheet,
      closeSheet,
      completeRequirement,
      breakSealAndAscend,
      awardXp,
      addXp,
      allocatePoint,
      spendGold,
      levelUpToast,
      resetProgression,
    }),
    [
      state,
      sheetOpen,
      openSheet,
      closeSheet,
      completeRequirement,
      breakSealAndAscend,
      awardXp,
      addXp,
      allocatePoint,
      spendGold,
      levelUpToast,
      resetProgression,
    ],
  );

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
}

export function useProgression(): ProgressionContextValue {
  const ctx = useContext(ProgressionContext);
  if (!ctx) {
    throw new Error("useProgression must be used within ProgressionProvider");
  }
  return ctx;
}
