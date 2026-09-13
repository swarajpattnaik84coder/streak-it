import { motion } from "framer-motion";
import {
  CalendarIcon, TrophyIcon, UserIcon, VaultIcon, StoreIcon,
} from "../ui/icons.jsx";
import { NAV_ITEMS } from "../../data/mockData.js";
import { useAuth } from "../../context/AuthContext.jsx";

const ICONS = {
  calendar:    CalendarIcon,
  leaderboard: TrophyIcon,
  character:   UserIcon,
  vault:       VaultIcon,
  store:       StoreIcon,
};

export default function Sidebar({ activeId, onSelect }) {
  const { user } = useAuth();

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden sm:flex flex-col shrink-0 w-14 lg:w-52 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #090910 0%, #07070e 100%)",
          borderRight: "1px solid #1f1d30",
        }}
        aria-label="Main navigation"
      >
        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 p-2 pt-3 flex-1">
          {NAV_ITEMS.map((item, i) => {
            const Icon = ICONS[item.id];
            const isActive = activeId === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                custom={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.2, ease: "easeOut" }}
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative flex items-center gap-3 rounded px-2.5 py-2.5",
                  "w-full text-left transition-all duration-200 group outline-none",
                  "focus-visible:ring-1 focus-visible:ring-amber-500/40",
                  isActive
                    ? "text-amber-400 bg-amber-950/25"
                    : "text-rpg-muted hover:text-stone-300 hover:bg-white/[0.03]",
                ].join(" ")}
              >
                {/* Active left indicator */}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r bg-amber-400"
                  />
                )}

                {/* Icon */}
                {Icon && (
                  <span className={["shrink-0 transition-colors",
                    isActive ? "text-amber-400" : "text-rpg-muted group-hover:text-stone-400"
                  ].join(" ")}>
                    <Icon size={17} stroke="currentColor" />
                  </span>
                )}

                {/* Label */}
                <span className="hidden lg:block text-[11px] font-medium tracking-wide truncate font-cinzel">
                  {item.label}
                </span>

                {/* Hover tooltip (icon-only mode) */}
                <span className="
                  lg:hidden absolute left-full ml-3 px-2.5 py-1
                  bg-rpg-panel-2 border border-rpg rounded text-[11px] text-stone-200
                  whitespace-nowrap shadow-xl z-50
                  opacity-0 pointer-events-none
                  group-hover:opacity-100 transition-opacity duration-150
                  font-cinzel tracking-wide
                ">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom character mini-display */}
        <div className="p-2 pb-4" style={{ borderTop: "1px solid #161428" }}>
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-cinzel text-[9px] font-bold text-gold"
              style={{ background: "#1c1608", border: "1px solid #3a2e12" }}>
              {(user.name || "A").charAt(0)}
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="text-[10px] font-semibold text-stone-300 truncate font-cinzel">{user.name}</p>
              <p className="text-[9px] text-rpg-muted truncate">{user.equippedTitle || user.class}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ────────────────────────────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{ background: "#090910", borderTop: "1px solid #1f1d30" }}
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.id];
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={[
                "flex flex-col items-center gap-1 px-3 py-1 rounded transition-colors",
                isActive ? "text-amber-400" : "text-rpg-muted",
              ].join(" ")}
            >
              {Icon && <Icon size={19} stroke="currentColor" />}
              <span className="text-[9px] font-medium font-cinzel">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}