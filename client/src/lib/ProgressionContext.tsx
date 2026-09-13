import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { PLAYER } from "../data/mockData.js";
import {
  ascend as ascendState,
  applyXpToState,
  completeTrialRequirement,
  createInitialProgression,
  type ProgressionAttributes,
  type ProgressionState,
} from "./evolutionEngine";

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
}

const ProgressionContext = createContext<ProgressionContextValue | null>(null);

export function ProgressionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressionState>(() =>
    createInitialProgression({
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
    }),
  );
  const [sheetOpen, setSheetOpen] = useState(false);

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
      return next;
    });
    return didAscend;
  }, []);

  const awardXp = useCallback(
    (earnedXp: number, attribute: keyof ProgressionAttributes, gold: number) => {
      setState((prev) => applyXpToState(prev, earnedXp, gold, attribute));
    },
    [],
  );

  const addXp = useCallback(
    (earnedXp: number, attribute: keyof ProgressionAttributes = "Routine", gold: number = 0) => {
      setState((prev) => applyXpToState(prev, earnedXp, gold, attribute));
    },
    [],
  );

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
    }),
    [state, sheetOpen, openSheet, closeSheet, completeRequirement, breakSealAndAscend, awardXp, addXp, allocatePoint],
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
