import { motion } from "framer-motion";

export default function StatBar({ label, value, max = 100, color = "#f59e0b", delay = 0 }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-8 text-[9px] font-bold tracking-widest text-rpg-muted uppercase shrink-0 font-cinzel">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-stone-900 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay }}
        />
      </div>
      <span className="w-6 text-right text-[9px] tabular-nums text-rpg-muted shrink-0">
        {value}
      </span>
    </div>
  );
}