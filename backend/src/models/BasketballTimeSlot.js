import mongoose from "mongoose";

const basketballTimeSlotSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: "BasketballField", required: true }, 
   start: { type: String, required: true },
  end: { type: String, required: true },
  price: { type: Number, default: 300000 }, // tất cả khung giờ cùng giá
  status: { type: String, default: "available" },
}, { timestamps: true });

export default mongoose.model("BasketballTimeSlot", basketballTimeSlotSchema);
