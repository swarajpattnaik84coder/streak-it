import Task from "../models/Task.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", tasks });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, category, levelNodeId, xpReward, currencyReward, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ status: "error", message: "Task title is required" });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description: description || "",
      category: category || "FOC",
      levelNodeId: levelNodeId || 7,
      xpReward: xpReward || 120,
      currencyReward: currencyReward || 45,
      dueDate: dueDate || new Date(),
    });

    res.status(201).json({ status: "success", task });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const toggleTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ status: "error", message: "Task not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const newStatus = !task.isCompleted;
    task.isCompleted = newStatus;
    task.completedAt = newStatus ? new Date() : null;
    await task.save();

    let leveledUp = false;

    if (newStatus) {
      // Award rewards
      user.xp += task.xpReward;
      user.currency += task.currencyReward;
      user.completedQuestsCount = (user.completedQuestsCount || 0) + 1;

      // Boost associated stat
      const statIndex = user.stats.findIndex(s => s.key === task.category);
      if (statIndex !== -1) {
        user.stats[statIndex].value = Math.min(100, user.stats[statIndex].value + 2);
      }

      // Check level up threshold
      while (user.xp >= user.xpToNext) {
        user.level += 1;
        user.xp -= user.xpToNext;
        user.xpToNext = Math.round(user.xpToNext * 1.25);
        user.unallocatedStatPoints += 3;
        leveledUp = true;
      }

      await user.save();
    } else {
      // Revert rewards if unchecking
      user.xp = Math.max(0, user.xp - task.xpReward);
      user.currency = Math.max(0, user.currency - task.currencyReward);
      user.completedQuestsCount = Math.max(0, (user.completedQuestsCount || 0) - 1);
      await user.save();
    }

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      status: "success",
      task,
      user: updatedUser,
      leveledUp,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ status: "error", message: "Task not found" });
    }

    res.status(200).json({ status: "success", message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
