import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import sportsRoutes from "./src/routes/sports.js";
import authRoutes from "./src/routes/auth.js";
import fieldRoutes from "./src/routes/fields.js";
import bookingRoutes from "./src/routes/bookings.js";
import adminRoutes from "./src/routes/admin.js";
import User from "./src/models/User.js";
import timeSlotRoutes from "./src/routes/timeSlots.js";


dotenv.config();//load các biến từ file .env.
const app = express();

app.use(cors());
app.use(express.json()); // app.use(express.json()) → cho phép nhận JSON trong request body.
app.use("/api", sportsRoutes);
app.use("/api/timeslots", timeSlotRoutes);

// ✅ Kết nối MongoDB + tạo admin mặc định
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 👉 Tạo admin mặc định nếu chưa có
    const adminEmail = "admin@example.com";
    const exist = await User.findOne({ email: adminEmail });

    if (!exist) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        phone: "0123456789",
        role: "admin"
      });
      console.log("✅ Admin user created (email: admin@example.com / pass: 123456)");
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => res.send("API Running..."));
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
