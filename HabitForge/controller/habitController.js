import Habit from "../model/habitModel.js";

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

// READ
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    if (habits.length === 0) {
      return res.status(404).json({ message: "No habits found" });
    }
    res.status(200).json(habits);
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