import mongoose from "mongoose";

const footballFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, enum: ["5 người", "7 người"], required: true },
  location: { type: String, default: "Khu thể thao trung tâm" },
}, { timestamps: true });

export default mongoose.model("FootballField", footballFieldSchema);
  