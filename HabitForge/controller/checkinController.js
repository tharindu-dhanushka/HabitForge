import Checkin from "../habitforge-backend/model/checkinModel.js";
import Habit   from "../habitforge-backend/model/habitModel.js";

// CHECK-IN
export const checkinHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const today   = new Date().toISOString().split("T")[0];

    const exists = await Checkin.findOne({ habitId, date: today });

    if (exists) {
      return res.status(400).json({ message: "Already checked today" });
    }

    const completedAt = new Date();                             // ✅ exact timestamp

    // Save checkin record
    const checkin = new Checkin({ habitId, date: today, completedAt });
    const saved   = await checkin.save();

    // ✅ Also stamp completedAt directly on the habit document (visible in MongoDB Compass)
    await Habit.findByIdAndUpdate(habitId, { completedAt });

    res.status(200).json(saved);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};