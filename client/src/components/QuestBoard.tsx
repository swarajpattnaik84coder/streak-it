import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useAntiSpam } from "../lib/AntiSpamContext";
import { useProgression } from "../lib/ProgressionContext";
import type { ProgressionAttributes } from "../lib/evolutionEngine";
import type { WritTask } from "../types/writ";
import WritCard from "./WritCard";
import CreateWritModal from "./CreateWritModal";

const STORAGE_KEY = "streak_writs_v2";

const INITIAL_WRITS: WritTask[] = [
  {
    id: "water",
    title: "Drink Water",
    description: "A humble cup for the road.",
    category: "ROUTINE",
    attribute: "VIT",
    xp: 100,
    gold: 15,
    status: "pending",
    isImportant: false,
  },
  {
    id: "bed",
    title: "Make Bed",
    description: "Order the chamber before dawn.",
    category: "ROUTINE",
    attribute: "Routine",
    xp: 100,
    gold: 15,
    status: "pending",
    isImportant: false,
  },
  {
    id: "laundry",
    title: "Laundry",
    description: "Wash the travel cloaks.",
    category: "ROUTINE",
    attribute: "Routine",
    xp: 100,
    gold: 15,
    status: "pending",
    isImportant: false,
  },
  {
    id: "sleep",
    title: "Sleep Well",
    description: "Rest enough to hold the watch.",
    category: "ROUTINE",
    attribute: "VIT",
    xp: 100,
    gold: 15,
    status: "pending",
    isImportant: false,
  },
  {
    id: "gym",
    title: "Gym Session",
    description: "Train body as one trains a blade.",
    category: "CORE",
    attribute: "STR",
    xp: 250,
    gold: 40,
    status: "pending",
    isImportant: true,
  },
  {
    id: "run",
    title: "Running",
    description: "The long road builds the lung.",
    category: "CORE",
    attribute: "STR",
    xp: 250,
    gold: 40,
    status: "pending",
    isImportant: false,
  },
  {
    id: "study",
    title: "Deep Study",
    description: "Master the scrolls, not the margins.",
    category: "CORE",
    attribute: "INT",
    xp: 250,
    gold: 40,
    status: "pending",
    isImportant: false,
  },
  {
    id: "coding",
    title: "Coding Logic",
    description: "Forge logic in quiet hours.",
    category: "CORE",
    attribute: "INT",
    xp: 250,
    gold: 40,
    status: "pending",
    isImportant: false,
  },
];

function loadInitialWrits(): WritTask[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading writs from localStorage:", err);
  }
  return INITIAL_WRITS;
}

export default function QuestBoard() {
  const { completeTask, countForDifficulty } = useAntiSpam();
  const { awardXp } = useProgression();
  const [writs, setWrits] = useState<WritTask[]>(loadInitialWrits);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(writs));
    } catch (err) {
      console.error("Error writing writs to localStorage:", err);
    }
  }, [writs]);

  // Fulfill Task
  const handleFulfill = useCallback(
    (task: WritTask) => {
      if (task.status === "fulfilled") return;

      const award = completeTask({
        taskId: task.id,
        taskDifficulty: task.category,
        claimedBaseReward: task.xp,
      });

      const attr = (task.attribute || "Routine") as keyof ProgressionAttributes;
      awardXp(award.effectiveXp, attr, task.gold);

      setWrits((prev) =>
        prev.map((w) => (w.id === task.id ? { ...w, status: "fulfilled" } : w))
      );
    },
    [completeTask, awardXp]
  );

  // Toggle Important (Priority)
  const handleToggleImportant = useCallback((id: string) => {
    setWrits((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isImportant: !w.isImportant } : w))
    );
  }, []);

  // Delete Task
  const handleDeleteWrit = useCallback((id: string) => {
    setWrits((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Create Task
  const handleCreateWrit = useCallback(
    (taskData: Omit<WritTask, "id" | "status">) => {
      const newWrit: WritTask = {
        ...taskData,
        id: `writ_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        status: "pending",
      };
      setWrits((prev) => [...prev, newWrit]);
    },
    []
  );

  return (
    <section
      aria-label="Daily quest board"
      className="shrink-0 px-3 pt-2 pb-6"
      style={{
        background: "linear-gradient(180deg, #120e0a 0%, #0a090f 100%)",
        borderTop: "1px solid #2a2118",
      }}
    >
      {/* Board Header */}
      <div className="flex items-baseline justify-between gap-3 mb-2 px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] font-cinzel font-bold tracking-[0.22em] uppercase text-gold">
            Today&apos;s Writs
          </h2>
          <span className="text-[9px] font-cinzel text-amber-500/80 font-semibold">
            ({writs.filter((w) => w.status === "fulfilled").length}/{writs.length} Complete)
          </span>
        </div>
        <p className="text-[9px] font-crimson italic text-rpg-muted hidden sm:block">
          Routine labor tires the realm. Core trials restore full honor.
        </p>
      </div>

      {/* Horizontal scrolling strip */}
      <div className="overflow-x-auto overflow-y-hidden flex flex-row flex-nowrap gap-4 pb-4 pt-1 scrollbar-thin">
        {writs.map((task, i) => (
          <WritCard
            key={task.id}
            task={task}
            index={i}
            count={countForDifficulty(task.category)}
            onFulfill={handleFulfill}
            onDelete={handleDeleteWrit}
            onToggleImportant={handleToggleImportant}
          />
        ))}

        {/* + Add Writ placeholder card at end */}
        <motion.button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: writs.length * 0.03 }}
          className="shrink-0 w-[240px] min-w-[240px] min-h-[170px] rounded border-2 border-dashed border-[#8c6b3e]/60 hover:border-amber-400 bg-[#160f09]/60 hover:bg-[#24170d] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 group text-center shadow-inner select-none"
        >
          <div className="w-10 h-10 rounded-full border border-amber-600/50 bg-[#3d2715]/80 flex items-center justify-center text-amber-300 group-hover:text-amber-100 group-hover:scale-110 group-hover:border-amber-400 transition-all shadow-md">
            <Plus size={20} />
          </div>
          <span className="font-cinzel font-bold text-xs uppercase text-amber-300 tracking-wider group-hover:text-amber-200">
            Craft New Writ
          </span>
          <span className="font-crimson italic text-[11px] text-stone-400">
            Inscribe a custom trial
          </span>
        </motion.button>
      </div>

      {/* Create Modal */}
      <CreateWritModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateWrit}
      />
    </section>
  );
}
