import mongoose from "mongoose";

const loyaltyPointSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true, default: "Khách hàng" },
  totalBookings: { type: Number, default: 0 },
  rewardPoints: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("LoyaltyPoint", loyaltyPointSchema);
