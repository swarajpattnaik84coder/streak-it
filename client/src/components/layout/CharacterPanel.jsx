import { motion, AnimatePresence } from "framer-motion";
import StatBar from "../ui/StatBar.jsx";
import Badge from "../ui/Badge.jsx";
import CharacterViewer from "../character/CharacterViewer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// ── Circular XP Ring ─────────────────────────────────────────────────────────
function XpRing({ current, max }) {
  const pct = Math.min((current / max) * 100, 100);
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#bfa67c" strokeWidth="3" />
      <motion.circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="#8c5828"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        transform="rotate(-90 24 24)"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="8"
        fontWeight="800"
        fill="#4a2e16"
        fontFamily="Cinzel, serif"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Shared Panel Content (Movie Style Aged Parchment Card) ────────────────
function PanelContent() {
  const { user } = useAuth();

  return (
    <div
      className="flex flex-col gap-3.5 p-4 h-full overflow-y-auto no-scrollbar font-crimson"
      style={{
        background: "linear-gradient(180deg, #ede1c4 0%, #e2ce9f 100%)",
        borderLeft: "3px solid #593e28",
        color: "#2b1d0e",
        boxShadow: "inset 0 0 20px rgba(89, 62, 40, 0.4)",
      }}
    >
      {/* 3D Character Showcase */}
      <div className="rounded-lg overflow-hidden border-2 border-[#593e28] shadow-md">
        <CharacterViewer modelPath="/models/character_ranger.glb" />
      </div>

      {/* Divider */}
      <div className="divider-fantasy" style={{ background: "linear-gradient(90deg, transparent, #7a552b 30%, #7a552b 70%, transparent)" }} />

      {/* Character Identity Row */}
      <div className="flex items-start gap-3">
        <XpRing current={user.xp || 0} max={user.xpToNext || 1000} />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-cinzel font-black text-[#3b2413] tracking-widest uppercase">
            {user.name}
          </h2>
          <p className="text-xs text-[#6e4e31] font-semibold italic mt-0.5">
            {user.equippedTitle || user.class}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-cinzel font-bold bg-[#7a552b] text-[#f5ebd6]">
              Lv. {user.level}
            </span>
            <span className="text-[10px] text-[#593e28] font-bold tabular-nums">
              {Math.max(0, (user.xpToNext || 1000) - (user.xp || 0)).toLocaleString()} XP to Next
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" style={{ background: "linear-gradient(90deg, transparent, #7a552b 30%, #7a552b 70%, transparent)" }} />

      {/* Attributes Scroll Card Section */}
      <div className="p-3 rounded-lg border-2 border-[#7a552b] bg-[#f5e9ce]/80 shadow-inner">
        <p className="text-xs font-cinzel font-black tracking-[0.2em] text-[#3b2413] uppercase mb-2 text-center border-b border-[#a37d53] pb-1">
          Character Attributes
        </p>
        <div className="flex flex-col gap-2">
          {user.stats &&
            user.stats.map((s, i) => (
              <StatBar
                key={s.key}
                label={s.key}
                value={s.value}
                max={s.max || 100}
                color={s.color}
                delay={i * 0.1}
              />
            ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider-fantasy" style={{ background: "linear-gradient(90deg, transparent, #7a552b 30%, #7a552b 70%, transparent)" }} />

      {/* Currency + Streak */}
      <div className="grid grid-cols-2 gap-2 font-cinzel">
        <div
          className="rounded-lg px-3 py-2 text-center border-2 border-[#7a552b]"
          style={{ background: "#f5e9ce" }}
        >
          <p className="text-sm font-black text-[#6d4c2b] tabular-nums">
            💰 {user.currency || 0}
          </p>
          <p className="text-[10px] text-[#5c3e21] font-bold uppercase mt-0.5">Gold</p>
        </div>
        <div
          className="rounded-lg px-3 py-2 text-center border-2 border-[#7a552b]"
          style={{ background: "#f5e9ce" }}
        >
          <p className="text-sm font-black text-[#8c3b18] tabular-nums">
            🔥 {user.streak || 0}
          </p>
          <p className="text-[10px] text-[#5c3e21] font-bold uppercase mt-0.5">Streak</p>
        </div>
      </div>

      {/* Abilities */}
      <div>
        <p className="text-xs font-cinzel font-black tracking-[0.2em] text-[#3b2413] uppercase mb-2">
          Hero Abilities
        </p>
        <div className="flex flex-col gap-1.5 font-cinzel">
          {[
            { name: "Shadow Step", tier: "I" },
            { name: "Iron Focus", tier: "II" },
            { name: "Endurance Aura", tier: "I" },
          ].map(({ name, tier }) => (
            <div
              key={name}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#3b2413] border border-[#a37d53]"
              style={{ background: "#f5e9ce" }}
            >
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-[#f5ebd6] shrink-0"
                style={{ background: "#593e28" }}
              >
                {tier}
              </span>
              <span>{name}</span>
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
        className="hidden lg:flex flex-col shrink-0 w-80 overflow-y-auto z-10 shadow-2xl"
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
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-80 overflow-y-auto"
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
                className="absolute top-3 right-3 text-[#3b2413] hover:text-red-800 transition-colors text-xl font-bold z-50"
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