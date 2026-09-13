import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:          { type: String, required: true, trim: true },
  description:    { type: String, default: "" },
  category:       { type: String, enum: ["STR", "INT", "FOC", "AGI", "VIT"], default: "FOC" },
  levelNodeId:    { type: Number, default: 7 },
  xpReward:       { type: Number, default: 120 },
  currencyReward: { type: Number, default: 45 },
  isCompleted:    { type: Boolean, default: false },
  completedAt:    { type: Date },
  dueDate:        { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
