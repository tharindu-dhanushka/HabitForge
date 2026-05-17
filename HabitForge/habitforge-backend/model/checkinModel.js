import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
  habitId:     { type: mongoose.Schema.Types.ObjectId, ref: "habits" },
  date:        { type: String, required: true },
  completedAt: { type: Date, default: Date.now }   // ✅ exact completion timestamp
});

export default mongoose.model("checkins", checkinSchema);