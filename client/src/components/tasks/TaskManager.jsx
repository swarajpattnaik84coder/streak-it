import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import TaskModal from "./TaskModal.jsx";

const CAT_COLORS = {
  STR: "#ef4444",
  INT: "#3b82f6",
  FOC: "#a855f7",
  AGI: "#22c55e",
  VIT: "#f97316",
};

export default function TaskManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const { tasks, toggleTask, deleteTask, levelUpMessage } = useAuth();

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-4">
      {/* Level Up Banner Notification */}
      <AnimatePresence>
        {levelUpMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-stone-950 font-cinzel font-bold text-center text-sm shadow-xl tracking-wider"
          >
            ⚔️ {levelUpMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Manager Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-rpg bg-[#0f0e1c]">
        <div>
          <h2 className="text-base font-cinzel font-bold text-stone-100 uppercase tracking-widest">
            Daily Task Log (Quests)
          </h2>
          <p className="text-xs text-rpg-muted font-crimson">
            Complete real-world tasks to level up your character and gain Gold
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
        >
          + Add Quest
        </button>
      </div>

      {/* Task Filters */}
      <div className="flex gap-2">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-cinzel capitalize transition-colors ${
              filter === f
                ? "bg-amber-950/50 border border-amber-500/50 text-amber-300 font-bold"
                : "bg-[#141224] text-stone-400 hover:text-stone-200 border border-transparent"
            }`}
          >
            {f} ({tasks.filter((t) => (f === "pending" ? !t.isCompleted : f === "completed" ? t.isCompleted : true)).length})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-rpg bg-[#0b0a16] text-rpg-muted text-xs font-crimson">
            No quests found in this category. Add a new task to get started!
          </div>
        ) : (
          filteredTasks.map((t) => (
            <motion.div
              key={t._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border transition-all ${
                t.isCompleted
                  ? "bg-[#0a0914]/60 border-[#1e1c30] opacity-75"
                  : "bg-[#131126] border-[#252240] hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(t._id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    t.isCompleted
                      ? "bg-amber-500 border-amber-400 text-stone-950 font-bold"
                      : "border-stone-600 hover:border-amber-400 bg-[#0d0c18]"
                  }`}
                >
                  {t.isCompleted && "✓"}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold font-cinzel text-white uppercase"
                      style={{ backgroundColor: CAT_COLORS[t.category] || "#a855f7" }}
                    >
                      {t.category}
                    </span>
                    <h3
                      className={`text-xs font-semibold truncate ${
                        t.isCompleted ? "line-through text-stone-500" : "text-stone-100"
                      }`}
                    >
                      {t.title}
                    </h3>
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-rpg-muted truncate mt-0.5 font-crimson">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Rewards & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-cinzel">
                  <span className="text-amber-400 font-bold">+{t.xpReward} XP</span>
                  <span className="text-gold font-bold">+{t.currencyReward} Gold</span>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(t._id)}
                  className="text-stone-600 hover:text-red-400 text-sm leading-none p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
