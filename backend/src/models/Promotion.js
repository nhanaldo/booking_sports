import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: String,
    image: String,

    discountType: { 
      type: String, 
      enum: ["percent", "fixed", "none"], 
      default: "none" 
    },

    discountValue: { type: Number, default: 0 },

    minBookings: { type: Number, default: 0, min: 0 },
    minPoints:   { type: Number, default: 0, min: 0 },   // ⭐ THÊM DÒNG NÀY

    fields: [String], 

    validFrom: Date,
    validTo: Date,

    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Promotion", promotionSchema);
