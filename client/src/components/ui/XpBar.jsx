import { motion } from "framer-motion";

function ChainedPadlock() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-5 h-5 drop-shadow-[0_0_8px_rgba(220,38,38,0.85)]"
      aria-hidden="true"
    >
      <path
        d="M10 28h8M46 28h8M18 28c0-6 3-12 14-12s14 6 14 12"
        fill="none"
        stroke="#9a9a9a"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M22 28h20v6H22z"
        fill="none"
        stroke="#7a7a7a"
        strokeWidth="2"
      />
      <rect x="18" y="32" width="28" height="22" rx="3" fill="#3a0c0c" stroke="#e8c48a" strokeWidth="2" />
      <path d="M28 32V24a4 4 0 018 0v8" fill="none" stroke="#e8c48a" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="43" r="3.2" fill="#c9a84c" />
      <path d="M32 46v5" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function XpBar({
  current,
  max,
  level,
  isGateLocked = false,
  nextLevel = null,
  onLockedActivate,
}) {
  const pct = max > 0 ? Math.min(Math.max((current / max) * 100, 0), 100) : 100;
  const fill = isGateLocked
    ? "linear-gradient(90deg, #6b1515, #dc2626, #9a3412)"
    : "linear-gradient(90deg, #7a1f12, #c2410c, #c9a84c, #f5d878)";

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="text-[10px] text-rpg-muted shrink-0 font-cinzel tracking-widest hidden sm:block">
        LV. {level}
      </span>
      <button
        type="button"
        disabled={!isGateLocked}
        onClick={() => {
          if (isGateLocked) onLockedActivate?.();
        }}
        aria-label={
          isGateLocked
            ? `Level ${nextLevel} gate sealed. Open ascension trial prerequisites.`
            : `Experience ${current} of ${max}`
        }
        className={[
          "relative flex-1 h-2.5 rounded-full bg-stone-900 overflow-visible min-w-[60px] text-left",
          isGateLocked
            ? "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/70"
            : "cursor-default",
        ].join(" ")}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden bg-stone-900">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: fill,
              boxShadow: isGateLocked
                ? "0 0 12px rgba(220,38,38,0.65)"
                : "0 0 10px rgba(201,168,76,0.55)",
            }}
            initial={{ width: 0 }}
            animate={{
              width: `${pct}%`,
              ...(isGateLocked
                ? {
                    filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"],
                    boxShadow: [
                      "0 0 8px rgba(220,38,38,0.4)",
                      "0 0 16px rgba(220,38,38,0.9)",
                      "0 0 8px rgba(220,38,38,0.4)",
                    ],
                  }
                : {}),
            }}
            transition={
              isGateLocked
                ? { width: { duration: 1.1, ease: "easeOut" }, filter: { duration: 1.4, repeat: Infinity }, boxShadow: { duration: 1.4, repeat: Infinity } }
                : { duration: 1.2, ease: "easeOut" }
            }
          />
          {!isGateLocked && (
            <motion.div
              className="absolute inset-y-0 w-10 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
              initial={{ left: "-40px" }}
              animate={{ left: "110%" }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
          )}
        </div>

        {isGateLocked && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: "1px solid rgba(220,38,38,0.7)" }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <div className="absolute inset-y-0 left-1.5 right-2 flex items-center gap-1.5 pointer-events-none z-10">
              <ChainedPadlock />
              <span className="text-[8px] sm:text-[9px] font-cinzel tracking-wide text-red-50 whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                Level {nextLevel} Gate Sealed • Ascension Trial Required
              </span>
            </div>
          </>
        )}
      </button>
      {isGateLocked ? (
        <span className="sr-only">
          Level {nextLevel} Gate Sealed • Ascension Trial Required
        </span>
      ) : (
        <span className="text-[10px] tabular-nums text-rpg-muted shrink-0 hidden md:block">
          {current.toLocaleString()}/{max.toLocaleString()}
          <span className="text-stone-700 ml-1">xp</span>
        </span>
      )}
    </div>
  );
}
