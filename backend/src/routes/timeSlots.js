import express from "express";
import FootballTimeSlot from "../models/FootballTimeSlot.js";
import BasketballTimeSlot from "../models/BasketballTimeSlot.js";
import TennisTimeSlot from "../models/TennisTimeSlot.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * 🟢 GET /api/timeslots/:sportType
 * → Lấy danh sách khung giờ theo loại sân
 */
router.get("/:sportType", async (req, res) => {
  try {
    const { sportType } = req.params;
    let slots = [];

    switch (sportType) {
      case "football":
        slots = await FootballTimeSlot.find().sort({ start: 1 });
        break;
      case "basketball":
        slots = await BasketballTimeSlot.find().sort({ start: 1 });
        break;
      case "tennis":
        slots = await TennisTimeSlot.find().sort({ start: 1 });
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    res.json(slots);
  } catch (err) {
    console.error("❌ Lỗi lấy time slots:", err);
    res.status(500).json({ message: "Lỗi server khi lấy khung giờ" });
  }
});

/**
 * 🟡 POST /api/timeslots/:sportType
 * → Thêm khung giờ mới cho từng loại sân
 */
router.post("/:sportType", auth, async (req, res) => {
  try {
    const { sportType } = req.params;
    const { start, end, price } = req.body;

    // ❌ Sai ở bản trước: dùng newSlot khi chưa khai báo
    if (!start || !end || !price) {
      return res
        .status(400)
        .json({ message: "⚠️ Thiếu thông tin start, end hoặc price" });
    }

    console.log("🟡 Dữ liệu nhận được từ client:", { start, end, price });

    // ✅ Chọn model đúng
    let TimeSlotModel;
    switch (sportType) {
      case "football":
        TimeSlotModel = FootballTimeSlot;
        break;
      case "basketball":
        TimeSlotModel = BasketballTimeSlot;
        break;
      case "tennis":
        TimeSlotModel = TennisTimeSlot;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    // ✅ Tạo và ép kiểu chắc chắn
    const newSlot = new TimeSlotModel({
      start,
      end,
      price: Number(price), // 🔥 ép kiểu số tại đây
    });

    await newSlot.save();

    console.log("✅ Đã lưu khung giờ mới:", newSlot);
    res.status(201).json(newSlot);
  } catch (err) {
    console.error("❌ Lỗi thêm time slot:", err);
    res.status(500).json({ message: "Lỗi server khi thêm khung giờ" });
  }
});

router.get("/:sportType/:id", async (req, res) => {
  try {
    const { sportType, id } = req.params;
    let TimeSlotModel;

    switch (sportType) {
      case "football":
        TimeSlotModel = FootballTimeSlot;
        break;
      case "basketball":
        TimeSlotModel = BasketballTimeSlot;
        break;
      case "tennis":
        TimeSlotModel = TennisTimeSlot;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    const slot = await TimeSlotModel.findById(id);
    if (!slot) {
      return res.status(404).json({ message: "❌ Không tìm thấy khung giờ" });
    }

    res.json(slot);
  } catch (err) {
    console.error("❌ Lỗi lấy khung giờ:", err);
    res.status(500).json({ message: "Lỗi server khi lấy khung giờ" });
  }
});


router.put("/:sportType/:id", auth, async (req, res) => {
  try {
    const { sportType, id } = req.params;
    const { start, end, price } = req.body;

    let TimeSlotModel;
    switch (sportType) {
      case "football":
        TimeSlotModel = FootballTimeSlot;
        break;
      case "basketball":
        TimeSlotModel = BasketballTimeSlot;
        break;
      case "tennis":
        TimeSlotModel = TennisTimeSlot;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    const updated = await TimeSlotModel.findByIdAndUpdate(
      id,
      { start, end, price },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "❌ Không tìm thấy khung giờ" });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Lỗi cập nhật time slot:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật khung giờ" });
  }
});

router.delete("/:sportType/:id", auth, async (req, res) => {
  let Model;
  const { sportType, id } = req.params;

  if (sportType === "football") Model = FootballTimeSlot;
  else if (sportType === "basketball") Model = BasketballTimeSlot;
  else if (sportType === "tennis") Model = TennisTimeSlot;
  else return res.status(400).json({ message: "Loại sân không hợp lệ" });

  const deleted = await Model.findByIdAndDelete(id);
  if (!deleted)
    return res.status(404).json({ message: "Không tìm thấy khung giờ để xóa" });

  res.json({ message: "🗑️ Xóa khung giờ thành công" });
});
export default router;
