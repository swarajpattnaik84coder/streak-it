import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: Number, default: 50 },
  max: { type: Number, default: 100 },
  color: { type: String, default: "#c9a84c" },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  name:     { type: String, default: "Adventurer" },
  class:    { type: String, default: "Shadow Warden" },
  level:    { type: Number, default: 7 },
  xp:       { type: Number, default: 1340 },
  xpToNext: { type: Number, default: 1500 },
  currency: { type: Number, default: 840 },
  streak:   { type: Number, default: 14 },
  lastActiveDate: { type: Date, default: Date.now },
  unallocatedStatPoints: { type: Number, default: 3 },
  stats: {
    type: [statSchema],
    default: [
      { key: "STR", label: "Strength",  value: 68, max: 100, color: "#ef4444" },
      { key: "INT", label: "Intellect", value: 82, max: 100, color: "#3b82f6" },
      { key: "FOC", label: "Focus",     value: 74, max: 100, color: "#a855f7" },
      { key: "AGI", label: "Agility",   value: 59, max: 100, color: "#22c55e" },
      { key: "VIT", label: "Vitality",  value: 71, max: 100, color: "#f97316" },
    ],
  },
  inventory: [{ type: String }],
  equippedTitle: { type: String, default: "Novice Traveler" },
  equippedBadge: { type: String, default: "shield" },
  completedQuestsCount: { type: Number, default: 12 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
