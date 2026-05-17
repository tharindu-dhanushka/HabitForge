import express from "express";

import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit
} from "../../controller/habitController.js";

import { checkinHabit } from "../../controller/checkinController.js";

const route = express.Router();

route.post("/create", createHabit);
route.get("/getall", getHabits);
route.put("/update/:id", updateHabit);
route.delete("/delete/:id", deleteHabit);

// EXTRA
route.post("/checkin/:id", checkinHabit);

export default route;