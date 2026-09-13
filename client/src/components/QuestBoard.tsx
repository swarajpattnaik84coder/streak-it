import { useState } from "react";
import { motion } from "framer-motion";
import TaskRewardPill from "./TaskRewardPill";
import { QUESTS } from "../data/mockData.js";
import { BASE_XP, type TaskDifficulty } from "../lib/antiSpamEngine";
import { useAntiSpam } from "../lib/AntiSpamContext";
import { useProgression } from "../lib/ProgressionContext";
import type { ProgressionAttributes } from "../lib/evolutionEngine";

interface Quest {
  id: string;
  name: string;
  blurb: string;
  difficulty: TaskDifficulty;
}

/** Map quest id → attribute key for progression. */
const QUEST_ATTRIBUTE: Record<string, keyof ProgressionAttributes> = {
  gym: "STR",
  run: "STR",
  study: "INT",
  coding: "INT",
  water: "VIT",
  sleep: "VIT",
  bed: "Routine",
  laundry: "Routine",
};

/** Gold reward per difficulty tier. */
const GOLD_REWARD: Record<TaskDifficulty, number> = {
  ROUTINE: 15,
  CORE: 40,
};

export default function QuestBoard() {
  const { preview, completeTask, countForDifficulty } = useAntiSpam();
  const { awardXp } = useProgression();
  const [fulfilled, setFulfilled] = useState<Set<string>>(new Set());

  const handleFulfill = (quest: Quest) => {
    if (fulfilled.has(quest.id)) return;

    const award = completeTask({
      taskId: quest.id,
      taskDifficulty: quest.difficulty,
      claimedBaseReward: BASE_XP[quest.difficulty],
    });

    const attribute = QUEST_ATTRIBUTE[quest.id] ?? "Routine";
    const gold = GOLD_REWARD[quest.difficulty];
    awardXp(award.effectiveXp, attribute, gold);

    setFulfilled((prev) => new Set(prev).add(quest.id));
  };

  return (
    <section
      aria-label="Daily quest board"
      className="shrink-0 px-3 pt-2 pb-1"
      style={{
        background: "linear-gradient(180deg, #120e0a 0%, #0a090f 100%)",
        borderTop: "1px solid #2a2118",
      }}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2 px-0.5">
        <h2 className="text-[10px] font-cinzel font-bold tracking-[0.22em] uppercase text-gold">
          Today&apos;s Writs
        </h2>
        <p className="text-[9px] font-crimson italic text-rpg-muted hidden sm:block">
          Routine labor tires the realm. Core trials restore full honor.
        </p>
      </div>
      <div className="overflow-x-auto overflow-y-hidden flex flex-row flex-nowrap gap-4 pb-3 scrollbar-thin">
        {(QUESTS as Quest[]).map((quest, i) => {
          const count = countForDifficulty(quest.difficulty);
          const isFulfilled = fulfilled.has(quest.id);
          return (
            <motion.article
              key={quest.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="shrink-0 w-[240px] min-w-[240px] rounded px-2.5 py-2"
              style={{
                background: "linear-gradient(180deg, #e8d7b5 0%, #c8a876 100%)",
                border: "1px solid #6b4e24",
                boxShadow: "inset 0 0 12px rgba(80,50,10,0.12), 0 2px 8px rgba(0,0,0,0.35)",
              }}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className="text-[8px] font-cinzel font-bold tracking-widest uppercase"
                  style={{ color: quest.difficulty === "CORE" ? "#7f1d1d" : "#5c4310" }}
                >
                  {quest.difficulty}
                </span>
                <span className="text-[8px] tabular-nums text-stone-600">
                  {count} today
                </span>
              </div>
              <h3 className="text-[12px] font-cinzel font-bold text-stone-900 leading-tight">
                {quest.name}
              </h3>
              <p className="text-[10px] font-crimson italic text-stone-700 mt-0.5 mb-2 leading-snug">
                {quest.blurb}
              </p>
              <div className="flex flex-col items-stretch gap-1.5">
                <TaskRewardPill
                  completionCountToday={count}
                  taskDifficulty={quest.difficulty}
                  baseReward={BASE_XP[quest.difficulty]}
                />
                <button
                  type="button"
                  disabled={isFulfilled}
                  onClick={() => handleFulfill(quest)}
                  className={[
                    "text-[8px] font-cinzel font-bold tracking-wider uppercase px-1.5 py-1 rounded",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-700",
                    isFulfilled
                      ? "text-stone-600 cursor-default"
                      : "text-amber-50 hover:brightness-110",
                  ].join(" ")}
                  style={{
                    background: isFulfilled
                      ? "linear-gradient(180deg, #3a3a2a, #2a2a1a)"
                      : "linear-gradient(180deg, #6b1515, #3a0c0c)",
                    border: isFulfilled ? "1px solid #5a5a3a" : "1px solid #c9a84c",
                  }}
                >
                  {isFulfilled ? "Fulfilled ✓" : "Fulfill"}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
