import mongoose from "mongoose";

const basketballTimeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  price: { type: Number, default: 300000 }, // tất cả khung giờ cùng giá
  status: { type: String, default: "available" },
}, { timestamps: true });

export default mongoose.model("BasketballTimeSlot", basketballTimeSlotSchema);
