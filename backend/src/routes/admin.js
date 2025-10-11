import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

/* -------------------- QUẢN LÝ BOOKING -------------------- */

// 🟢 Lấy toàn bộ danh sách đặt sân (admin xem được tất cả)
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

export default router;
