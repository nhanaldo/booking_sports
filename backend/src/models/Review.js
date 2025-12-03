import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // ⭐ thêm vào
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
