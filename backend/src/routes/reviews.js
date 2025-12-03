import express from "express";
import Review from "../models/Review.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// 🟢 Thêm đánh giá
router.post("/", async (req, res) => {
  try {
    const { name, comment, rating } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
    }

    const review = await Review.create({ 
      name, 
      comment, 
      rating: Number(rating)  // ⭐ phải lưu vào DB
    });

    res.json({
      message: "Thêm đánh giá thành công",
      review
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🟣 Lấy tất cả đánh giá
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ⭐ Tính trung bình rating
router.get("/average", async (req, res) => {
  try {
    const avg = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    const average = avg[0]?.avgRating || 0;
    res.json({ average: Number(average.toFixed(1)) }); // vd: 4.3 ⭐
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});



router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền xóa đánh giá." });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa đánh giá." });

  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa đánh giá", error: err.message });
  }
});

export default router;
