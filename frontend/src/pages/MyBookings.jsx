import { useEffect, useState } from "react";
import API from "../api";

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Load danh sách đặt sân của user
  const loadBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      const active = res.data.filter((b) => b.status !== "cancelled");
      setList(active);
    } catch (err) {
      alert("Lỗi khi tải danh sách đặt sân");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // 🔴 Hủy đặt sân
  const cancelBooking = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt sân này?")) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      alert("Đã hủy đặt sân thành công!");
      setList((prev) => prev.filter((b) => b._id !== id)); // Ẩn ngay lập tức

    } catch (err) {
      alert("Lỗi khi hủy đặt sân");
      console.error(err);
    }
  };

  // 🕓 Định dạng ngày tháng
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

  if (!list.length)
    return <p>📭 Bạn chưa đặt sân nào. Hãy đặt sân ngay hôm nay!</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🗓️ Lịch đặt sân của tôi
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
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#2e7d32" }}>
            {b.field_name || b.field?.name || "Sân thể thao"}
          </h3>
          <p>
            <b>⚽ Loại sân:</b> {b.sport_type || "Không rõ"}
          </p>
          <p>
            <b>📍 Địa điểm:</b>{" "}
            {b.field_location || b.field?.location || "Chưa có thông tin"}
          </p>
          <p>
            <b>💰 Giá:</b>{" "}
            {b.field_price
              ? b.field_price.toLocaleString("vi-VN") + " VNĐ"
              : "Không rõ"}
          </p>
          <p>📅 <b>Ngày đặt:</b> {formatDateTime(b.createdAt)}</p>
          <p>
            🕑 <b>Ngày chơi:</b> {formatDateTime(b.booking_date)} (
            {b.time_slot})
          </p>
          <p>
            <b>📌 Trạng thái:</b>{" "}
            <span
              style={{
                color:
                  b.status === "booked"
                    ? "green"
                    : b.status === "cancelled"
                      ? "red"
                      : "gray",
                fontWeight: "bold",
              }}
            >

            </span>
          </p>

          {b.status !== "cancelled" && (
            <button
              onClick={() => cancelBooking(b._id)}
              style={{
                backgroundColor: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              ❌ Hủy đặt sân
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
