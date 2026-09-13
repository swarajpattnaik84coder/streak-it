import { motion, AnimatePresence } from "framer-motion";
import StatBar from "../ui/StatBar.jsx";
import Badge from "../ui/Badge.jsx";
import CharacterViewer from "../character/CharacterViewer.jsx";
import { PLAYER } from "../../data/mockData.js";

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
  return (
    <div className="flex flex-col gap-3.5 p-4 h-full overflow-y-auto no-scrollbar">

      {/* 3D Character Showcase */}
      <CharacterViewer modelPath="/models/character_ranger.glb" />

      {/* Divider */}
      <div className="divider-fantasy" />

      {/* Character identity row */}
      <div className="flex items-start gap-3">
        <XpRing current={PLAYER.xp} max={PLAYER.xpToNext} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-cinzel font-bold text-stone-100 tracking-widest uppercase">
            {PLAYER.name}
          </h2>
          <p className="text-[11px] text-rpg-muted font-crimson italic mt-0.5">{PLAYER.class}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge variant="gold" size="xs">Lv. {PLAYER.level}</Badge>
            <span className="text-[9px] text-stone-700 tabular-nums">
              {(PLAYER.xpToNext - PLAYER.xp).toLocaleString()} xp to next
            </span>
          </div>
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
          {PLAYER.stats.map((s, i) => (
            <StatBar key={s.key} label={s.key} value={s.value} max={s.max} color={s.color} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" />

      {/* Currency + Streak — compact horizontal row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded px-3 py-2 text-center" style={{ background: "#110e08", border: "1px solid #2a2212" }}>
          <p className="text-sm font-cinzel font-bold text-gold tabular-nums">{PLAYER.currency}</p>
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