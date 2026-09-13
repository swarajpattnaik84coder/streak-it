import { AnimatePresence, motion } from "framer-motion";
import Badge from "../ui/Badge.jsx";
import TaskRewardPill from "../TaskRewardPill";
import { BASE_XP } from "../../lib/antiSpamEngine";
import { useAntiSpam } from "../../lib/AntiSpamContext";

const TYPE_META = {
  combat:      { label: "Combat",      variant: "red"    },
  exploration: { label: "Exploration", variant: "green"  },
  task:        { label: "Task",        variant: "default" },
  challenge:   { label: "Challenge",   variant: "purple" },
  boss:        { label: "Boss",        variant: "gold"   },
};

/**
 * Floating HTML tooltip rendered over the SVG map.
 * Position is in CSS-pixel space relative to the map container.
 */
export default function LevelTooltip({ level, x, y, onClose }) {
  const meta = TYPE_META[level?.type] ?? TYPE_META.task;
  const difficulty = level?.type === "task" || level?.type === "exploration" ? "ROUTINE" : "CORE";
  const { countForDifficulty } = useAntiSpam();
  const completionCountToday = countForDifficulty(difficulty);

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          key={level.id}
          className="absolute z-30 pointer-events-none select-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.88, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 6 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
        >
          {/* Card positioned above the click point */}
          <div className="relative -translate-x-1/2 -translate-y-full -mt-3
            pointer-events-auto cursor-default w-56
            bg-stone-950 border border-rpg rounded-xl shadow-2xl
            overflow-visible"
          >
            {/* Top accent strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />

            <div className="px-3.5 py-3">
              <p className="text-[9px] text-rpg-muted tracking-widest uppercase mb-1 font-cinzel">
                {level.zone} &nbsp;·&nbsp; Lv.{level.id}
              </p>
              <p className="text-sm font-semibold text-stone-100 mb-2.5 leading-snug">
                {level.name}
              </p>
              <div className="flex items-center justify-between gap-1.5">
                <Badge variant={meta.variant} size="xs">{meta.label}</Badge>
                <TaskRewardPill
                  completionCountToday={completionCountToday}
                  taskDifficulty={difficulty}
                  baseReward={BASE_XP[difficulty]}
                />
              </div>
              <p className="mt-2 text-[9px] text-stone-600">
                {level.tasks} task{level.tasks !== 1 ? "s" : ""} to complete
              </p>
            </div>
          </div>

          {/* Arrow pointing down */}
          <div className="flex justify-center -mt-px">
            <div className="w-2.5 h-2.5 rotate-45 bg-stone-950 border-b border-r border-rpg -mt-1.5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}