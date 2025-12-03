import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./CancelledHistory.css";

export default function CancelledBookings() {
  const [selectedType, setSelectedType] = useState(localStorage.getItem('selectedType') || 'Tất cả');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await API.get("/bookings/cancelled/history");
      setList(res.data);
    } catch (err) {
      alert("Lỗi khi tải lịch sử hủy sân");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteCancelled = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch sử này không?")) return;
    try {
      await API.delete(`/bookings/cancelled/${id}`);
      setList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Lỗi khi xóa lịch sử hủy");
      console.error(err);
    }
  };

  const formatDateTime = (dateStr, showTime = false) => {
    if (!dateStr) return "Chưa có dữ liệu";
    const d = new Date(dateStr);

    return showTime
      ? d.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
      : d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) return <p className="ch-loading">⏳ Đang tải dữ liệu...</p>;
  if (!list.length) return <p className="ch-empty">📭 Không có lịch sử hủy sân nào.</p>;

  return (
    <div className="ch-page">
      <div className="ch-container">

        

        <h2 className="ch-title">🗑️ Lịch sử hủy đặt sân</h2>

        <div className="ch-grid">
          {list.map(b => (
            <article className="ch-card" key={b._id}>
              
              <header className="ch-card-header">
                <h3>{b.field_name || "Sân thể thao"}</h3>
                <span className="ch-badge-cancel">ĐÃ HỦY</span>
              </header>

              <div className="ch-info">
                <div><strong>Loại sân:</strong> {b.sport_type}</div>
                <div><strong>Ngày chơi:</strong> {formatDateTime(b.booking_date)} ({b.time_slot})</div>
                <div><strong>Thời gian hủy:</strong> {formatDateTime(b.cancelled_at, true)}</div>
              </div>

              <div className="ch-footer">
                <span className="ch-id">ID: {b._id}</span>
                <button className="ch-delete-btn" onClick={() => deleteCancelled(b._id)}>
                  🗑 Xóa lịch sử
                </button>
              </div>

            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
