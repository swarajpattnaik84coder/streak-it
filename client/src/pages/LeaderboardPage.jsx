import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";
import Badge from "../components/ui/Badge.jsx";

const MOCK_LEADERBOARD = [
  { _id: "h1", rank: 1, name: "Valerius the Undaunted", class: "Paladin", level: 19, xp: 4820, streak: 42, equippedTitle: "Realm Champion", currency: 3400 },
  { _id: "h2", rank: 2, name: "Lyra Frostweaver", class: "Archmage", level: 16, xp: 3910, streak: 31, equippedTitle: "Master of Arcane", currency: 2800 },
  { _id: "h3", rank: 3, name: "Kaelen Shadowblade", class: "Rogue", level: 14, xp: 3100, streak: 27, equippedTitle: "Nightstalker", currency: 2100 },
  { _id: "h4", rank: 4, name: "Theron Ironhide", class: "Warrior", level: 12, xp: 2650, streak: 21, equippedTitle: "Shield of Oakhaven", currency: 1800 },
  { _id: "h5", rank: 5, name: "Elowen Sunfire", class: "Cleric", level: 10, xp: 2100, streak: 18, equippedTitle: "Beacon of Light", currency: 1500 },
];

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState("level");
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/leaderboard?sortBy=${sortBy}`);
        if (res.data && res.data.leaderboard) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        // Keep fallback
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [sortBy]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#07070e] text-stone-100">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-rpg bg-gradient-to-r from-[#121024] to-[#0a0914]">
          <div>
            <h1 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase">
              Hall of Realm Heroes (Leaderboard)
            </h1>
            <p className="text-xs text-rpg-muted font-crimson mt-1">
              Top adventurers who have mastered real-world discipline and leveled up their stats
            </p>
          </div>

          {/* Sort Tabs */}
          <div className="flex gap-1.5 p-1 rounded-lg bg-[#090812] border border-[#201d36]">
            {[
              { id: "level", label: "By Level" },
              { id: "streak", label: "By Streak" },
              { id: "xp", label: "By XP" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-cinzel transition-all ${
                  sortBy === tab.id
                    ? "bg-amber-950/60 border border-amber-500/50 text-amber-400 font-bold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-xl border border-rpg bg-[#0a0914] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-2 p-3 border-b border-[#1f1d30] text-[10px] font-cinzel font-bold text-rpg-muted uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-5 sm:col-span-5">Adventurer</div>
            <div className="col-span-2 sm:col-span-2 text-center">Level</div>
            <div className="col-span-3 sm:col-span-2 text-center">Streak</div>
            <div className="hidden sm:block sm:col-span-2 text-right">XP</div>
          </div>

          <div className="divide-y divide-[#161428]">
            {loading ? (
              <div className="p-8 text-center text-xs text-rpg-muted font-cinzel">
                Querying realm archives...
              </div>
            ) : (
              leaderboard.map((item, idx) => {
                const isCurrentUser = user && (item.name === user.name || item.username === user.username);
                const rank = item.rank || idx + 1;

                return (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`grid grid-cols-12 gap-2 items-center p-3.5 transition-colors ${
                      isCurrentUser
                        ? "bg-amber-950/30 border-l-2 border-l-amber-400"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex justify-center">
                      {rank === 1 && <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center font-cinzel font-bold text-gold text-xs">🥇 1</span>}
                      {rank === 2 && <span className="w-7 h-7 rounded-full bg-slate-400/20 border border-slate-300 flex items-center justify-center font-cinzel font-bold text-slate-300 text-xs">🥈 2</span>}
                      {rank === 3 && <span className="w-7 h-7 rounded-full bg-amber-800/20 border border-amber-700 flex items-center justify-center font-cinzel font-bold text-amber-600 text-xs">🥉 3</span>}
                      {rank > 3 && <span className="text-xs font-cinzel font-bold text-rpg-muted">#{rank}</span>}
                    </div>

                    {/* Adventurer Details */}
                    <div className="col-span-5 sm:col-span-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1b172b] border border-[#373152] flex items-center justify-center font-cinzel text-xs font-bold text-amber-400 shrink-0">
                        {item.name ? item.name.charAt(0) : "H"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-cinzel font-bold text-stone-100 truncate">
                            {item.name || item.username}
                          </p>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500 text-stone-950 font-cinzel">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-rpg-muted font-crimson truncate">
                          {item.equippedTitle || item.class || "Shadow Warden"}
                        </p>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="col-span-2 sm:col-span-2 text-center">
                      <Badge variant="gold" size="xs">
                        Lv. {item.level}
                      </Badge>
                    </div>

                    {/* Streak */}
                    <div className="col-span-3 sm:col-span-2 text-center text-xs font-cinzel font-bold text-orange-400">
                      🔥 {item.streak} days
                    </div>

                    {/* XP */}
                    <div className="hidden sm:block sm:col-span-2 text-right text-xs font-cinzel text-amber-400 tabular-nums">
                      {(item.xp || 0).toLocaleString()} XP
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
