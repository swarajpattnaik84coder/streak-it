import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const CATEGORIES = [
  { key: "STR", label: "Strength (Fitness/Gym)", color: "#ef4444" },
  { key: "INT", label: "Intellect (Coding/Study)", color: "#3b82f6" },
  { key: "FOC", label: "Focus (Reading/Mindfulness)", color: "#a855f7" },
  { key: "AGI", label: "Agility (Cardio/Speedwork)", color: "#22c55e" },
  { key: "VIT", label: "Vitality (Meal Prep/Health)", color: "#f97316" },
];

export default function TaskModal({ isOpen, onClose, selectedLevelId = 7 }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("INT");
  const [xpReward, setXpReward] = useState(120);
  const [currencyReward, setCurrencyReward] = useState(45);

  const { addTask } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title,
      description,
      category,
      levelNodeId: selectedLevelId,
      xpReward: Number(xpReward),
      currencyReward: Number(currencyReward),
    });

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-6 rounded-xl border border-rpg bg-[#0d0c18] shadow-2xl text-stone-100"
          style={{ background: "linear-gradient(180deg, #121024 0%, #0a0914 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-rpg-muted hover:text-stone-300 text-xl font-bold"
          >
            ×
          </button>

          <div className="mb-5">
            <h2 className="text-lg font-cinzel font-bold text-gold tracking-wider uppercase">
              Add New Quest (Task)
            </h2>
            <p className="text-xs text-rpg-muted mt-0.5 font-crimson">
              Translate real-world goals into XP, Gold & Attribute progression
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                Quest Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finish React Monorepo Setup"
                className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                Description / Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specific goals, links, or criteria for completion..."
                className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                RPG Attribute Focus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs border text-left transition-all ${
                      category === cat.key
                        ? "border-amber-400 bg-amber-950/40 text-amber-300 font-bold"
                        : "border-[#2a2644] bg-[#16142a] text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                  XP Reward
                </label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={xpReward}
                  onChange={(e) => setXpReward(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                  Gold Currency
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={currencyReward}
                  onChange={(e) => setCurrencyReward(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-gold font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-900 font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98"
            >
              + Create Quest Node
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
