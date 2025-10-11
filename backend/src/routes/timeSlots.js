import express from "express";
import FootballTimeSlot from "../models/FootballTimeSlot.js";
import BasketballTimeSlot from "../models/BasketballTimeSlot.js";
import TennisTimeSlot from "../models/TennisTimeSlot.js";

const router = express.Router();

// 🟢 API: GET /timeslots/:sportType
router.get("/:sportType", async (req, res) => {
  try {
    const { sportType } = req.params;
    let slots = [];

    if (sportType === "bóng đá") slots = await FootballTimeSlot.find();
    else if (sportType === "bóng rổ") slots = await BasketballTimeSlot.find();
    else if (sportType === "tennis") slots = await TennisTimeSlot.find();
    else return res.status(400).json({ message: "Loại sân không hợp lệ" });

    res.json(slots);
  } catch (err) {
    console.error("Lỗi lấy time slots:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
