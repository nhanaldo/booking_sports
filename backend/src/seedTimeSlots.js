import mongoose from "mongoose";
import dotenv from "dotenv";
import FootballTimeSlot from "./models/FootballTimeSlot.js";
import BasketballTimeSlot from "./models/BasketballTimeSlot.js";
import TennisTimeSlot from "./models/TennisTimeSlot.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sports_booking";

const seedTimeSlots = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Đã kết nối MongoDB");

        // Xóa dữ liệu cũ
        await FootballTimeSlot.deleteMany();
        await BasketballTimeSlot.deleteMany();
        await TennisTimeSlot.deleteMany();

        // ⚽ Bóng đá (giờ khác nhau, giá khác nhau)
        // ⚽ Bóng đá (giờ khác nhau, giá khác nhau)
        const footballSlots = [
            { start: "17:00", end: "18:00", price: 200000 },
            { start: "18:00", end: "19:00", price: 300000 },
            { start: "19:00", end: "20:00", price: 250000 },
        ];


        // 🏀 Bóng rổ (giờ nào cũng giá 150000)
        const basketballSlots = [
            { start: "17:00", end: "18:00", price: 150000 },
            { start: "18:00", end: "19:00", price: 150000 },
            { start: "19:00", end: "20:00", price: 150000 },
        ];




        // 🎾 Tennis (giờ nào cũng giá 100000)
        const tennisSlots = [
            { start: "17:00", end: "18:00", price: 100000 },
            { start: "18:00", end: "19:00", price: 100000 },
            { start: "19:00", end: "20:00", price: 100000 },
        ];
        // Thêm vào MongoDB
        await FootballTimeSlot.insertMany(footballSlots);
        await BasketballTimeSlot.insertMany(basketballSlots);
        await TennisTimeSlot.insertMany(tennisSlots);
        console.log("🎉 Dữ liệu time slots cho cả 3 môn đã được thêm thành công!");
        process.exit();
    } catch (err) {
        console.error("❌ Lỗi khi seed time slots:", err);
        process.exit(1);
    }
};

seedTimeSlots();
