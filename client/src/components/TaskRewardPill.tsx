import { useId, useState } from "react";
import { motion } from "framer-motion";
import {
  calculateEffectiveXp,
  type FatigueTier,
  type TaskDifficulty,
} from "../lib/antiSpamEngine";

export interface TaskRewardPillProps {
  completionCountToday: number;
  taskDifficulty: TaskDifficulty;
  baseReward?: number;
}

const TOOLTIP =
  "Doing only routine work exhausts your XP gains. Complete Core tasks (Study/Gym) to earn full honor!";

function AlertIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.2L2.4 20.2h19.2L12 3.2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 9.5v5.2M12 17.4v.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="#c9a84c" stroke="#f5d878" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="#7a5a18" strokeWidth="1.2" />
      <path d="M12 8.2v7.6M9.6 10.2c.6-.8 1.4-1.2 2.4-1.2 1.6 0 2.5.8 2.5 1.8 0 2.4-4.9 1.4-4.9 3.6 0 1 .9 1.9 2.6 1.9 1.1 0 2-.4 2.5-1.1" stroke="#5c4310" strokeWidth="1.15" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function labelFor(tier: FatigueTier, xp: number, penaltyPercent: number): string {
  if (tier === "full") return `+${xp} XP`;
  if (tier === "fatigued") return `+${xp} XP (Fatigued -${penaltyPercent}%)`;
  return `+${xp} XP (Exhausted: Diminished Returns)`;
}

const TIER_STYLES: Record<FatigueTier, string> = {
  full:
    "bg-gradient-to-b from-amber-200 via-yellow-600 to-amber-900 text-amber-50 border-amber-300/80 shadow-[0_0_10px_rgba(201,168,76,0.45)]",
  fatigued:
    "bg-gradient-to-b from-amber-300 via-orange-700 to-stone-900 text-amber-100 border-orange-400/50",
  exhausted:
    "bg-gradient-to-b from-stone-500 via-stone-800 to-stone-950 text-stone-300 border-stone-500/70 [background-image:linear-gradient(135deg,transparent_40%,rgba(0,0,0,0.35)_41%,transparent_42%),linear-gradient(45deg,transparent_60%,rgba(255,255,255,0.08)_61%,transparent_62%)]",
};

export default function TaskRewardPill({
  completionCountToday,
  taskDifficulty,
  baseReward,
}: TaskRewardPillProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const result = calculateEffectiveXp({
    baseReward: baseReward ?? 0,
    taskDifficulty,
    completionCountToday,
  });
  const text = labelFor(result.fatigueTier, result.effectiveXp, result.penaltyPercent);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <motion.span
        tabIndex={0}
        role="img"
        aria-label={`${text}. ${TOOLTIP}`}
        aria-describedby={open ? tooltipId : undefined}
        className={[
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
          "text-[9px] font-cinzel font-bold tracking-wide",
          "border cursor-help select-none",
          TIER_STYLES[result.fatigueTier],
        ].join(" ")}
        style={{
          boxShadow:
            result.fatigueTier === "exhausted"
              ? "inset 0 0 0 1px rgba(80,70,60,0.7), 0 1px 0 rgba(255,255,255,0.06)"
              : undefined,
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        {result.fatigueTier === "exhausted" ? <AlertIcon /> : <CoinIcon />}
        {text}
      </motion.span>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] w-56 rounded px-2.5 py-2
            text-[10px] leading-snug font-crimson text-amber-100/95 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, #2a2118 0%, #140e0a 100%)",
            border: "1px solid #8a6c3a",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
          }}
        >
          {TOOLTIP}
        </span>
      )}
    </span>
  );
}
