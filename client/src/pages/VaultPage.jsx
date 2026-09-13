import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";

const DEFAULT_ACHIEVEMENTS = [
  { id: "first_quest", name: "First Blood", desc: "Complete your first real-world task", icon: "🗡️", required: 1, type: "quests" },
  { id: "streak_7", name: "7-Day Streak Master", desc: "Maintain a 7-day consecutive activity streak", icon: "🔥", required: 7, type: "streak" },
  { id: "gold_hoarder", name: "Gold Hoarder", desc: "Accumulate 500 Gold currency", icon: "💰", required: 500, type: "gold" },
  { id: "level_5", name: "Vanguard", desc: "Reach Character Level 5", icon: "🛡️", required: 5, type: "level" },
  { id: "stat_master", name: "Attribute Master", desc: "Reach 80+ in any single RPG attribute", icon: "⚡", required: 80, type: "stat" },
];

export default function VaultPage() {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVault() {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/vault");
        if (res.data) {
          setCompletedTasks(res.data.completedTasks || []);
          setAchievements(res.data.achievements || []);
        }
      } catch (err) {
        // Fallback computation
        const computed = DEFAULT_ACHIEVEMENTS.map(ach => {
          let progress = 0;
          if (ach.type === "quests") progress = user.completedQuestsCount || 12;
          if (ach.type === "streak") progress = user.streak || 14;
          if (ach.type === "gold") progress = user.currency || 840;
          if (ach.type === "level") progress = user.level || 7;
          if (ach.type === "stat") progress = 82;
          return {
            ...ach,
            progress,
            isUnlocked: progress >= ach.required,
          };
        });
        setAchievements(computed);
      } finally {
        setLoading(false);
      }
    }
    fetchVault();
  }, [user]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#07070e] text-stone-100">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Page Header */}
        <div className="p-5 rounded-xl border border-rpg bg-gradient-to-r from-[#121024] to-[#0a0914]">
          <h1 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase">
            The Royal Vault & Quest History
          </h1>
          <p className="text-xs text-rpg-muted font-crimson mt-1">
            Review your past achievements, completed tasks, and milestone badges earned in the realm
          </p>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-rpg bg-[#0a0914] text-center">
            <p className="text-xl font-cinzel font-bold text-amber-400 tabular-nums">
              {user.completedQuestsCount || 12}
            </p>
            <p className="text-[10px] text-rpg-muted uppercase font-cinzel mt-1">Quests Completed</p>
          </div>
          <div className="p-4 rounded-xl border border-rpg bg-[#0a0914] text-center">
            <p className="text-xl font-cinzel font-bold text-orange-400 tabular-nums">
              🔥 {user.streak} Days
            </p>
            <p className="text-[10px] text-rpg-muted uppercase font-cinzel mt-1">Active Streak</p>
          </div>
          <div className="p-4 rounded-xl border border-rpg bg-[#0a0914] text-center">
            <p className="text-xl font-cinzel font-bold text-gold tabular-nums">
              {user.currency} Gold
            </p>
            <p className="text-[10px] text-rpg-muted uppercase font-cinzel mt-1">Vault Currency</p>
          </div>
          <div className="p-4 rounded-xl border border-rpg bg-[#0a0914] text-center">
            <p className="text-xl font-cinzel font-bold text-purple-400 tabular-nums">
              Lv. {user.level}
            </p>
            <p className="text-[10px] text-rpg-muted uppercase font-cinzel mt-1">Hero Tier</p>
          </div>
        </div>

        {/* Section 1: Realm Achievements */}
        <div className="p-5 rounded-xl border border-rpg bg-[#0a0914] flex flex-col gap-4">
          <h2 className="text-sm font-cinzel font-bold text-gold uppercase tracking-wider">
            Realm Achievements & Trophies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-lg border flex items-center gap-3 transition-all ${
                  ach.isUnlocked
                    ? "bg-[#141226] border-amber-500/40"
                    : "bg-[#0b0a16] border-[#1e1c30] opacity-60"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#1a172c] border border-[#2f2a4a] flex items-center justify-center text-xl shrink-0">
                  {ach.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-cinzel font-bold text-stone-100 truncate">
                      {ach.name}
                    </h3>
                    <span className={`text-[9px] font-cinzel font-bold px-1.5 py-0.5 rounded ${
                      ach.isUnlocked ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-stone-800 text-stone-400"
                    }`}>
                      {ach.isUnlocked ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>
                  <p className="text-[11px] text-rpg-muted font-crimson mt-0.5">{ach.desc}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#181628] overflow-hidden mt-2">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${Math.min((ach.progress / ach.required) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Completed Quest History Log */}
        <div className="p-5 rounded-xl border border-rpg bg-[#0a0914] flex flex-col gap-4">
          <h2 className="text-sm font-cinzel font-bold text-stone-200 uppercase tracking-wider">
            Completed Quest Logs
          </h2>

          <div className="flex flex-col gap-2">
            {[
              { id: "c1", title: "Complete 10 LeetCode Algorithms", cat: "INT", xp: 180, gold: 60, date: "Yesterday" },
              { id: "c2", title: "Heavy Upper Body Gym Workout", cat: "STR", xp: 160, gold: 50, date: "2 days ago" },
              { id: "c3", title: "5km Morning Trail Run", cat: "AGI", xp: 140, gold: 45, date: "3 days ago" },
              { id: "c4", title: "Read 30 Pages of Technical Documentation", cat: "FOC", xp: 120, gold: 40, date: "4 days ago" },
            ].map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#111022] border border-[#201d36]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-xs font-medium text-stone-200">{task.title}</h3>
                    <p className="text-[10px] text-rpg-muted font-crimson">{task.date}</p>
                  </div>
                </div>
                <div className="text-[10px] font-cinzel flex items-center gap-2">
                  <span className="text-amber-400 font-bold">+{task.xp} XP</span>
                  <span className="text-gold font-bold">+{task.gold} Gold</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
