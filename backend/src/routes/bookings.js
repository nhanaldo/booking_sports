import express from "express";
import Booking from "../models/Booking.js";
import FootballField from "../models/FootballField.js";
import BasketballField from "../models/BasketballField.js";
import TennisField from "../models/TennisField.js";
import FootballTimeSlot from "../models/FootballTimeSlot.js";
import BasketballTimeSlot from "../models/BasketballTimeSlot.js";
import TennisTimeSlot from "../models/TennisTimeSlot.js";
import CancelledBooking from "../models/CancelledBooking.js";
import LoyaltyPoint from "../models/LoyaltyPoint.js";
import auth from "../middleware/auth.js";
import { sendBookingEmail } from "../utils/sendBookingEmail.js";
import Promotion from "../models/Promotion.js";

const router = express.Router();


/* -------------------- 🟢 ĐẶT SÂN -------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const { field_id, booking_date, time_slot, sport_type, usedVoucher, final_price } = req.body;

    // 🏟️ Xác định model sân & model khung giờ
    let fieldModel, timeSlotModel;
    if (sport_type === "Bóng đá") {
      fieldModel = FootballField;
      timeSlotModel = FootballTimeSlot;
    } else if (sport_type === "Bóng rổ") {
      fieldModel = BasketballField;
      timeSlotModel = BasketballTimeSlot;
    } else if (sport_type === "Tennis") {
      fieldModel = TennisField;
      timeSlotModel = TennisTimeSlot;
    }

    // 🔍 Tìm sân
    const field = await fieldModel.findById(field_id);
    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });

    // ⏱️ Chuẩn hóa ngày
    const normalizedDate = new Date(booking_date);
    normalizedDate.setHours(0, 0, 0, 0);

    // 🚫 Kiểm tra trùng lịch
    const exists = await Booking.findOne({
      field_id,
      booking_date: normalizedDate,
      time_slot,
      status: { $ne: "cancelled" },
    });
    if (exists) {
      return res.status(400).json({ message: "⚠️ Khung giờ này đã được đặt." });
    }

    // 💰 Tìm giá sân
    const [start, end] = time_slot.split("-").map((s) => s.trim());
    const slot = await timeSlotModel.findOne({ start, end });

    // 📌 Tạo booking
    const booking = await Booking.create({
      user: req.user.id,
      field_id,
      sport_type,
      booking_date: normalizedDate,
      time_slot,
      field_name: field.name,
      field_price: final_price ?? (slot?.price ?? field.price ?? 0),
      field_location: field.location || field.area,
      status: "booked",
    });
    /* 🔔 GỬI REALTIME CHO TẤT CẢ CLIENT */
    global._io.emit("slotBooked", {
      field_id,
      date: booking_date,
      slot: time_slot,
    });



    /* -------------------- 🎁 LOYALTY -------------------- */
    let loyalty = await LoyaltyPoint.findOne({ userId: req.user.id });

    if (!loyalty) {
      loyalty = new LoyaltyPoint({
        userId: req.user.id,
        userName: req.user.name,
        totalBookings: 0,
        rewardPoints: 0,
      });
    }

    if (usedVoucher === 1) {
      // 🎉 Dùng voucher thân thiết → reset tích điểm
      loyalty.totalBookings = 1;
      loyalty.rewardPoints = 0;
    } else {
      // ➕ Không dùng voucher → tích điểm như bình thường
      loyalty.totalBookings += 1;
      loyalty.rewardPoints += 20;
    }

    loyalty.lastUpdated = new Date();
    await loyalty.save();

    /* ----------------------------------------------------- */
    await sendBookingEmail({
      email: req.user.email,
      field_name: booking.field_name,
      field_location: booking.field_location,
      date: booking.booking_date,
      slot: booking.time_slot,
      price: booking.field_price
    });


    res.json({
      message: "✅ Đặt sân thành công!",
      booking,
      loyalty,
    });



  } catch (err) {
    console.error("❌ Lỗi khi đặt sân:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* -------------------- 🟣 XEM BOOKING CỦA USER -------------------- */
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });

    const result = bookings.map((b) => ({
      _id: b._id,
      field_name: b.field_name,
      field_price: b.field_price,
      field_location: b.field_location,
      sport_type: b.sport_type,
      booking_date: b.booking_date,
      time_slot: b.time_slot,
      status: b.status || "booked",
      createdAt: b.createdAt,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách booking:", err);
    res.status(500).json({ message: "❌ Lỗi khi lấy danh sách booking", error: err.message });
  }
});

