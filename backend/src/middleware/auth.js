import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token, từ chối truy cập" });
  }

  try {
    // ✅ Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Tìm người dùng thật trong DB
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // ✅ Gắn thông tin người dùng vào request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực:", err);
    res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
}
