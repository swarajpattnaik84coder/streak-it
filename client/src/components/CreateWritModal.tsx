import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Shield, Zap, Heart, Flame } from "lucide-react";
import type { WritTask } from "../types/writ";
import type { TaskDifficulty } from "../lib/antiSpamEngine";

interface CreateWritModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<WritTask, "id" | "status">) => void;
}

const ATTRIBUTES = [
  { key: "STR", label: "Strength", icon: Flame, color: "#ef4444" },
  { key: "INT", label: "Intellect", icon: Zap, color: "#3b82f6" },
  { key: "VIT", label: "Vitality", icon: Heart, color: "#f97316" },
  { key: "Routine", label: "Discipline", icon: Shield, color: "#c9a84c" },
];

export default function CreateWritModal({
  isOpen,
  onClose,
  onSave,
}: CreateWritModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskDifficulty>("CORE");
  const [attribute, setAttribute] = useState("STR");
  const [isImportant, setIsImportant] = useState(false);

  // Sync rewards to category
  const xpReward = category === "CORE" ? 250 : 100;
  const goldReward = category === "CORE" ? 40 : 15;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setCategory("CORE");
      setAttribute("STR");
      setIsImportant(false);
    }
  }, [isOpen]);

  // Esc key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      attribute,
      xp: xpReward,
      gold: goldReward,
      isImportant,
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative z-10 w-full max-w-md rounded-xl p-6 font-cinzel text-[#2b1d0e] shadow-2xl border-2 border-[#593e28]"
          style={{
            background: "linear-gradient(180deg, #ede1c4 0%, #dfcaa0 100%)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.85), inset 0 0 40px rgba(89, 62, 40, 0.2)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#a37d53] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#8c4b18]" />
              <h2 className="text-base font-black uppercase tracking-wider text-[#3b2413]">
                Inscribe New Writ
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#593e28] hover:text-red-800 transition-colors p-1 text-lg font-bold leading-none"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-[#593e28] uppercase tracking-wide mb-1">
                Writ Title <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5km Cardio Run, 2h Code Sprint..."
                className="w-full px-3 py-2 rounded-lg bg-[#f5e9ce] border-2 border-[#a37d53] focus:border-[#8c4b18] focus:outline-none text-[#2b1d0e] placeholder-[#8c735d] font-crimson text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-[#593e28] uppercase tracking-wide mb-1">
                Decree & Context (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short purpose or lore description..."
                className="w-full px-3 py-2 rounded-lg bg-[#f5e9ce] border-2 border-[#a37d53] focus:border-[#8c4b18] focus:outline-none text-[#2b1d0e] placeholder-[#8c735d] font-crimson text-sm"
              />
            </div>

            {/* Category Selector (Routine vs Core) */}
            <div>
              <label className="block text-[11px] font-bold text-[#593e28] uppercase tracking-wide mb-1">
                Labor Tier & Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("ROUTINE")}
                  className={[
                    "py-2 px-3 rounded-lg border-2 font-bold text-xs transition-all flex flex-col items-center gap-0.5",
                    category === "ROUTINE"
                      ? "bg-[#593e28] text-[#f5ebd6] border-[#3b2413] shadow-inner"
                      : "bg-[#f5e9ce] text-[#593e28] border-[#a37d53] hover:border-[#593e28]",
                  ].join(" ")}
                >
                  <span>Routine Labor</span>
                  <span className="text-[9px] opacity-80 font-crimson italic">100 XP · 15 Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("CORE")}
                  className={[
                    "py-2 px-3 rounded-lg border-2 font-bold text-xs transition-all flex flex-col items-center gap-0.5",
                    category === "CORE"
                      ? "bg-[#7f1d1d] text-amber-100 border-[#450a0a] shadow-inner"
                      : "bg-[#f5e9ce] text-[#7f1d1d] border-[#a37d53] hover:border-[#7f1d1d]",
                  ].join(" ")}
                >
                  <span>Core Trial</span>
                  <span className="text-[9px] opacity-80 font-crimson italic">250 XP · 40 Gold</span>
                </button>
              </div>
            </div>

            {/* Attribute Tag Selector */}
            <div>
              <label className="block text-[11px] font-bold text-[#593e28] uppercase tracking-wide mb-1">
                Governing Attribute (+1 Point)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {ATTRIBUTES.map((attr) => {
                  const Icon = attr.icon;
                  const isSelected = attribute === attr.key;
                  return (
                    <button
                      key={attr.key}
                      type="button"
                      onClick={() => setAttribute(attr.key)}
                      className={[
                        "py-1.5 px-2 rounded-lg border text-[10px] font-bold flex flex-col items-center gap-1 transition-all",
                        isSelected
                          ? "bg-[#3b2413] text-[#f5ebd6] border-[#8c4b18] shadow-md"
                          : "bg-[#f5e9ce] text-[#593e28] border-[#a37d53] hover:bg-[#ebdcc0]",
                      ].join(" ")}
                    >
                      <Icon size={12} style={{ color: isSelected ? "#f5d878" : attr.color }} />
                      <span>{attr.key}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reward Preview Card */}
            <div className="p-3 rounded-lg bg-[#dfcaa0] border border-[#a37d53] flex items-center justify-between text-xs mt-1 font-bold">
              <span className="text-[#593e28] uppercase tracking-wider text-[10px]">
                Rewards Upon Fulfillment:
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[#8c4b18] font-black">+{xpReward} XP</span>
                <span className="text-[#6d4c2b] font-black">+{goldReward} Gold</span>
                <span className="text-[#3b2413] text-[10px]">+{attribute}</span>
              </div>
            </div>

            {/* Priority Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer mt-0.5 select-none">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-[#7a552b] accent-[#8c4b18]"
              />
              <span className="text-[11px] font-bold text-[#3b2413]">
                Mark as Most Important (Priority ⭐)
              </span>
            </label>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#a37d53] mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#7a552b] text-[#593e28] font-bold hover:bg-[#dfcaa0] transition-colors uppercase text-[11px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-5 py-2 rounded-lg bg-[#593e28] hover:bg-[#3b2413] text-[#f5ebd6] font-bold uppercase text-[11px] tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-[#8c643b]"
              >
                Forge Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
