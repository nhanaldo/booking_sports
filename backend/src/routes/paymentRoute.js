import express from "express";
import crypto from "crypto";
import axios from "axios";
import Payment from "../models/Payment.js";

const router = express.Router();

/**
 * 🟣 [POST] /api/payment/momo
 * Gửi yêu cầu thanh toán tới MoMo
 */
router.post("/momo", async (req, res) => {
  try {
    const { amount, orderInfo, sport_type } = req.body;

    // Lấy thông tin cấu hình từ .env
    const endpoint = process.env.MOMO_ENDPOINT;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;

    // Sinh orderId & requestId duy nhất
    const orderId = partnerCode + Date.now();
    const requestId = orderId;

    const redirectUrl = "http://localhost:5173/payment-success";
    const ipnUrl = "https://your-ngrok-or-localtunnel-domain/api/payment/momo/ipn"; // ✅ Sửa lại cho đúng domain của bạn

    // Tạo chữ ký (signature) theo yêu cầu MoMo
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=captureWallet`;

    const signature = crypto.createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData: "",
      requestType: "captureWallet",
      signature,
      lang: "vi",
    };

    const response = await axios.post(endpoint, requestBody);
    console.log("✅ MoMo Response:", response.data);

    // ✅ Lưu tạm thông tin giao dịch
    await Payment.create({
      orderId,
      requestId,
      amount,
      message: "Initialized",
      resultCode: 0,
      sport_type, 
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Lỗi khi tạo thanh toán MoMo:", error.response?.data || error.message);
    res.status(500).json({ message: "Lỗi khi tạo thanh toán MoMo" });
  }
});

/**
 * 🟢 [POST] /api/payment/momo/ipn
 * MoMo callback về khi thanh toán xong
 */
router.post("/momo/ipn", async (req, res) => {
  try {
    console.log("📩 Nhận callback từ MoMo:", req.body);

    const {
      orderId,
      requestId,
      amount,
      resultCode,
      message,
      transId,
      extraData,
    } = req.body;

    await Payment.findOneAndUpdate(
      { orderId },
      {
        transId,
        resultCode,
        message,
        extraData,
      },
      { new: true }
    );

    res.sendStatus(204); // MoMo yêu cầu trả về 204
  } catch (err) {
    console.error("❌ Lỗi xử lý IPN:", err);
    res.status(500).json({ message: "Lỗi xử lý IPN" });
  }
});

export default router;
