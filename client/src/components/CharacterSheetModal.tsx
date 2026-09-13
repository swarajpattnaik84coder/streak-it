import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useProgression } from "../lib/ProgressionContext";
import {
  GATE_LOCK_LEVELS,
  getTrialForLevel,
  isRequirementComplete,
  TIERS,
  type AscensionTrial,
} from "../lib/evolutionEngine";
import Badge from "./ui/Badge.jsx";
import StatBar from "./ui/StatBar.jsx";

const ATTR_META: Array<{
  key: "STR" | "INT" | "VIT" | "Routine";
  label: string;
  color: string;
}> = [
  { key: "STR", label: "STR", color: "#ef4444" },
  { key: "INT", label: "INT", color: "#3b82f6" },
  { key: "VIT", label: "VIT", color: "#f97316" },
  { key: "Routine", label: "RTN", color: "#c9a84c" },
];

function nextGateLevel(level: number): number {
  return GATE_LOCK_LEVELS.find((gate) => gate >= level) ?? 49;
}

function fireAscensionConfetti() {
  const colors = ["#c9a84c", "#f5d878", "#8b1e1e", "#e8d5a8", "#6b1d1d"];
  confetti({
    particleCount: 140,
    spread: 78,
    origin: { y: 0.55 },
    colors,
    ticks: 220,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.7 },
      colors,
    });
  }, 180);
}

