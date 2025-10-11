// ✅ backend/src/routes/sports.js
import express from "express";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";

const router = express.Router();

/* ======================== BÓNG ĐÁ ======================== */
router.get("/football", async (req, res) => {
  try {
    const fields = await FootballField.find();
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sân bóng đá" });
  }
});

/* ======================== BÓNG RỔ ======================== */
router.get("/basketball", async (req, res) => {
  try {
    const fields = await BasketballField.find();
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sân bóng rổ" });
  }
});

/* ======================== TENNIS ======================== */
router.get("/tennis", async (req, res) => {
  try {
    const fields = await TennisField.find();
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sân tennis" });
  }
});

export default router;
