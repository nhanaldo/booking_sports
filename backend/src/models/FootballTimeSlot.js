import mongoose from "mongoose";

const footballTimeSlotSchema = new mongoose.Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FootballField",
    required: true
  },
  start: { type: String, required: true },
  end: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "available" }
}, { timestamps: true });

export default mongoose.model("FootballTimeSlot", footballTimeSlotSchema);