export default function CharacterSheetModal() {
  const {
    state,
    sheetOpen,
    closeSheet,
    completeRequirement,
    breakSealAndAscend,
  } = useProgression();

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen, closeSheet]);

  const previewTrial: AscensionTrial | null =
    state.trial ?? getTrialForLevel(nextGateLevel(state.level));

  const onAscend = () => {
    const ok = breakSealAndAscend();
    if (ok) fireAscensionConfetti();
  };

  return createPortal(
    <AnimatePresence>
      {sheetOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Dismiss character sheet"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="character-sheet-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative z-10 w-full max-w-lg max-h-[min(92vh,760px)] overflow-y-auto no-scrollbar"
            style={{
              background: "linear-gradient(180deg, #2a2118 0%, #1a140f 40%, #120e0b 100%)",
              border: "3px solid #3d3428",
              boxShadow:
                "0 0 0 1px #6b5a3a, 0 0 0 6px #1a120c, 0 24px 64px rgba(0,0,0,0.75), inset 0 0 40px rgba(80,50,20,0.25)",
            }}
          >
            <div
              className="m-2 px-5 py-4"
              style={{
                background:
                  "linear-gradient(180deg, #e4d2a8 0%, #d4bc86 45%, #c9ad74 100%)",
                border: "1px solid #8a6c3a",
                boxShadow: "inset 0 0 48px rgba(90,50,10,0.18)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[9px] tracking-[0.28em] uppercase font-cinzel text-amber-900/70">
                    Royal Character Sheet
                  </p>
                  <h2
                    id="character-sheet-title"
                    className="text-xl font-cinzel font-bold tracking-widest uppercase text-stone-900"
                  >
                    {state.name}
                  </h2>
                  <p className="text-sm font-crimson italic text-stone-700">
                    {state.characterClass} · {state.tier.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeSheet}
                  aria-label="Close character sheet"
                  className="text-stone-700 hover:text-stone-950 text-xl leading-none px-1"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="gold" size="sm">Lv. {state.level}</Badge>
                <span
                  className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-cinzel font-bold tracking-wider uppercase"
                  style={{
                    background: "linear-gradient(90deg, #3a2410, #6b3a12)",
                    color: "#f5d878",
                    border: "1px solid #c9a84c",
                    boxShadow: "0 0 12px rgba(201,168,76,0.45)",
                  }}
                >
                  Tier {state.tier.id} · {state.tier.name}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-[9px] font-cinzel font-bold tracking-[0.2em] text-amber-950/70 uppercase mb-2">
                  Attributes
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {ATTR_META.map((attr, i) => (
                    <StatBar
                      key={attr.key}
                      label={attr.label}
                      value={state.attributes[attr.key]}
                      max={100}
                      color={attr.color}
                      delay={i * 0.06}
                    />
                  ))}
                </div>
              </div>

              <div
                className="rounded p-3"
                style={{
                  background: "rgba(28, 18, 10, 0.72)",
                  border: "1px solid #6b4e24",
                }}
              >
                <p className="text-[9px] font-cinzel font-bold tracking-[0.22em] text-amber-200/80 uppercase mb-2">
                  Ascension Gate
                </p>

                {state.isMaxLevel ? (
                  <p className="text-sm font-crimson italic text-amber-100">
                    The realm kneels. You are {state.tier.title} — no further gates remain.
                  </p>
                ) : state.isGateLocked && state.trial ? (
                  <>
                    <p className="text-xs font-crimson text-amber-100/90 mb-3">
                      Level {state.trial.toLevel} Gate Sealed. {state.trial.description}
                    </p>
                    <ul className="flex flex-col gap-2 mb-3">
                      {state.trial.requirements.map((req) => {
                        const done = isRequirementComplete(req);
                        return (
                          <li key={req.id}>
                            <button
                              type="button"
                              onClick={() => {
                                if (!done) completeRequirement(req.id);
                              }}
                              disabled={done}
                              className="w-full flex items-center gap-2.5 text-left rounded px-2 py-1.5 transition-colors disabled:cursor-default hover:bg-white/5"
                              style={{ border: "1px solid #4a3820" }}
                            >
                              <span
                                className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center text-[10px] font-bold"
                                style={{
                                  background: done ? "#1d4a22" : "#2a1a10",
                                  border: `1px solid ${done ? "#4ade80" : "#6b4e24"}`,
                                  color: done ? "#86efac" : "#c9a84c",
                                }}
                              >
                                {done ? "✓" : ""}
                              </span>
                              <span className={`flex-1 text-xs ${done ? "text-emerald-300" : "text-amber-100/85"}`}>
                                {req.label}
                              </span>
                              <span className="text-[10px] tabular-nums text-amber-200/70">
                                {req.current}/{req.required}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {state.trialComplete ? (
                      <motion.button
                        type="button"
                        onClick={onAscend}
                        className="w-full py-2.5 font-cinzel text-sm font-bold tracking-widest uppercase text-amber-50"
                        style={{
                          background: "linear-gradient(90deg, #6b1515, #b45309, #6b1515)",
                          border: "1px solid #f5d878",
                          boxShadow: "0 0 22px rgba(245, 216, 120, 0.45)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 16px rgba(245, 216, 120, 0.3)",
                            "0 0 28px rgba(220, 38, 38, 0.55)",
                            "0 0 16px rgba(245, 216, 120, 0.3)",
                          ],
                        }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      >
                        Break Gate Seal & Ascend
                      </motion.button>
                    ) : (
                      <p className="text-[11px] font-crimson italic text-red-200/80">
                        Fulfill every trial prerequisite to shatter the seal.
                      </p>
                    )}
                  </>
                ) : (
                  <div>
                    <p className="text-xs font-crimson text-amber-100/90 mb-2">
                      The next Ascension Gate awaits at Level {previewTrial?.toLevel ?? 10}.
                      Reach the boundary with a full XP bar to begin the trial.
                    </p>
                    {previewTrial && (
                      <ul className="flex flex-col gap-1.5">
                        {previewTrial.requirements.map((req) => (
                          <li
                            key={req.id}
                            className="text-[11px] text-amber-200/70 font-crimson italic"
                          >
                            • {req.label}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {TIERS.filter((tier) => tier.id >= state.tier.id).slice(0, 3).map((tier) => (
                        <span
                          key={tier.id}
                          className="text-[9px] font-cinzel tracking-wide px-1.5 py-0.5 rounded"
                          style={{
                            border: "1px solid #6b4e24",
                            color: tier.id === state.tier.id ? "#f5d878" : "#a89870",
                          }}
                        >
                          T{tier.id} {tier.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
