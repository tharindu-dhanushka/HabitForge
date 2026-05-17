import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  frequency:   { type: String, default: "daily" },
  completedAt: { type: Date, default: null }   // ✅ last completion time — visible directly in MongoDB
});

export default mongoose.model("habits", habitSchema);