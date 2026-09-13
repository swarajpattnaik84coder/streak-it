import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Trash2, Star } from "lucide-react";
import TaskRewardPill from "./TaskRewardPill";
import type { WritTask } from "../types/writ";
import type { TaskDifficulty } from "../lib/antiSpamEngine";

interface WritCardProps {
  task: WritTask;
  index: number;
  count: number;
  onFulfill: (task: WritTask) => void;
  onDelete: (id: string) => void;
  onToggleImportant: (id: string) => void;
}

export default function WritCard({
  task,
  index,
  count,
  onFulfill,
  onDelete,
  onToggleImportant,
}: WritCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isFulfilled = task.status === "fulfilled";

  // Auto-close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutside = (e: MouseEvent | PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isMenuOpen]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={[
        "relative shrink-0 w-[240px] min-w-[240px] rounded px-3 py-2.5 flex flex-col justify-between transition-all duration-200",
        task.isImportant
          ? "border-2 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/40"
          : "border border-[#6b4e24] shadow-[inset_0_0_12px_rgba(80,50,10,0.12),0_2px_8px_rgba(0,0,0,0.35)]",
      ].join(" ")}
      style={{
        background: task.isImportant
          ? "linear-gradient(180deg, #f0e2c6 0%, #d4b480 100%)"
          : "linear-gradient(180deg, #e8d7b5 0%, #c8a876 100%)",
      }}
    >
      {/* Card Header: Category, Priority Badge, 3-dots */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[8px] font-cinzel font-black tracking-widest uppercase"
              style={{ color: task.category === "CORE" ? "#7f1d1d" : "#5c4310" }}
            >
              {task.category}
            </span>

            {task.attribute && (
              <span className="text-[7.5px] font-cinzel font-bold px-1 py-0.2 rounded bg-black/10 text-stone-700 uppercase">
                {task.attribute}
              </span>
            )}

            {task.isImportant && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[7.5px] font-cinzel font-black uppercase bg-amber-500/25 border border-amber-600/50 text-[#543007] shadow-xs">
                <Star size={9} className="text-amber-600 fill-amber-500" />
                PRIORITY
              </span>
            )}
          </div>

          {/* 3-dots dropdown menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              aria-label="Writ options"
              className="w-5 h-5 rounded flex items-center justify-center text-stone-700 hover:text-amber-950 hover:bg-black/10 transition-colors"
            >
              <MoreVertical size={13} />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-6 z-40 w-44 rounded-md p-1 font-cinzel shadow-2xl"
                style={{
                  background: "linear-gradient(180deg, #221810 0%, #140d08 100%)",
                  border: "1px solid #7a5a2d",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.85)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onToggleImportant(task.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-bold text-amber-200 hover:text-amber-100 hover:bg-[#382618] transition-colors flex items-center gap-2"
                >
                  <Star
                    size={11}
                    className={task.isImportant ? "text-amber-400 fill-amber-400" : "text-amber-300"}
                  />
                  {task.isImportant ? "Unmark Important" : "Mark as Most Important"}
                </button>
                <div className="my-0.5 border-t border-[#3d2a1c]" />
                <button
                  type="button"
                  onClick={() => {
                    onDelete(task.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={11} />
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-[12px] font-cinzel font-bold text-stone-900 leading-tight">
          {task.title}
        </h3>
        <p className="text-[10px] font-crimson italic text-stone-700 mt-0.5 mb-2 leading-snug line-clamp-2">
          {task.description || "No description provided."}
        </p>
      </div>

      {/* Footer: Reward Pill and Fulfill Button */}
      <div className="flex flex-col items-stretch gap-1.5 mt-2">
        <div className="flex items-center justify-between gap-1">
          <TaskRewardPill
            completionCountToday={count}
            taskDifficulty={task.category as TaskDifficulty}
            baseReward={task.xp}
          />
          <span className="text-[8px] tabular-nums text-stone-600 font-cinzel shrink-0">
            {count} today
          </span>
        </div>

        <button
          type="button"
          disabled={isFulfilled}
          onClick={() => onFulfill(task)}
          className={[
            "text-[8.5px] font-cinzel font-bold tracking-wider uppercase px-2 py-1 rounded transition-all",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-700",
            isFulfilled
              ? "text-stone-500 cursor-default opacity-85"
              : "text-amber-50 hover:brightness-110 active:scale-[0.98]",
          ].join(" ")}
          style={{
            background: isFulfilled
              ? "linear-gradient(180deg, #38362d, #25241d)"
              : "linear-gradient(180deg, #6b1515, #3a0c0c)",
            border: isFulfilled ? "1px solid #5a5745" : "1px solid #c9a84c",
          }}
        >
          {isFulfilled ? "Fulfilled ✓" : "Fulfill"}
        </button>
      </div>
    </motion.article>
  );
}
