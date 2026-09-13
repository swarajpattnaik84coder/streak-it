import type { TaskDifficulty } from "../lib/antiSpamEngine";

export interface WritTask {
  id: string;
  title: string;
  description: string;
  category: TaskDifficulty; // 'ROUTINE' | 'CORE'
  attribute: string; // 'STR' | 'INT' | 'VIT' | 'Routine'
  xp: number; // base XP (e.g. 100 or 250)
  baseXp?: number; // base XP without favorite bonus
  gold: number;
  status: "pending" | "fulfilled";
  isImportant?: boolean;
  isFavorite?: boolean;
}
