import mongoose from "mongoose";

const footballTimeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },   // ví dụ "18:00"
  end: { type: String, required: true },     // ví dụ "19:00"
  price: { type: Number, required: true },   // giá riêng cho mỗi giờ
  status: { type: String, default: "available" }, // "available" | "booked"
}, { timestamps: true });

export default mongoose.model("FootballTimeSlot", footballTimeSlotSchema);
