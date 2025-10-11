import express from "express";
import Field from "../models/Field.js";

const router = express.Router();

// 👉 Lấy danh sách sân
router.get("/", async (req, res) => {
  try {
    const fields = await Field.find();
    res.json(fields);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// 👉 Lấy chi tiết 1 sân
router.get("/:id", async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });
    res.json(field);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});



export default router;
