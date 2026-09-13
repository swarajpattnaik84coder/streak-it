import User from "../models/User.js";

export const allocateStatPoint = async (req, res) => {
  try {
    const { statKey } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (user.unallocatedStatPoints <= 0) {
      return res.status(400).json({ status: "error", message: "No unallocated stat points available" });
    }

    const statIndex = user.stats.findIndex(s => s.key === statKey);
    if (statIndex === -1) {
      return res.status(400).json({ status: "error", message: "Invalid stat key" });
    }

    user.stats[statIndex].value = Math.min(100, user.stats[statIndex].value + 2);
    user.unallocatedStatPoints -= 1;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ status: "success", user: userObj });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateEquipped = async (req, res) => {
  try {
    const { title, badge } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (title) user.equippedTitle = title;
    if (badge) user.equippedBadge = badge;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ status: "success", user: userObj });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
