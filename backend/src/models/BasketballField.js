// BasketballField.js
import mongoose from "mongoose";

const basketballFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, default: "Khu thể thao trung tâm" },
}, { timestamps: true });

export default mongoose.model("BasketballField", basketballFieldSchema);
