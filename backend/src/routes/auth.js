import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js"; 
import nodemailer from "nodemailer";

const router = express.Router();

/* ------------------- QUÊN MẬT KHẨU ------------------- */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body; //Lấy email từ req.body (client gửi JSON chứa email).
    const user = await User.findOne({ email }); //Tìm user trong DB theo email. findOne trả null nếu không tìm thấy.
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // Tạo token reset có hạn 15 phút
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://192.168.1.48:3000/reset-password/${token}`;
    //Tạo link reset (frontend) chứa token. Khi user truy cập link này, 
    // frontend có thể hiển thị form nhập mật khẩu mới và gửi token ngược lại server để reset.

    // Cấu hình transporter với Gmail (App Password)
    //Tạo transporter cho nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail của bạn
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: `"Booking App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.name},</h3>
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào link dưới đây để đặt lại (hết hạn sau 15 phút):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
    });
// Gửi email với sendMail:
// from: người gửi (có thể hiển thị tên + địa chỉ).
// to: email của user.
// subject: tiêu đề email.
// html: nội dung email (HTML). Ở đây có chèn resetLink.
// await chờ quá trình gửi hoàn tất. Nếu lỗi (ví dụ auth SMTP sai), sẽ rơi vào catch.

    res.json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (err) {
    console.error("Lỗi gửi email:", err);
    res.status(500).json({ message: "Lỗi server khi gửi email" });
  }
});

/* ------------------- RESET MẬT KHẨU ------------------- */
router.post("/reset-password/:token", async (req, res) => {
  // token ở đây là req.params.token
  try {
    const { token } = req.params;
    const { password } = req.body;
    // từ URL params và password mới từ body.

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//Nếu token hết hạn hoặc không hợp lệ thì jwt.verify sẽ ném lỗi và rơi vào catch.
    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashed });
//Dùng decoded.id (payload khi tạo token) để tìm user và cập nhật password thành hashed.

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("Lỗi reset mật khẩu:", err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
});

/* ------------------- ĐĂNG KÝ ------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    //Lấy name, email, password, phone từ request body.

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    //Kiểm tra xem email đã có tài khoản chưa

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      phone,
      role: "user", // mặc định user
    }); // chuẩn bị giữ liệu 
    await user.save(); // đẩy lên monggo

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ------------------- ĐĂNG NHẬP ------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); //Tìm user theo email.
    if (!user)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
      //Payload: { id: user._id, role: user.role } : lưu id và role 
    });
    res.json({ // trả về phản hồi cho client  
// role: role của user (mục tiện lợi để client render UI ngay lập tức).
// user: một object chứa thông tin người dùng quan trọng nhưng không có password. 
// Thường trả các trường không nhạy cảm (id, name, email, role).
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    //Tạo JWT token sau khi người dùng đăng nhập thành công.
    //Token này chứa thông tin quan trọng (id, role) để xác thực và phân quyền
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ------------------- VERIFY TOKEN ------------------- */
router.get("/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name role email phone");
    if (!user) return res.status(401).json({ message: "Token không hợp lệ" });

    res.json({ role: user.role, user });
  } catch (err) {
    console.error("Lỗi verify:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// Khi client đã có token (sau khi login), client có thể gọi /verify để:

// Xác nhận token đó hợp lệ (chưa hết hạn, chữ ký đúng).

// Lấy lại thông tin user (name, email, role, phone) từ database.

//Giúp frontend (React, Vue, Angular…) biết user hiện tại là ai, có quyền gì → dùng để hiển thị UI (ví dụ: nếu role = admin thì hiện thêm menu quản trị).

export default router;
