import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // ⭐ dynamic reference
  field_id: { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  booking_date: Date,
  time_slot: String,
  status: { type: String, default: "booked" },
  field_name: String,
  field_price: Number,
  field_location: String,
  sport_type: {    // ⭐ KHÔI PHỤC LẠI
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
