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
      {/* ── Desktop sidebar (Full 100% Opacity Pirate Ship & Sea Background) ─────────────── */}
      <aside
        className="hidden sm:flex flex-col shrink-0 w-16 lg:w-56 overflow-y-auto z-10 select-none shadow-2xl relative"
        style={{
          background: "#12161f",
          borderRight: "2px solid #3d2d1d",
          boxShadow: "4px 0 20px rgba(0,0,0,0.8)",
        }}
        aria-label="Main navigation"
      >
        {/* ── 100% Opacity Pirate Ship & Sea Nautical Art Background Layer ── */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-100"
          style={{
            backgroundImage: "url('/assets/pirate_ship_sea_bg.jpg')",
          }}
        />

        {/* Subtle Darkening Overlay for text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f131a]/40 via-[#0c0f16]/30 to-[#090b10]/50 pointer-events-none" />

        {/* Nav items */}
        <nav className="flex flex-col gap-1.5 p-2 pt-4 flex-1 relative z-10">
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
                  "relative flex items-center gap-3.5 rounded-lg px-3 py-3",
                  "w-full text-left transition-all duration-200 group outline-none font-cinzel border backdrop-blur-sm shadow-md",
                  isActive
                    ? "bg-gradient-to-r from-[#2a3242]/95 to-[#1c222e]/95 border-[#c49339] text-amber-300 shadow-xl"
                    : "bg-[#10141d]/85 border-[#262c38] text-stone-100 hover:border-[#8c643b] hover:bg-[#1a212e]/95",
                ].join(" ")}
              >
                {/* Active left gold indicator */}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-[#c49339]"
                  />
                )}

                {/* Icon */}
                {Icon && (
                  <span className={["shrink-0 transition-colors p-1 rounded bg-[#0d1017] border border-[#2b3342]",
                    isActive ? "text-amber-400 border-amber-500/50" : "text-amber-300 group-hover:text-amber-200"
                  ].join(" ")}>
                    <Icon size={18} stroke="currentColor" />
                  </span>
                )}

                {/* Label */}
                <span className="hidden lg:block text-xs font-bold tracking-widest truncate uppercase">
                  {item.label}
                </span>

                {/* Hover tooltip (icon-only mode) */}
                <span className="
                  lg:hidden absolute left-full ml-3 px-3 py-1.5
                  bg-[#181d26] border border-[#c49339] rounded text-xs text-amber-300
                  whitespace-nowrap shadow-2xl z-50
                  opacity-0 pointer-events-none
                  group-hover:opacity-100 transition-opacity duration-150
                  font-cinzel tracking-wider uppercase
                ">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom character mini-display (Parchment Card) */}
        <div className="p-3 pb-5 relative z-10" style={{ borderTop: "2px solid #262c38" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-[#10141d]/90 border-[#2b3342] backdrop-blur-sm shadow-lg">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-cinzel text-xs font-black text-[#2c1b0e]"
              style={{ background: "linear-gradient(180deg, #e5d1a7 0%, #cca972 100%)", border: "1.5px solid #5c4028" }}
            >
              {(user.name || "A").charAt(0)}
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="text-xs font-bold text-amber-300 truncate font-cinzel">{user.name}</p>
              <p className="text-[10px] text-stone-300 truncate font-crimson">{user.equippedTitle || user.class}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ────────────────────────────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{ background: "#141820", borderTop: "2px solid #3d2d1d" }}
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
                "flex flex-col items-center gap-1 px-3 py-1 rounded transition-colors font-cinzel",
                isActive ? "text-amber-400 font-bold" : "text-stone-400",
              ].join(" ")}
            >
              {Icon && <Icon size={18} stroke="currentColor" />}
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}