import mongoose from "mongoose";

const cancelledBookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  field_id: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
  field_name: String,
  sport_type: String,
  booking_date: Date,
  time_slot: String,
  reason: { type: String, default: "Người dùng hủy đặt sân" },
  cancelled_at: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("CancelledBooking", cancelledBookingSchema);
