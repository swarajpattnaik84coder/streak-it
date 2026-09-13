import type { TaskDifficulty } from "../lib/antiSpamEngine";

export interface WritTask {
  id: string;
  title: string;
  description: string;
  category: TaskDifficulty; // 'ROUTINE' | 'CORE'
  attribute: string; // 'STR' | 'INT' | 'VIT' | 'Routine'
  xp: number;
  gold: number;
  status: "pending" | "fulfilled";
  isImportant: boolean;
}
