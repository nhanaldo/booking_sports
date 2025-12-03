import mongoose from "mongoose";
import dotenv from "dotenv";
import Promotion from "./src/models/Promotion.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedPromotions = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Đã kết nối MongoDB");

    // Xóa dữ liệu cũ
    await Promotion.deleteMany();
    console.log("🗑️ Đã xóa khuyến mãi cũ");

    // --- Danh sách khuyến mãi mẫu ---
    const promotions = [
      {
        title: "⚽ Giảm 30% khi đặt buổi sáng",
        shortDescription: "Từ 06:00 - 09:00 giảm ngay 30%",
        description: "Khuyến mãi đặc biệt buổi sáng cho sân bóng",
        image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6",
        discountType: "percent",
        discountValue: 30,
        fields: ["football"],
        validFrom: "2025-12-01",
        validTo: "2026-01-01",
        status: "active"
      },
      {
        title: "🏀 Thành viên thân thiết",
        shortDescription: "Đủ 10 lần đặt sân giảm 10%",
        description: "Khuyến mãi dành cho khách hàng thân thiết",
        discountType: "percent",
        discountValue: 10,
        minBookings: 10, // đặt 10 lần mới được giảm
        fields: ["football", "basketball", "tennis"],
        validFrom: "2025-01-01",
        validTo: "2026-12-31",
        status: "active"
      },
      {
        title: "🎾 Giảm 50.000 khi đặt sân Tennis",
        shortDescription: "Giảm trực tiếp 50.000",
        description: "Khuyến mãi giảm giá cố định",
        discountType: "fixed",
        discountValue: 50000,
        fields: ["tennis"],
        validFrom: "2025-11-01",
        validTo: "2025-12-31",
        status: "active"
      }
    ];

    // Insert vào DB
    await Promotion.insertMany(promotions);
    console.log("🎉 Đã thêm khuyến mãi mẫu thành công!");

    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed promotions:", err);
    process.exit(1);
  }
};

seedPromotions();
