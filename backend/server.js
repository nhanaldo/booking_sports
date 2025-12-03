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
import adminFields from "./src/routes/adminFields.js";
import paymentRoute from "./src/routes/paymentRoute.js";
import promotionRoutes from "./src/routes/promotionRoutes.js";
 // 👉 Giữ file này
import http from "http";
import { Server } from "socket.io";
import reviewRoutes from "./src/routes/reviews.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// ⚡ Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
  pingTimeout: 60000,
  pingInterval: 25000,
});
global._io = io;

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

// ⚡ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 👉 Tạo admin mặc định
    const adminEmail = "admin@example.com";
    const exist = await User.findOne({ email: adminEmail });

    if (!exist) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        phone: "0123456789",
        role: "admin",
      });
      console.log("✅ Default Admin Created");
    }
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// ⚡ Routes
app.get("/", (req, res) => res.send("API Running..."));
app.use("/api", sportsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/timeslots", timeSlotRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/fields", adminFields);  
app.use("/api/payment", paymentRoute);
app.use("/api/promotions", promotionRoutes); // 👉 Chỉ để 1 lần duy nhất
app.use("/api/reviews", reviewRoutes);


// ⚡ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`⚡ Server + Socket running on port ${PORT}`)
);
