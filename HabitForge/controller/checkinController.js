import Checkin from "../model/checkinModel.js";

// CHECK-IN
export const checkinHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const today = new Date().toISOString().split("T")[0];

    const exists = await Checkin.findOne({ habitId, date: today });

    if (exists) {
      return res.status(400).json({ message: "Already checked today" });
    }

    const checkin = new Checkin({ habitId, date: today });
    const saved = await checkin.save();

    res.status(200).json(saved);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};