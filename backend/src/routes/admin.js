import express from "express";
import Booking from "../models/Booking.js";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";
import auth from "../middleware/auth.js";
import FootballTimeSlot from "../models/FootballTimeSlot.js";
import User from "../models/User.js"; 
const router = express.Router();

/* -------------------- Middleware kiểm tra quyền admin -------------------- */
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "❌ Bạn không có quyền admin" });
  }
  next();
}

router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách user:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* -------------------- QUẢN LÝ BOOKING -------------------- */

// 🟢 Lấy toàn bộ danh sách đặt sân
router.get("/bookings", auth, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách booking:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error: err.message });
  }
});

// 🔴 Xóa / hủy booking
router.delete("/bookings/:id", auth, isAdmin, async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy booking" });

    res.json({ message: "🗑️ Đã xóa đặt sân", id: deleted._id });
  } catch (err) {
    console.error("❌ Lỗi khi xóa booking:", err);
    res.status(500).json({ message: "Lỗi khi xóa booking", error: err.message });
  }
});

/* -------------------- QUẢN LÝ SÂN -------------------- */

// ✅ Lấy danh sách sân theo loại (dễ gọi hơn cho frontend)
router.get("/fields/:type", auth, isAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    let Model;

    switch (type) {
      case "football":
        Model = FootballField;
        break;
      case "basketball":
        Model = BasketballField;
        break;
      case "tennis":
        Model = TennisField;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    const fields = await Model.find().sort({ createdAt: -1 });
    res.json(fields);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách sân:", err);
    res.status(500).json({ message: "Không thể tải danh sách sân", error: err.message });
  }
});

// 🟢 Lấy chi tiết 1 sân
router.get("/fields/:type/:id", auth, isAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;

    switch (type) {
      case "football":
        Model = FootballField;
        break;
      case "basketball":
        Model = BasketballField;
        break;
      case "tennis":
        Model = TennisField;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    const field = await Model.findById(id);
    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });

    res.json(field);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin sân", error: err.message });
  }
});

// 🟡 Sửa sân
router.put("/fields/:type/:id", auth, isAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;

    switch (type) {
      case "football":
        Model = FootballField;
        break;
      case "basketball":
        Model = BasketballField;
        break;
      case "tennis":
        Model = TennisField;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    const updatedField = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedField)
      return res.status(404).json({ message: "Không tìm thấy sân để cập nhật" });

    res.json({ message: "✅ Đã cập nhật sân", field: updatedField });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật sân", error: err.message });
  }
});

// 🔴 Xóa sân
router.delete("/fields/:type/:id", auth, isAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;

    switch (type) {
      case "football":
        Model = FootballField;
        break;
      case "basketball":
        Model = BasketballField;
        break;
      case "tennis":
        Model = TennisField;
        break;
      default:
        return res.status(400).json({ message: "❌ Loại sân không hợp lệ" });
    }

    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy sân để xóa" });

    res.json({ message: "🗑️ Đã xóa sân", id: deleted._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sân", error: err.message });
  }
});

router.get("/:sportType", auth, isAdmin, async (req, res) => {
  try {
    let Model;
    if (req.params.sportType === "football") Model = FootballTimeSlot;
    else if (req.params.sportType === "basketball") Model = BasketballTimeSlot;
    else if (req.params.sportType === "tennis") Model = TennisTimeSlot;
    else return res.status(400).json({ message: "Loại sân không hợp lệ" });

    const slots = await Model.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE /admin/users/:id
router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
