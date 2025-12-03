import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: false },
  orderId: String,
  requestId: String,
  amount: Number,
  transId: String,
  resultCode: Number,
  message: String,
  extraData: Object,
  sport_type: { type: String, required: false }, // ✅ thêm loại sân
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", PaymentSchema);
