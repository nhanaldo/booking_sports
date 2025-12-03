import { useEffect, useState } from "react";
import API from "../api";
import "./Reviews.css";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    const userName = localStorage.getItem("name") || "Khách";

    const loadReviews = async () => {
        try {
            const res = await API.get("/reviews");
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment) return alert("Vui lòng nhập nội dung đánh giá");
        if (rating === 0) return alert("Vui lòng chọn số sao");

        try {
            await API.post("/reviews", { 
                name: userName, 
                comment,
                rating
            });

            alert("Đã gửi đánh giá!");
            setComment("");
            setRating(0);

            loadReviews();
        } catch (err) {
            console.error(err);
            alert("Lỗi gửi đánh giá");
        }
    };

    return (
        <div className="reviews-wrapper">
            
            {/* LEFT — LIST */}
            <div className="reviews-left">
                <h3 className="left-title">📌 Danh sách đánh giá</h3>

                <div className="review-list">
                    {reviews.length === 0 ? (
                        <p>Chưa có đánh giá nào.</p>
                    ) : (
                        reviews.map((r) => (
                            <div key={r._id} className="review-item">

                                <div className="stars-display">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`star-show ${i < r.rating ? "active" : ""}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <h4>{r.name}</h4>
                                <p>{r.comment}</p>

                                <span className="date">
                                    {new Date(r.createdAt).toLocaleString("vi-VN")}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT — FORM */}
            <div className="reviews-right">
                <h2 className="review-title">🌟 Đánh giá của khách hàng</h2>

                <p><strong>Tên khách hàng:</strong> {userName}</p>

                <form className="review-form" onSubmit={handleSubmit}>
                    
                    <div className="rating-box">

                        <div className="stars-row">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <span
                                    key={value}
                                    className={`star-select ${
                                        value <= (hovered || rating) ? "active" : ""
                                    }`}
                                    onMouseEnter={() => setHovered(value)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(value)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <p className="rating-label">
                            {rating > 0 ? `Bạn chọn ${rating} sao` : "Chọn số sao"}
                        </p>
                    </div>

                    <textarea
                        placeholder="Viết đánh giá..."
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button type="submit">Gửi đánh giá</button>
                </form>
            </div>
        </div>
    );
}
