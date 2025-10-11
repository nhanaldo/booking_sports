import express from "express";
import Booking from "../models/Booking.js";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";
import auth from "../middleware/auth.js";
import CancelledBooking from "../models/CancelledBooking.js";

const router = express.Router();

/* -------------------- CREATE -------------------- */
// 🟢 Đặt sân
router.post("/", auth, async (req, res) => {
  try {
    const { field_id, booking_date, time_slot, sport_type } = req.body;

    // Xác định model theo sport_type
    let fieldModel;
    if (sport_type === "Bóng đá") fieldModel = FootballField;
    else if (sport_type === "Bóng rổ") fieldModel = BasketballField;
    else if (sport_type === "Tennis") fieldModel = TennisField;
    else return res.status(400).json({ message: "Loại sân không hợp lệ" });

    // Tìm sân theo _id
    const field = await fieldModel.findById(field_id);
    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });

    // Tạo booking mới và lưu snapshot thông tin sân
    const booking = new Booking({
      field_id,
      sport_type,
      user: req.user.id,
      booking_date: new Date(booking_date),
      time_slot,
      field_name: field.name || "",
      field_price: field.price ?? null,
      field_location: field.location || field.area || ""
    });

    await booking.save();

    // Trả về chỉ thông tin cần thiết (không trả status, booking_date)
    res.json({
      message: "✅ Đặt sân thành công",
      booking: {
        _id: booking._id,
        field_name: booking.field_name,
        field_price: booking.field_price,
        field_location: booking.field_location
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Lỗi khi đặt sân", error: err.message });
  }
});

/* -------------------- READ -------------------- */
// 🟣 Xem booking của user hiện tại (chỉ trả name, price, location, _id)
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Trả về đủ thông tin cần thiết cho frontend
    const result = bookings.map(b => ({
      _id: b._id,
      field_name: b.field_name,
      field_price: b.field_price,
      field_location: b.field_location,
      sport_type: b.sport_type,
      booking_date: b.booking_date,
      time_slot: b.time_slot,
      status: b.status || "booked",
      createdAt: b.createdAt
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách booking:", err);
    res.status(500).json({ message: "❌ Lỗi khi lấy danh sách booking", error: err.message });
  }
});

// 🟡 Xem tất cả booking (chỉ trả name, price, location, _id)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const result = bookings.map(b => ({
      _id: b._id,
      field_name: b.field_name || null,
      field_price: b.field_price || null,
      field_location: b.field_location || null
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Lỗi khi lấy tất cả booking", error: err.message });
  }
});

/* -------------------- UPDATE -------------------- */
// 🔴 Hủy đặt sân
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đặt sân" });

    // Cập nhật trạng thái hủy
    booking.status = "cancelled";
    await booking.save();

    // 📝 Lưu vào lịch sử hủy
    await CancelledBooking.create({
      user_id: booking.user, // ✅ sửa dòng này
      field_id: booking.field_id,
      field_name: booking.field_name,
      sport_type: booking.sport_type,
      booking_date: booking.booking_date,
      time_slot: booking.time_slot,
    });

    res.json({ message: "Đã hủy đặt sân và lưu lịch sử" });
  } catch (err) {
    console.error("Lỗi khi hủy sân:", err);
    res.status(500).json({ message: "Lỗi server khi hủy đặt sân" });
  }
});
// 🟠 Xem lịch sử hủy
router.get("/cancelled/history", auth, async (req, res) => {
  try {
    const history = await CancelledBooking.find({ user_id: req.user.id })
      .sort({ cancelled_at: -1 }); // sắp xếp theo thời gian mới nhất

    res.json(history);
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử hủy:", err);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử hủy" });
  }
});

router.delete("/cancelled/:id", auth, async (req, res) => {
  try {
    const deleted = await CancelledBooking.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deleted) return res.status(404).json({ message: "Không tìm thấy lịch sử hủy" });

    res.json({ message: "Đã xóa lịch sử hủy thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa lịch sử hủy:", err);
    res.status(500).json({ message: "Lỗi server khi xóa lịch sử hủy" });
  }
});

export default router;
