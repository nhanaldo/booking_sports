import mongoose from "mongoose";

const tennisTimeSlotSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: "TennisField", required: true }, 
  start: { type: String, required: true },
  end: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "booked"], default: "available" },
}, { timestamps: true });

export default mongoose.model("TennisTimeSlot", tennisTimeSlotSchema);
