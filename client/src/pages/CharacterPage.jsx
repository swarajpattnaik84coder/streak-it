import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import CharacterViewer from "../components/character/CharacterViewer.jsx";
import StatBar from "../components/ui/StatBar.jsx";

export default function CharacterPage() {
  const { user, allocateStat } = useAuth();
  const points = user.unallocatedStatPoints || 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#140e0a] text-[#2b1d0e]">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-cinzel">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] shadow-xl">
          <div>
            <h1 className="text-xl font-black text-[#3b2413] tracking-widest uppercase">
              Character Sanctum
            </h1>
            <p className="text-xs text-[#6e4e31] font-crimson mt-1 font-semibold">
              Customize your hero, view 3D gear rendering, and allocate earned RPG attribute points
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-black bg-[#593e28] text-[#f5ebd6]">
              Lv. {user.level} {user.class}
            </span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 3D Character Renderer */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-4 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] shadow-xl flex flex-col gap-3">
              <h2 className="text-xs font-black text-[#3b2413] uppercase tracking-wider text-center">
                Avatar 3D Model Inspection
              </h2>
              <div className="h-[280px] rounded-lg overflow-hidden border-2 border-[#593e28]">
                <CharacterViewer modelPath="/models/character_ranger.glb" />
              </div>
              <div className="text-center text-[10px] text-[#6e4e31] font-crimson font-bold">
                Drag to rotate avatar • Scroll to zoom
              </div>
            </div>

            {/* Equipped Profile Card */}
            <div className="p-4 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] text-center flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[#6e4e31] uppercase tracking-widest">Active Title & Badge</p>
              <h3 className="text-sm font-black text-[#8c4b18]">
                {user.equippedTitle || "Shadow Warden"}
              </h3>
              <p className="text-xs text-[#3b2413] font-crimson font-bold">
                Equipped Crest: <span className="text-[#6d4c2b] font-black">🐉 {user.equippedBadge || "Dragon Crest"}</span>
              </p>
            </div>
          </div>

          {/* Attributes & Progression Column */}
          <div className="lg:col-span-7 flex flex-col gap-5">

            {/* XP & Level Summary */}
            <div className="p-4 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#3b2413] font-bold">XP Progress to Level {user.level + 1}</span>
                <span className="text-[#8c4b18] font-black tabular-nums">
                  {user.xp} / {user.xpToNext} XP
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#cda574] overflow-hidden border border-[#593e28]">
                <motion.div
                  className="h-full bg-[#8c4b18] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((user.xp / user.xpToNext) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Attributes Allocation Section */}
            <div className="p-5 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-[#3b2413] uppercase tracking-wider">
                    RPG Core Attributes
                  </h3>
                  <p className="text-[11px] text-[#6e4e31] font-crimson font-semibold">
                    Increase attributes by completing category tasks or spending level-up points
                  </p>
                </div>

                {points > 0 ? (
                  <div className="px-3 py-1 rounded bg-[#8c4b18] text-[#f5ebd6] text-xs font-black shadow-md">
                    +{points} Unallocated Points!
                  </div>
                ) : (
                  <div className="text-[10px] text-[#6e4e31] font-bold">
                    0 Points Available
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {user.stats && user.stats.map((s) => (
                  <div key={s.key} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f5e9ce] border border-[#a37d53]">
                    <div className="flex-1">
                      <StatBar
                        label={`${s.label} (${s.key})`}
                        value={s.value}
                        max={s.max || 100}
                        color={s.color}
                      />
                    </div>
                    {points > 0 && (
                      <button
                        onClick={() => allocateStat(s.key)}
                        className="px-3 py-1 rounded bg-[#593e28] hover:bg-[#3b2413] text-[#f5ebd6] font-bold text-xs uppercase shadow transition-all shrink-0 active:scale-95 border border-[#8c643b]"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocked Abilities */}
            <div className="p-4 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] flex flex-col gap-3">
              <h3 className="text-xs font-black text-[#3b2413] uppercase tracking-wider">
                Active Hero Abilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { name: "Shadow Step", desc: "+10% XP on Coding Tasks", tier: "I" },
                  { name: "Iron Focus", desc: "+15% Gold on Reading Tasks", tier: "II" },
                  { name: "Endurance Aura", desc: "+5 Streak Retention Buffer", tier: "I" },
                ].map((ab) => (
                  <div key={ab.name} className="p-2.5 rounded-lg bg-[#f5e9ce] border border-[#a37d53]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#593e28] flex items-center justify-center text-[9px] text-[#f5ebd6] font-bold">
                        {ab.tier}
                      </span>
                      <span className="text-xs font-bold text-[#3b2413]">{ab.name}</span>
                    </div>
                    <p className="text-[10px] text-[#6e4e31] font-crimson font-semibold mt-1">{ab.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
