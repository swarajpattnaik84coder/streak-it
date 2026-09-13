import { motion } from "framer-motion";
import XpBar from "../ui/XpBar.jsx";
import { FlameIcon, SettingsIcon } from "../ui/icons.jsx";
import { useProgression } from "../../lib/ProgressionContext";
import { useAuth } from "../../context/AuthContext.jsx";

export default function TitleBar({ onToggleCharPanel, onOpenAuth }) {
  const { state, openSheet } = useProgression();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header
      className="flex items-center gap-4 px-4 h-12 shrink-0 z-20 select-none font-cinzel border-b-2"
      style={{
        background: "linear-gradient(180deg, #2b1f15 0%, #1c140d 100%)",
        borderColor: "#593e28",
        boxShadow: "0 4px 16px rgba(0,0,0,0.8)",
      }}
    >
      {/* ── Logo Banner Scroll Style ────────────────────────────────────────── */}
      <div className="flex items-center shrink-0 w-14 lg:w-56">
        <div
          className="px-3 py-1 rounded border shadow-inner flex items-center gap-1.5"
          style={{
            background: "linear-gradient(180deg, #e5d1a7 0%, #cca972 100%)",
            borderColor: "#5c4028",
            boxShadow: "inset 0 0 6px rgba(92, 64, 40, 0.4)",
          }}
        >
          <span className="text-xs font-cinzel font-black tracking-widest uppercase text-[#2c1b0e]">
            STREAK <span className="text-[#8c4b18]">IT!</span>
          </span>
        </div>
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

      {/* ── Right Stats (Parchment & Bronze Styled) ────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Streak */}
        <motion.div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border"
          style={{ background: "#261b12", borderColor: "#593e28" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FlameIcon size={14} stroke="#d97706" />
          <span className="text-amber-400 text-xs font-bold tabular-nums">{user?.streak || 0}</span>
          <span className="text-stone-400 text-[10px] hidden md:inline font-crimson">Streak</span>
        </motion.div>

        {/* Gold Currency */}
        <motion.div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border"
          style={{ background: "#261b12", borderColor: "#593e28" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-amber-400 font-cinzel text-xs">◆</span>
          <span className="text-amber-300 tabular-nums font-bold text-xs">{state.gold ?? user?.currency ?? 0} Gold</span>
        </motion.div>

        {/* Separator */}
        <span className="hidden sm:block w-px h-5 bg-[#593e28]" />

        {/* Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={logout}
            title="Log out"
            className="text-[10px] font-cinzel text-stone-300 hover:text-amber-400 transition-colors uppercase border border-[#593e28] px-2.5 py-1 rounded bg-[#21160e]"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="text-[10px] font-cinzel font-bold text-amber-300 hover:text-amber-200 transition-colors uppercase border border-amber-600/60 px-2.5 py-1 rounded bg-[#3b2413]"
          >
            Login / Join
          </button>
        )}

        {/* Avatar toggle */}
        <button
          type="button"
          onClick={onToggleCharPanel}
          aria-label="Toggle character panel"
          className="w-8 h-8 rounded-full flex items-center justify-center
            font-cinzel text-xs font-bold text-[#2c1b0e]
            transition-all duration-200 hover:scale-105"
          style={{ background: "linear-gradient(180deg, #e5d1a7 0%, #cca972 100%)", border: "2px solid #5c4028" }}
        >
          {(user?.name || state.name || "A").charAt(0)}
        </button>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          className="text-stone-400 hover:text-stone-200 transition-colors p-1"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </header>
  );
}