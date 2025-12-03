import express from "express";
import Promotion from "../models/Promotion.js";

const router = express.Router();

/* -------------------- 🟢 LẤY DANH SÁCH -------------------- */
router.get("/", async (req, res) => {
  try {
    const list = await Promotion.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", details: err });
  }
});

/* -------------------- 🟣 LẤY CHI TIẾT -------------------- */
router.get("/:id", async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* -------------------- 🟤 TẠO KHUYẾN MÃI (ADMIN) -------------------- */
router.post("/", async (req, res) => {
  try {
    const newPromo = await Promotion.create(req.body);
    res.json({ message: "Tạo khuyến mãi thành công", data: newPromo });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo", error: err.message });
  }
});

/* -------------------- 🔵 CẬP NHẬT -------------------- */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Cập nhật thành công", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: err.message });
  }
});

/* -------------------- 🔴 XÓA -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa khuyến mãi" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa" });
  }
});

export default router;
