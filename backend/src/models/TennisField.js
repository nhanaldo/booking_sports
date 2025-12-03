// TennisField.js
import mongoose from "mongoose";

const tennisFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "Khu thể thao trung tâm" },
}, { timestamps: true });

export default mongoose.model("TennisField", tennisFieldSchema);
