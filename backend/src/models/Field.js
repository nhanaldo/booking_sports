import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["Bóng đá", "Bóng rổ", "Tennis"], 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model("Field", fieldSchema);
  