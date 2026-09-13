import Task from "../models/Task.js";
import User from "../models/User.js";

const DEFAULT_ACHIEVEMENTS = [
  { id: "first_quest", name: "First Blood", desc: "Complete your first real-world task", icon: "🗡️", required: 1, type: "quests" },
  { id: "streak_7", name: "7-Day Streak Master", desc: "Maintain a 7-day consecutive activity streak", icon: "🔥", required: 7, type: "streak" },
  { id: "gold_hoarder", name: "Gold Hoarder", desc: "Accumulate 500 Gold currency", icon: "💰", required: 500, type: "gold" },
  { id: "level_5", name: "Vanguard", desc: "Reach Character Level 5", icon: "🛡️", required: 5, type: "level" },
  { id: "stat_master", name: "Attribute Master", desc: "Reach 80+ in any single RPG attribute", icon: "⚡", required: 80, type: "stat" },
];

export const getVaultData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const completedTasks = await Task.find({ userId: req.userId, isCompleted: true })
      .sort({ completedAt: -1 })
      .limit(30);

    const achievements = DEFAULT_ACHIEVEMENTS.map(ach => {
      let isUnlocked = false;
      let progress = 0;

      if (ach.type === "quests") {
        progress = user.completedQuestsCount || 0;
        isUnlocked = progress >= ach.required;
      } else if (ach.type === "streak") {
        progress = user.streak || 0;
        isUnlocked = progress >= ach.required;
      } else if (ach.type === "gold") {
        progress = user.currency || 0;
        isUnlocked = progress >= ach.required;
      } else if (ach.type === "level") {
        progress = user.level || 1;
        isUnlocked = progress >= ach.required;
      } else if (ach.type === "stat") {
        const maxStat = Math.max(...(user.stats || []).map(s => s.value), 0);
        progress = maxStat;
        isUnlocked = maxStat >= ach.required;
      }

      return {
        ...ach,
        isUnlocked,
        progress,
      };
    });

    res.status(200).json({
      status: "success",
      completedTasks,
      achievements,
      statsOverview: {
        totalCompletedQuests: user.completedQuestsCount || completedTasks.length,
        currentStreak: user.streak,
        totalCurrency: user.currency,
        level: user.level,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
