import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  frequency: { type: String, default: "daily" }
});

export default mongoose.model("habits", habitSchema);