/* -------------------- 🟡 XEM TẤT CẢ BOOKING -------------------- */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ booking_date: -1 });

    const result = bookings.map(b => ({
      _id: b._id,
      field_name: b.field_name,
      field_price: b.field_price,
      field_location: b.field_location,
      booking_date: b.booking_date,
      time_slot: b.time_slot,
      sport_type: { type: String, required: true },   // ⭐ THÊM DÒNG NÀY
      status: b.status,
      createdAt: b.createdAt
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy tất cả booking:", err);
    res.status(500).json({ message: "❌ Lỗi khi lấy tất cả booking", error: err.message });
  }
});


/* -------------------- 🔴 HỦY ĐẶT SÂN -------------------- */
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đặt sân" });

    booking.status = "cancelled";
    await booking.save();

    // 📝 Lưu lịch sử hủy
    await CancelledBooking.create({
      user_id: booking.user,
      field_id: booking.field_id,
      field_name: booking.field_name,
      sport_type: booking.sport_type,
      booking_date: booking.booking_date,
      time_slot: booking.time_slot,
    });

    res.json({ message: "✅ Đã hủy đặt sân và lưu lịch sử" });
  } catch (err) {
    console.error("Lỗi khi hủy sân:", err);
    res.status(500).json({ message: "Lỗi server khi hủy đặt sân", error: err.message });
  }
});

/* -------------------- 🟠 XEM LỊCH SỬ HỦY -------------------- */
router.get("/cancelled/history", auth, async (req, res) => {
  try {
    let history;
    if (req.user.role === "admin") {
      history = await CancelledBooking.find()
        .populate("user_id", "name email")
        .sort({ cancelled_at: -1 });
    } else {
      history = await CancelledBooking.find({ user_id: req.user.id }).sort({ cancelled_at: -1 });
    }
    res.json(history);
  } catch (err) {
    console.error("❌ Lỗi khi tải lịch sử hủy sân:", err);
    res.status(500).json({ message: "Lỗi server khi tải lịch sử hủy sân", error: err.message });
  }
});

/* -------------------- 🗑️ XÓA LỊCH SỬ HỦY -------------------- */
router.delete("/cancelled/:id", auth, async (req, res) => {
  try {
    const deleted = await CancelledBooking.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy lịch sử hủy" });
    res.json({ message: "✅ Đã xóa lịch sử hủy thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa lịch sử hủy:", err);
    res.status(500).json({ message: "Lỗi server khi xóa lịch sử hủy", error: err.message });
  }
});

/* -------------------- 🟢 LẤY KHUNG GIỜ ĐÃ ĐẶT -------------------- */
router.get("/booked-slots/:fieldId/:date", async (req, res) => {
  try {
    const { fieldId, date } = req.params;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      field_id: fieldId,
      booking_date: { $gte: startOfDay, $lte: endOfDay },
      status: "booked",
    });

    const bookedSlots = bookings.map((b) => b.time_slot);
    res.json(bookedSlots);
  } catch (err) {
    console.error("Lỗi lấy booked slots:", err);
    res.status(500).json({ message: "Lỗi server khi lấy booked slots", error: err.message });
  }
});


/* -------------------- 🎁 API LẤY VOUCHER KHÔNG CẦN ĐIỀU KIỆN NGÀY -------------------- */
router.get("/vouchers/available", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const loyalty = await LoyaltyPoint.findOne({ userId });

    const totalBookings = loyalty?.totalBookings || 0;
    const totalPoints = loyalty?.rewardPoints || 0;

    // 🔥 Lấy TẤT CẢ voucher đang active — KHÔNG kiểm tra validFrom / validTo
    const promotions = await Promotion.find({
      status: "active"
    });

    // 🟢 Đánh dấu voucher nào đủ điều kiện để áp dụng
    const vouchers = promotions.map(promo => {
      let eligible = true;

      if (promo.minBookings && totalBookings < promo.minBookings) {
        eligible = false;
      }

      if (promo.minPoints && totalPoints < promo.minPoints) {
        eligible = false;
      }

      return {
        ...promo._doc,
        eligible
      };
    });

    res.json({
      totalBookings,
      totalPoints,
      vouchers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
