import Habit   from "../habitforge-backend/model/habitModel.js";
import Checkin from "../habitforge-backend/model/checkinModel.js";

// CREATE
export const createHabit = async (req, res) => {
  try {
    const habit = new Habit(req.body);
    const saved = await habit.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// READ  (includes checkins + todayChecked + todayCompletedAt per habit)
export const getHabits = async (req, res) => {
  try {
    const habits   = await Habit.find();
    const checkins = await Checkin.find();
    const today    = new Date().toISOString().split("T")[0];

    const habitsWithCheckins = habits.map((habit) => {
      const habitCheckins = checkins.filter(
        (ci) => ci.habitId.toString() === habit._id.toString()
      );

      // ✅ Check if there is a checkin for today in the checkins collection (handles old data better)
      const todayCheckin = habitCheckins.find((ci) => ci.date === today);
      const todayChecked = !!todayCheckin;

      return {
        ...habit.toObject(),
        checkins:         habitCheckins,
        todayChecked,
        todayCompletedAt: todayCheckin?.completedAt || habit.completedAt || null,
      };
    });

    // Return 200 + empty array (not 404) so the frontend handles it gracefully
    res.status(200).json(habitsWithCheckins);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE
export const updateHabit = async (req, res) => {
  try {
    const id = req.params.id;

    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const updated = await Habit.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE
export const deleteHabit = async (req, res) => {
  try {
    const id = req.params.id;

    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await Habit.findByIdAndDelete(id);
    res.status(200).json({ message: "Habit deleted" });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};