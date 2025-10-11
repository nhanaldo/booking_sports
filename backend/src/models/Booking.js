import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    field_id: String,
    sport_type: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    booking_date: Date,
    time_slot: String,
    status: { type: String, default: "booked" }, // 🟢 thêm dòng này
    field_name: { type: String, default: "" },
    field_price: { type: Number, default: null },
    field_location: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
