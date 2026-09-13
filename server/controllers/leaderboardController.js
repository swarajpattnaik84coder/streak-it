import User from "../models/User.js";

const DEFAULT_HEROES = [
  { _id: "hero1", name: "Valerius the Undaunted", class: "Paladin", level: 19, xp: 4820, streak: 42, equippedTitle: "Realm Champion", currency: 3400, stats: [{ key: "STR", value: 95 }] },
  { _id: "hero2", name: "Lyra Frostweaver", class: "Archmage", level: 16, xp: 3910, streak: 31, equippedTitle: "Master of Arcane", currency: 2800, stats: [{ key: "INT", value: 92 }] },
  { _id: "hero3", name: "Kaelen Shadowblade", class: "Rogue", level: 14, xp: 3100, streak: 27, equippedTitle: "Nightstalker", currency: 2100, stats: [{ key: "AGI", value: 89 }] },
  { _id: "hero4", name: "Theron Ironhide", class: "Warrior", level: 12, xp: 2650, streak: 21, equippedTitle: "Shield of Oakhaven", currency: 1800, stats: [{ key: "VIT", value: 85 }] },
  { _id: "hero5", name: "Elowen Sunfire", class: "Cleric", level: 10, xp: 2100, streak: 18, equippedTitle: "Beacon of Light", currency: 1500, stats: [{ key: "FOC", value: 83 }] },
];

export const getLeaderboard = async (req, res) => {
  try {
    const { sortBy = "level" } = req.query;

    let sortOption = { level: -1, xp: -1 };
    if (sortBy === "streak") sortOption = { streak: -1, level: -1 };
    if (sortBy === "xp") sortOption = { xp: -1, level: -1 };

    let dbUsers = await User.find({}).select("-password").sort(sortOption).limit(20);

    // Merge with default realm heroes if needed
    let leaderboard = dbUsers.map((u, i) => ({
      ...u.toObject(),
      rank: i + 1,
    }));

    if (leaderboard.length < 5) {
      const merged = [...leaderboard];
      DEFAULT_HEROES.forEach(hero => {
        if (!merged.some(u => u.name === hero.name)) {
          merged.push(hero);
        }
      });

      if (sortBy === "streak") {
        merged.sort((a, b) => b.streak - a.streak);
      } else if (sortBy === "xp") {
        merged.sort((a, b) => b.xp - a.xp);
      } else {
        merged.sort((a, b) => b.level - a.level);
      }

      leaderboard = merged.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
    }

    res.status(200).json({ status: "success", leaderboard });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
