import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Promotions.css";

export default function Promotions() {
  const role = localStorage.getItem("role"); 
  const [promotions, setPromotions] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await API.get("/promotions");
        setPromotions(res.data);
      } catch (err) {
        console.error("Lỗi:", err);
      }
    };

    fetchPromos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa chương trình khuyến mãi này?"))
      return;

    try {
      await API.delete(`/promotions/${id}`);
      setPromotions(promotions.filter((p) => p._id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("Không thể xóa!");
    }
  };

  return (
    <div className="promo-page">
      <div className="promo-header">
        <h2 className="promo-title">
          {role === "admin" ? "⚙️ Quản lý khuyến mãi" : "🎉 Ưu Đãi Đặc Biệt"}
        </h2>

        <p className="promo-sub">
          {role === "admin"
            ? "Thêm – sửa – xóa chương trình khuyến mãi"
            : "Nhanh tay đặt sân – nhận ưu đãi cực hấp dẫn!"}
        </p>

        {role === "admin" && (
          <button
            className="promo-add-btn"
            onClick={() => nav("/promotions/add")}
          >
            ➕ Thêm khuyến mãi mới
          </button>
        )}
      </div>

      <div className="promo-list">
        {promotions.map((p) => (
          <div key={p._id} className="promo-card-small">
            {/* Ảnh */}
            <div className="promo-img-box">
              <img src={p.image} alt={p.title} />
            </div>

            {/* Nội dung */}
            <div className="promo-small-info">
              <h3 className="promo-small-title">{p.title}</h3>
              <p className="promo-small-desc">{p.description}</p>

              <button
                className="promo-detail-btn"
                onClick={() => setSelectedPromo(p)}
              >
                Xem chi tiết
              </button>

              {role === "admin" && (
                <div className="admin-actions">
                  <button
                    className="promo-edit-btn"
                    onClick={() => nav(`/promotions/edit/${p._id}`)}
                  >
                    ✏️ Sửa
                  </button>

                  <button
                    className="promo-delete-btn"
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑 Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* -------- MODAL -------- */}
      {selectedPromo && (
        <div className="promo-modal" onClick={() => setSelectedPromo(null)}>
          <div
            className="promo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedPromo(null)}>
              ✖
            </button>

            <img src={selectedPromo.image} className="modal-img" />

            <h2>{selectedPromo.title}</h2>
            <p className="modal-desc">{selectedPromo.description}</p>

            <button className="modal-book-btn" onClick={() => nav("/fields")}>
              🔖 Đặt sân ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
