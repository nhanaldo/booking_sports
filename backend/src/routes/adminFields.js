import express from "express";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type, name, size, location } = req.body;

    let newField;

    if (type === "football") {
      if (!size) {
        return res.status(400).json({ message: "Thiếu size cho sân bóng đá" });
      }
      newField = new FootballField({ name, size, location });
    } else if (type === "basketball") {
      newField = new BasketballField({ name , location });
    } else if (type === "tennis") {
      newField = new TennisField({ name , location });
    } else {
      return res.status(400).json({ message: "Loại sân không hợp lệ" });
    }

    await newField.save();
    res.status(201).json({ message: "Thêm sân thành công", field: newField });
  } catch (err) {
    console.error("❌ Lỗi khi thêm sân:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

export default router;
