import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useProgression } from "../lib/ProgressionContext";

const MOCK_LEADERBOARD = [
  { _id: "h1", rank: 1, name: "Valerius the Undaunted", class: "Paladin", level: 19, xp: 4820, streak: 42, equippedTitle: "Realm Champion", currency: 3400 },
  { _id: "h2", rank: 2, name: "Lyra Frostweaver", class: "Archmage", level: 16, xp: 3910, streak: 31, equippedTitle: "Master of Arcane", currency: 2800 },
  { _id: "h3", rank: 3, name: "Kaelen Shadowblade", class: "Rogue", level: 14, xp: 3100, streak: 27, equippedTitle: "Nightstalker", currency: 2100 },
  { _id: "h4", rank: 4, name: "Theron Ironhide", class: "Warrior", level: 12, xp: 2650, streak: 21, equippedTitle: "Shield of Oakhaven", currency: 1800 },
  { _id: "h5", rank: 5, name: "Elowen Sunfire", class: "Cleric", level: 10, xp: 2100, streak: 18, equippedTitle: "Beacon of Light", currency: 1500 },
  { _id: "h6", rank: 6, name: "Aeldric", class: "Shadow Warden", level: 10, xp: 450, streak: 14, equippedTitle: "Iron Squire", currency: 840 },
];

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState("level");
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { state } = useProgression();

  const currentUserName = (user?.name || user?.username || state?.name || "Aeldric").trim().toLowerCase();

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/leaderboard?sortBy=${sortBy}`);
        if (res.data && res.data.leaderboard && Array.isArray(res.data.leaderboard)) {
          // If the backend response doesn't include the current user, ensure Aeldric is merged
          const exists = res.data.leaderboard.some(
            (item) => (item.name || item.username || "").trim().toLowerCase() === currentUserName
          );
          if (!exists) {
            setLeaderboard([...res.data.leaderboard, MOCK_LEADERBOARD[5]]);
          } else {
            setLeaderboard(res.data.leaderboard);
          }
        }
      } catch {
        // Fallback to local mock data
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [sortBy, currentUserName]);

  // Sort rows based on selected tab and reassign sequential ranks
  const sortedLeaderboard = [...leaderboard]
    .sort((a, b) => {
      const aIsCurrent = Boolean(
        currentUserName &&
          (a.name?.trim().toLowerCase() === currentUserName ||
            a.username?.trim().toLowerCase() === currentUserName)
      );
      const bIsCurrent = Boolean(
        currentUserName &&
          (b.name?.trim().toLowerCase() === currentUserName ||
            b.username?.trim().toLowerCase() === currentUserName)
      );

      const aLevel = aIsCurrent && state?.level ? state.level : (a.level || 0);
      const bLevel = bIsCurrent && state?.level ? state.level : (b.level || 0);
      const aStreak = aIsCurrent && user?.streak != null ? user.streak : (a.streak || 0);
      const bStreak = bIsCurrent && user?.streak != null ? user.streak : (b.streak || 0);
      const aXp = aIsCurrent && state?.xp != null ? state.xp : (a.xp || 0);
      const bXp = bIsCurrent && state?.xp != null ? state.xp : (b.xp || 0);

      if (sortBy === "streak") return bStreak - aStreak || bLevel - aLevel;
      if (sortBy === "xp") return bXp - aXp || bLevel - aLevel;
      return bLevel - aLevel || bXp - aXp;
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#140e0a] text-[#2b1d0e]">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-cinzel">

        {/* Page Parchment Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] shadow-xl">
          <div>
            <h1 className="text-xl font-black text-[#3b2413] tracking-widest uppercase">
              Hall of Realm Heroes (Leaderboard)
            </h1>
            <p className="text-xs text-[#6e4e31] font-crimson mt-1">
              Top adventurers who have mastered real-world discipline and leveled up their stats
            </p>
          </div>

          {/* Sort Tabs */}
          <div className="flex gap-1.5 p-1 rounded-lg bg-[#251d16] border border-[#593e28]">
            {[
              { id: "level", label: "By Level" },
              { id: "streak", label: "By Streak" },
              { id: "xp", label: "By XP" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  sortBy === tab.id
                    ? "bg-[#593e28] text-[#f5ebd6] border border-[#8c643b]"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table Parchment */}
        <div className="rounded-xl border-2 border-[#593e28] bg-[#ede1c4] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-2 p-3 border-b-2 border-[#8c643b] bg-[#d9c49c] text-xs font-black text-[#4a2e16] uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-5 sm:col-span-5">Adventurer</div>
            <div className="col-span-2 sm:col-span-2 text-center">Level</div>
            <div className="col-span-3 sm:col-span-2 text-center">Streak</div>
            <div className="hidden sm:block sm:col-span-2 text-right">XP</div>
          </div>

          <div className="divide-y divide-[#cdaf80]">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#593e28] font-bold">
                Querying realm archives...
              </div>
            ) : (
              sortedLeaderboard.map((item, idx) => {
                // Strictly evaluate whether this row is the current logged-in character
                const isCurrentUser = Boolean(
                  currentUserName &&
                    (item.name?.trim().toLowerCase() === currentUserName ||
                      item.username?.trim().toLowerCase() === currentUserName)
                );
                const rank = item.rank || idx + 1;
                const level = isCurrentUser && state?.level ? state.level : (item.level || 0);
                const xp = isCurrentUser && state?.xp != null ? state.xp : (item.xp || 0);
                const streak = isCurrentUser && user?.streak != null ? user.streak : (item.streak || 0);
                const title =
                  isCurrentUser && state?.tier
                    ? (state.tier.title || state.tier.name)
                    : (item.equippedTitle || item.class || "Shadow Warden");

                return (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`grid grid-cols-12 gap-2 items-center p-3.5 transition-colors ${
                      isCurrentUser
                        ? "bg-[#c49339]/30 border-l-4 border-l-[#8c4b18]"
                        : "hover:bg-[#e0cfab]"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex justify-center">
                      {rank === 1 && <span className="w-8 h-8 rounded-full bg-[#c49339] border border-[#5c4028] flex items-center justify-center font-black text-stone-900 text-xs shadow">🥇 1</span>}
                      {rank === 2 && <span className="w-8 h-8 rounded-full bg-[#a3b0be] border border-[#3e4854] flex items-center justify-center font-black text-stone-900 text-xs shadow">🥈 2</span>}
                      {rank === 3 && <span className="w-8 h-8 rounded-full bg-[#b87d4b] border border-[#523318] flex items-center justify-center font-black text-stone-900 text-xs shadow">🥉 3</span>}
                      {rank > 3 && <span className="text-xs font-black text-[#593e28]">#{rank}</span>}
                    </div>

                    {/* Adventurer Details */}
                    <div className="col-span-5 sm:col-span-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#593e28] border border-[#3b2413] flex items-center justify-center text-xs font-black text-[#f5ebd6] shrink-0">
                        {item.name ? item.name.charAt(0) : "H"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#2b1d0e] truncate">
                            {item.name || item.username}
                          </p>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-[#8c4b18] text-[#f5ebd6] tracking-wider uppercase">
                              [YOU]
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#6e4e31] font-crimson font-semibold truncate">
                          {title}
                        </p>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="col-span-2 sm:col-span-2 text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-black bg-[#593e28] text-[#f5ebd6]">
                        Lv. {level}
                      </span>
                    </div>

                    {/* Streak */}
                    <div className="col-span-3 sm:col-span-2 text-center text-xs font-black text-[#8c3b18]">
                      🔥 {streak} days
                    </div>

                    {/* XP */}
                    <div className="hidden sm:block sm:col-span-2 text-right text-xs font-bold text-[#6d4c2b] tabular-nums">
                      {xp.toLocaleString()} XP
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
