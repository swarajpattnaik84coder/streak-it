import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatBar from "../ui/StatBar.jsx";
import Badge from "../ui/Badge.jsx";
import CharacterViewer from "../character/CharacterViewer.jsx";
import { PLAYER } from "../../data/mockData.js";
import { useProgression } from "../../lib/ProgressionContext";

// ── Circular XP Ring ─────────────────────────────────────────────────────────
function XpRing({ current, max }) {
  const pct  = Math.min((current / max) * 100, 100);
  const r    = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#1a1728" strokeWidth="3" />
      <motion.circle
        cx="24" cy="24" r={r} fill="none"
        stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circ}
        transform="rotate(-90 24 24)"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central"
        fontSize="8" fontWeight="700" fill="#c9a84c" fontFamily="Cinzel, serif">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Shared Panel Content ──────────────────────────────────────────────────────
function PanelContent() {
  const { state, openSheet } = useProgression();
  const pointerStart = useRef(null);
  const displayStats = [
    { key: "STR", value: state.attributes.STR, color: "#ef4444" },
    { key: "INT", value: state.attributes.INT, color: "#3b82f6" },
    { key: "VIT", value: state.attributes.VIT, color: "#f97316" },
  ];
  const xpRemaining = Math.max(state.xpToNext - state.xp, 0);

  return (
    <div className="flex flex-col gap-3.5 p-4 h-full overflow-y-auto no-scrollbar">

      {/* 3D Character Showcase — click (not drag) opens the character sheet */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Open character sheet"
        className="group relative cursor-pointer rounded-xl outline-none
          transition-all duration-200 hover:shadow-gold-lg
          hover:brightness-110 focus-visible:ring-1 focus-visible:ring-amber-500/60"
        onPointerDown={(e) => {
          pointerStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (dx * dx + dy * dy < 36) openSheet();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openSheet();
          }
        }}
      >
        <CharacterViewer modelPath="/models/character_ranger.glb" />
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.55), inset 0 0 24px rgba(201,168,76,0.12)" }}
        />
        <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[9px] font-cinzel tracking-[0.18em] uppercase text-gold/0 group-hover:text-gold/80 transition-colors duration-200">
          View Character Sheet
        </p>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" />

      {/* Character identity row */}
      <div className="flex items-start gap-3">
        <XpRing current={state.xp} max={state.xpToNext || 1} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-cinzel font-bold text-stone-100 tracking-widest uppercase">
            {state.name}
          </h2>
          <p className="text-[11px] text-rpg-muted font-crimson italic mt-0.5">
            {state.tier.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge variant="gold" size="xs">Lv. {state.level}</Badge>
            <Badge variant={state.isGateLocked ? "red" : "gold"} size="xs">
              T{state.tier.id} {state.tier.name}
            </Badge>
          </div>
          <span className="text-[9px] text-stone-700 tabular-nums mt-1 block">
            {state.isGateLocked
              ? "Gate sealed — trial required"
              : `${xpRemaining.toLocaleString()} xp to next`}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" />

      {/* Attributes */}
      <div>
        <p className="text-[9px] font-cinzel font-bold tracking-[0.2em] text-rpg-muted uppercase mb-2.5">
          Attributes
        </p>
        <div className="flex flex-col gap-2">
          {displayStats.map((s, i) => (
            <StatBar key={s.key} label={s.key} value={s.value} max={100} color={s.color} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" />

      {/* Currency + Streak — compact horizontal row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded px-3 py-2 text-center" style={{ background: "#110e08", border: "1px solid #2a2212" }}>
          <p className="text-sm font-cinzel font-bold text-gold tabular-nums">{state.gold}</p>
          <p className="text-[9px] text-rpg-muted mt-0.5">◆ Gold</p>
        </div>
        <div className="rounded px-3 py-2 text-center" style={{ background: "#110b08", border: "1px solid #2a1a10" }}>
          <p className="text-sm font-cinzel font-bold text-orange-400 tabular-nums">{PLAYER.streak}</p>
          <p className="text-[9px] text-rpg-muted mt-0.5">🔥 Streak</p>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" />

      {/* Abilities */}
      <div>
        <p className="text-[9px] font-cinzel font-bold tracking-[0.2em] text-rpg-muted uppercase mb-2">
          Abilities
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            { name: "Shadow Step",   tier: "I"   },
            { name: "Iron Focus",    tier: "II"  },
            { name: "Endurance Aura",tier: "I"   },
          ].map(({ name, tier }, i) => (
            <div
              key={name}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs text-stone-400"
              style={{ background: "#0c0b14", border: "1px solid #1e1c30" }}
            >
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-gold shrink-0 font-cinzel"
                style={{ background: "#1a1508", border: "1px solid #3a2e12" }}
              >
                {tier}
              </span>
              <span className="font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
export default function CharacterPanel({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop always-visible */}
      <aside
        className="hidden lg:flex flex-col shrink-0 w-72 overflow-y-auto"
        style={{ background: "#08080f", borderLeft: "1px solid #1f1d30" }}
        aria-label="Character panel"
      >
        <PanelContent />
      </aside>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-72 overflow-y-auto"
              style={{ background: "#08080f", borderLeft: "1px solid #1f1d30" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              aria-label="Character panel"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close character panel"
                className="absolute top-3 right-3 text-rpg-muted hover:text-stone-300 transition-colors text-lg leading-none"
              >
                ×
              </button>
              <PanelContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}