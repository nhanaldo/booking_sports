import express from "express";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";

const router = express.Router();

// 👉 Lấy danh sách tất cả sân (gộp 3 loại)
router.get("/", async (req, res) => {
  try {
    const football = await FootballField.find();
    const basketball = await BasketballField.find();
    const tennis = await TennisField.find();

    // Gộp tất cả lại với thêm loại sân
    const allFields = [
      ...football.map(f => ({ ...f._doc, type: "Bóng đá" })),
      ...basketball.map(f => ({ ...f._doc, type: "Bóng rổ" })),
      ...tennis.map(f => ({ ...f._doc, type: "Tennis" })),
    ];

    res.json(allFields);
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi khi lấy danh sách sân", error: err.message });
  }
});

// 👉 Lấy chi tiết 1 sân theo ID (tự động tìm trong 3 model)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let field =
      (await FootballField.findById(id)) ||
      (await BasketballField.findById(id)) ||
      (await TennisField.findById(id));

    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });

    // Thêm loại sân vào kết quả trả về
    let sport_type = "Không xác định";
    if (field instanceof FootballField) sport_type = "Bóng đá";
    else if (field instanceof BasketballField) sport_type = "Bóng rổ";
    else if (field instanceof TennisField) sport_type = "Tennis";

    res.json({
      field_name: field.name,
      field_location: field.location || field.area || "",
      sport_type,
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi khi lấy chi tiết sân", error: err.message });
  }
});

export default router;
