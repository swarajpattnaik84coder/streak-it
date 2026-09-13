import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import TaskModal from "./TaskModal.jsx";

const CAT_COLORS = {
  STR: "#8c3b18",
  INT: "#2b568c",
  FOC: "#643b8c",
  AGI: "#2b7a42",
  VIT: "#8c5818",
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
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col gap-4 font-cinzel">
      {/* Level Up Banner Notification */}
      <AnimatePresence>
        {levelUpMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-lg bg-gradient-to-r from-[#c49339] to-[#8c6421] text-[#2c1b0e] font-black text-center text-sm shadow-xl tracking-widest uppercase border-2 border-[#5c4028]"
          >
            ⚔️ {levelUpMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Manager Parchment Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] shadow-lg text-[#2b1d0e]">
        <div>
          <h2 className="text-base font-black uppercase tracking-widest text-[#3b2413]">
            Daily Quest Log & Tasks
          </h2>
          <p className="text-xs font-crimson text-[#6e4e31]">
            Complete real-world tasks to level up your character and gain Gold
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#593e28] hover:bg-[#3b2413] text-[#f5ebd6] font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 border border-[#8c643b]"
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
            className={`px-3 py-1.5 rounded-md text-xs uppercase font-bold transition-all border ${
              filter === f
                ? "bg-[#593e28] border-[#8c643b] text-[#f5ebd6] shadow-md"
                : "bg-[#251d16] text-[#b89f84] hover:text-[#f5ebd6] border-[#423122]"
            }`}
          >
            {f} ({tasks.filter((t) => (f === "pending" ? !t.isCompleted : f === "completed" ? t.isCompleted : true)).length})
          </button>
        ))}
      </div>

      {/* Tasks Parchment Cards List */}
      <div className="flex flex-col gap-2.5 font-crimson">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] text-[#593e28] text-sm font-semibold">
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
              className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border-2 transition-all shadow-md ${
                t.isCompleted
                  ? "bg-[#d9c6a3]/70 border-[#8c6e51] opacity-75"
                  : "bg-[#ede1c4] border-[#593e28] hover:border-[#8c643b]"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(t._id)}
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                    t.isCompleted
                      ? "bg-[#593e28] border-[#3b2413] text-[#f5ebd6] font-bold text-sm"
                      : "border-[#7a552b] hover:border-[#3b2413] bg-[#f5e9ce]"
                  }`}
                >
                  {t.isCompleted && "✓"}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-bold font-cinzel text-white uppercase"
                      style={{ backgroundColor: CAT_COLORS[t.category] || "#643b8c" }}
                    >
                      {t.category}
                    </span>
                    <h3
                      className={`text-sm font-bold truncate ${
                        t.isCompleted ? "line-through text-[#7a634b]" : "text-[#2b1d0e]"
                      }`}
                    >
                      {t.title}
                    </h3>
                  </div>
                  {t.description && (
                    <p className="text-xs text-[#59432d] truncate mt-0.5">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Rewards & Actions */}
              <div className="flex items-center gap-3 shrink-0 font-cinzel">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-[#8c4b18]">+{t.xpReward} XP</span>
                  <span className="text-[#6d4c2b]">+{t.currencyReward} Gold</span>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(t._id)}
                  className="text-[#8c5828] hover:text-red-800 text-base leading-none p-1 transition-colors font-bold"
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
