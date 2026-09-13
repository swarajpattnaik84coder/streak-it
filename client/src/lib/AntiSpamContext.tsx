import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  loadLedgerFromStorage,
  previewTaskXp,
  recordCompletion,
  saveLedgerToStorage,
  type DailyCompletionLedger,
  type EffectiveXpResult,
  type RecordCompletionInput,
  type RecordCompletionResult,
  type TaskDifficulty,
} from "./antiSpamEngine";

interface AntiSpamContextValue {
  ledger: DailyCompletionLedger;
  preview: (input: RecordCompletionInput) => EffectiveXpResult;
  completeTask: (input: RecordCompletionInput) => EffectiveXpResult;
  countForDifficulty: (difficulty: TaskDifficulty) => number;
}

const AntiSpamContext = createContext<AntiSpamContextValue | null>(null);

export function AntiSpamProvider({ children }: { children: ReactNode }) {
  const [ledger, setLedger] = useState<DailyCompletionLedger>(() => loadLedgerFromStorage());

  const preview = useCallback(
    (input: RecordCompletionInput) => previewTaskXp(ledger, input),
    [ledger],
  );

  const completeTask = useCallback((input: RecordCompletionInput) => {
    let result: RecordCompletionResult | undefined;
    setLedger((prev) => {
      result = recordCompletion(prev, input);
      saveLedgerToStorage(result.ledger);
      return result.ledger;
    });
    return result!.award;
  }, []);

  const countForDifficulty = useCallback(
    (difficulty: TaskDifficulty) => ledger.byDifficulty[difficulty] ?? 0,
    [ledger],
  );

  const value = useMemo(
    () => ({ ledger, preview, completeTask, countForDifficulty }),
    [ledger, preview, completeTask, countForDifficulty],
  );

  return <AntiSpamContext.Provider value={value}>{children}</AntiSpamContext.Provider>;
}

export function useAntiSpam(): AntiSpamContextValue {
  const ctx = useContext(AntiSpamContext);
  if (!ctx) {
    throw new Error("useAntiSpam must be used within AntiSpamProvider");
  }
  return ctx;
}
