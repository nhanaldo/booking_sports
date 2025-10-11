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

    // 🧹 Xóa dữ liệu cũ
    await FootballField.deleteMany();
    await BasketballField.deleteMany();
    await TennisField.deleteMany();

    // ⚽ Dữ liệu sân bóng đá (mỗi sân có nhiều khung giờ & giá khác nhau)
// ⚽ Dữ liệu sân bóng đá
const footballs = [
  {
    name: "Sân 7A",
    size: "7 người",
    location: "Khu A",
    timeSlots: [
      { slot: "17:00-18:00", price: 300000 },
      { slot: "18:00-19:00", price: 250000 },
      { slot: "19:00-20:00", price: 200000 },
    ],
  },
  {
    name: "Sân 5A",
    size: "5 người",
    location: "Khu B",
    timeSlots: [
      { slot: "17:00-18:00", price: 200000 },
      { slot: "18:00-19:00", price: 180000 },
      { slot: "19:00-20:00", price: 160000 },
    ],
  },
];

// 🏀 Bóng rổ
const basketballs = [
  {
    name: "Sân R1",
    location: "Khu C",
    timeSlots: [
      { slot: "17:00-18:00", price: 250000 },
      { slot: "18:00-19:00", price: 230000 },
      { slot: "19:00-20:00", price: 210000 },
    ],
  },
];

// 🎾 Tennis
const tennis = [
  {
    name: "Sân T1",
    location: "Khu D",
    timeSlots: [
      { slot: "17:00-18:00", price: 200000 },
      { slot: "18:00-19:00", price: 190000 },
    ],
  },
];


    // ✅ Lưu vào MongoDB
    await FootballField.insertMany(footballs);
    await BasketballField.insertMany(basketballs);
    await TennisField.insertMany(tennis);

    console.log("🎉 Dữ liệu sân (có khung giờ) đã được thêm thành công!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed dữ liệu:", err);
    process.exit(1);
  }
};

seed();
