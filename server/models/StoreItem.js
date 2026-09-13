import mongoose from "mongoose";

const storeItemSchema = new mongoose.Schema({
  itemId:      { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  description: { type: String, default: "" },
  category:    { type: String, enum: ["gear", "booster", "title", "badge"], default: "gear" },
  price:       { type: Number, required: true },
  icon:        { type: String, default: "⚔️" },
  statBonus:   {
    key:    { type: String, default: "" },
    amount: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model("StoreItem", storeItemSchema);
