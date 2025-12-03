import nodemailer from "nodemailer";

export async function sendBookingEmail({ email, field_name, field_location, date, slot, price }) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: `"SportField Booking" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🎉 Đặt sân thành công!",
            html: `
        <h2>🎉 Đặt sân thành công!</h2>

        <p><strong>Sân:</strong> ${field_name}</p>
        <p><strong>Khu:</strong> ${field_location}</p>
        <p><strong>Ngày:</strong> ${date ? new Date(date).toLocaleDateString("vi-VN") : "Không xác định"}</p>
        <p><strong>Khung giờ:</strong> ${slot}</p>
        <p><strong>Giá:</strong> ${price ? price.toLocaleString() : "0"}đ</p>

        <br/>
        <p>Cảm ơn bạn đã sử dụng hệ thống! ⚽</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email gửi thành công!");

    } catch (err) {
        console.error("❌ Lỗi gửi email:", err.message);
        console.error("Chi tiết:", err);
    }
}
