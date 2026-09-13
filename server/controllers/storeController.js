import StoreItem from "../models/StoreItem.js";
import User from "../models/User.js";

const DEFAULT_STORE_ITEMS = [
  { itemId: "potion_xp", name: "Elixir of Insight", description: "+250 XP bonus instantly", category: "booster", price: 200, icon: "🧪", statBonus: { key: "INT", amount: 2 } },
  { itemId: "title_shadow", name: "Title: Shadow Walker", description: "Unlocks the 'Shadow Walker' title for your profile", category: "title", price: 350, icon: "👑", statBonus: { key: "AGI", amount: 3 } },
  { itemId: "badge_dragon", name: "Badge: Dragon Slayer", description: "Equip a glowing Dragon Crest badge", category: "badge", price: 500, icon: "🐉", statBonus: { key: "STR", amount: 4 } },
  { itemId: "gear_obsidian", name: "Obsidian Cloak", description: "Mystic armor that increases Focus", category: "gear", price: 650, icon: "🛡️", statBonus: { key: "FOC", amount: 5 } },
  { itemId: "potion_vitality", name: "Vial of Eternal Flame", description: "+3 Vitality stat boost", category: "booster", price: 300, icon: "🔥", statBonus: { key: "VIT", amount: 3 } },
  { itemId: "title_mythic", name: "Title: Mythic Sovereign", description: "Prestige title reserved for legendary streak masters", category: "title", price: 1000, icon: "⚔️", statBonus: { key: "STR", amount: 6 } },
];

export const getStoreItems = async (_req, res) => {
  try {
    let items = await StoreItem.find({});
    if (!items || items.length === 0) {
      items = DEFAULT_STORE_ITEMS;
    }
    res.status(200).json({ status: "success", items });
  } catch (error) {
    res.status(200).json({ status: "success", items: DEFAULT_STORE_ITEMS });
  }
};

export const buyStoreItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    let item = await StoreItem.findOne({ itemId });
    if (!item) {
      item = DEFAULT_STORE_ITEMS.find(i => i.itemId === itemId);
    }

    if (!item) {
      return res.status(404).json({ status: "error", message: "Item not found" });
    }

    if (user.currency < item.price) {
      return res.status(400).json({ status: "error", message: `Insufficient Gold. You need ${item.price} Gold.` });
    }

    if (user.inventory.includes(itemId)) {
      return res.status(400).json({ status: "error", message: "You already own this item!" });
    }

    user.currency -= item.price;
    user.inventory.push(itemId);

    // If booster with XP
    if (itemId === "potion_xp") {
      user.xp += 250;
      while (user.xp >= user.xpToNext) {
        user.level += 1;
        user.xp -= user.xpToNext;
        user.xpToNext = Math.round(user.xpToNext * 1.25);
        user.unallocatedStatPoints += 3;
      }
    }

    // Apply stat bonus if available
    if (item.statBonus && item.statBonus.key) {
      const statIdx = user.stats.findIndex(s => s.key === item.statBonus.key);
      if (statIdx !== -1) {
        user.stats[statIdx].value = Math.min(100, user.stats[statIdx].value + item.statBonus.amount);
      }
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ status: "success", user: userObj, message: `Successfully purchased ${item.name}!` });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
