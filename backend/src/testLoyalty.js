import mongoose from "mongoose";
import dotenv from "dotenv";
import LoyaltyPoint from "./models/LoyaltyPoint.js"; // đúng đường dẫn vì testLoyalty.js cùng cấp với models/

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected!");

    // Tạo bản ghi thử
    const newUser = new LoyaltyPoint({
      userId: new mongoose.Types.ObjectId(),
      userName: "Nguyen Van A",
      totalBookings: 5,
      rewardPoints: 100
    });

    await newUser.save();
    console.log("🎉 Đã thêm LoyaltyPoint mẫu thành công!");

    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Lỗi:", err));
