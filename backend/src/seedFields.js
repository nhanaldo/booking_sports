import mongoose from "mongoose";
import dotenv from "dotenv";
import FootballField from "./models/FootballField.js";
import BasketballField from "./models/BasketballField.js";
import TennisField from "./models/TennisField.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sports_booking";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Đã kết nối MongoDB");

    // 🏟️ Xóa dữ liệu cũ
    await FootballField.deleteMany();
    await BasketballField.deleteMany();
    await TennisField.deleteMany();

    // ⚽ Dữ liệu sân bóng đá
    const footballs = [
      { name: "Sân 7A", size: "7 người", price: 250000, location: "Khu A" },
      { name: "Sân 7B", size: "7 người", price: 250000, location: "Khu A" },
      { name: "Sân 7C", size: "7 người", price: 250000, location: "Khu A" },
      { name: "Sân 7D", size: "7 người", price: 250000, location: "Khu A" },
      { name: "Sân 5-1", size: "5 người", price: 180000, location: "Khu B" },
      { name: "Sân 5-2", size: "5 người", price: 180000, location: "Khu B" },
    ];

    // 🏀 Dữ liệu sân bóng rổ
    const basketballs = [
      { name: "Sân A1", price: 300000, location: "Khu C" },
      { name: "Sân A2", price: 300000, location: "Khu C" },
    ];

    // 🎾 Dữ liệu sân tennis
    const tennis = [
      { name: "Sân A1", price: 200000, location: "Khu D" },
      { name: "Sân A2", price: 200000, location: "Khu D" },
      { name: "Sân A3", price: 200000, location: "Khu D" },
      { name: "Sân A4", price: 200000, location: "Khu D" },
    ];

    // ✅ Lưu vào MongoDB
    await FootballField.insertMany(footballs);
    await BasketballField.insertMany(basketballs);
    await TennisField.insertMany(tennis);

    console.log("🎉 Dữ liệu sân đã được thêm thành công!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed dữ liệu:", err);
    process.exit(1);
  }
};

seed();
