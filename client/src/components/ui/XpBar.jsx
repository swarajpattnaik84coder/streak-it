import { motion } from "framer-motion";

export default function XpBar({ current, max, level }) {
  const pct = Math.min(Math.max((current / max) * 100, 0), 100);
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="text-[10px] text-rpg-muted shrink-0 font-cinzel tracking-widest hidden sm:block">
        LV {level}
      </span>
      <div className="relative flex-1 h-2 rounded-full bg-stone-900 overflow-hidden min-w-[60px]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #92610a, #c9a84c, #f5d878)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-y-0 w-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
          initial={{ left: "-40px" }}
          animate={{ left: "110%" }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[10px] tabular-nums text-rpg-muted shrink-0 hidden md:block">
        {current.toLocaleString()}/{max.toLocaleString()}
        <span className="text-stone-700 ml-1">xp</span>
      </span>
    </div>
  );
}