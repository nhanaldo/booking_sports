import mongoose from "mongoose";

const tennisTimeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "booked"], default: "available" },
}, { timestamps: true });

export default mongoose.model("TennisTimeSlot", tennisTimeSlotSchema);
