import express from "express";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";

const router = express.Router();

// lấy tất cả sân theo loại
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    let fields = [];

    if (type === "football") fields = await FootballField.find();
    else if (type === "basketball") fields = await BasketballField.find();
    else if (type === "tennis") fields = await TennisField.find();
    else return res.status(400).json({ message: "Loại sân không hợp lệ" });

    res.json(fields);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// lấy sân cụ thể theo ID và loại
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    let field;

    if (type === "football") field = await FootballField.findById(id);
    else if (type === "basketball") field = await BasketballField.findById(id);
    else if (type === "tennis") field = await TennisField.findById(id);

    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });
    res.json(field);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// cập nhật sân
router.put("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    const data = req.body;
    let updated;

    if (type === "football") updated = await FootballField.findByIdAndUpdate(id, data, { new: true });
    else if (type === "basketball") updated = await BasketballField.findByIdAndUpdate(id, data, { new: true });
    else if (type === "tennis") updated = await TennisField.findByIdAndUpdate(id, data, { new: true });

    if (!updated) return res.status(404).json({ message: "Không tìm thấy sân" });
    res.json({ message: "Cập nhật thành công", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
