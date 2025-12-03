import { useEffect, useState } from "react";
import API from "../api";
import "./AdminReviews.css";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    const res = await API.get("/reviews");
    setReviews(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteReview = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    await API.delete(`/reviews/${id}`);
    fetchData();
  };

  return (
    <div className="admin-reviews-page">
  <h2>⭐ Quản lý đánh giá</h2>

  <div className="reviews-list">
    {reviews.map(r => (
      <div key={r._id} className="review-item">

        <h4>{r.name}</h4>

        {/* ⭐ Thời gian đánh giá */}
        <div className="review-date">
          {new Date(r.createdAt).toLocaleString("vi-VN")}
        </div>

        <p>{r.comment}</p>
        <span>{r.rating} ⭐</span>

        <button className="delete-btn" onClick={() => deleteReview(r._id)}>
          ❌ Xóa
        </button>
      </div>
    ))}
  </div>
</div>

  );
}
