import { motion } from "framer-motion";
import XpBar from "../ui/XpBar.jsx";
import { PLAYER } from "../../data/mockData.js";
import { FlameIcon, SettingsIcon } from "../ui/icons.jsx";
import { useProgression } from "../../lib/ProgressionContext";

export default function TitleBar({ onToggleCharPanel }) {
  const { state, openSheet } = useProgression();
  return (
    <header
      className="flex items-center gap-4 px-4 h-12 shrink-0 z-20 select-none"
      style={{
        background: "linear-gradient(180deg, #0d0c1a 0%, #090910 100%)",
        borderBottom: "1px solid #1f1d30",
        boxShadow: "0 2px 16px rgba(0,0,0,0.6)",
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center shrink-0 w-14 lg:w-52">
        <span className="text-sm font-cinzel font-bold tracking-widest uppercase">
          streak <span className="text-gold text-glow-gold">it!</span>
        </span>
      </div>

      {/* ── XP Bar — center fill ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <XpBar
          current={state.xp}
          max={state.xpToNext}
          level={state.level}
          isGateLocked={state.isGateLocked}
          nextLevel={state.nextLevel}
          onLockedActivate={openSheet}
        />
      </div>

      {/* ── Right Stats ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Streak */}
        <motion.div
          className="hidden sm:flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FlameIcon size={14} stroke="#f97316" />
          <span className="text-orange-400 text-xs font-bold tabular-nums">{PLAYER.streak}</span>
          <span className="text-rpg-muted text-[10px] hidden md:inline">day streak</span>
        </motion.div>

        {/* Separator */}
        <span className="hidden sm:block w-px h-4 bg-rpg-border" />

        {/* Gold */}
        <motion.div
          className="hidden sm:flex items-center gap-1 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-gold font-cinzel text-xs">◆</span>
          <span className="text-gold tabular-nums font-semibold">{state.gold}</span>
        </motion.div>

        {/* Separator */}
        <span className="hidden sm:block w-px h-4 bg-rpg-border" />

        {/* Avatar toggle */}
        <button
          type="button"
          onClick={onToggleCharPanel}
          aria-label="Toggle character panel"
          className="w-7 h-7 rounded-full flex items-center justify-center
            font-cinzel text-[11px] font-bold text-gold
            transition-all duration-200 hover:shadow-gold-sm focus-visible:outline-none
            focus-visible:ring-1 focus-visible:ring-amber-500/50"
          style={{ background: "#1c1608", border: "1.5px solid #3a2e12" }}
        >
          {PLAYER.name.charAt(0)}
        </button>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          className="text-rpg-muted hover:text-stone-300 transition-colors
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded"
        >
          <SettingsIcon size={15} />
        </button>
      </div>
    </header>
  );
}