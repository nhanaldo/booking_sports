import { useEffect, useState } from "react";
import API from "../api";

export default function CancelledBookings() {
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

  // 🗑 Xóa 1 lịch sử hủy
  const deleteCancelled = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch sử này không?")) return;
    try {
      await API.delete(`/bookings/cancelled/${id}`);
      setList((prev) => prev.filter((item) => item._id !== id)); // ✅ Cập nhật giao diện ngay
    } catch (err) {
      alert("Lỗi khi xóa lịch sử hủy");
      console.error(err);
    }
  };

  const formatDateTime = (dateStr, showTime = false) => {
    if (!dateStr) return "Chưa có dữ liệu";
    const d = new Date(dateStr);
    if (showTime)
      return d.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    else
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
  };

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (!list.length) return <p>📭 Bạn chưa hủy sân nào.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🗑️ Lịch sử hủy đặt sân
      </h2>

      {list.map((b) => (
        <div
          key={b._id}
          style={{
            margin: "15px auto",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            maxWidth: "500px",
            backgroundColor: "#fff3f3",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#d32f2f" }}>{b.field_name || "Sân thể thao"}</h3>
          <p><b>⚽ Loại sân:</b> {b.sport_type}</p>
          <p><b>📅 Ngày chơi:</b> {formatDateTime(b.booking_date)} ({b.time_slot})</p>
          <p><b>🕓 Hủy lúc:</b> {formatDateTime(b.cancelled_at, true)}</p>

          <button
            onClick={() => deleteCancelled(b._id)}
            style={{
              marginTop: 10,
              backgroundColor: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            🗑 Xóa
          </button>
        </div>
      ))}
    </div>
  );
}
