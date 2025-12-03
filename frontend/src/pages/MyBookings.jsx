import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./MyBookingsNew.css";

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings
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

  // Cancel
  const cancelBooking = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt sân này?")) return;

    try {
      await API.put(`/bookings/${id}/cancel`);
      alert("Đã hủy đặt sân thành công!");
      setList((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Lỗi khi hủy đặt sân");
      console.error(err);
    }
  };

  // Format date
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

  if (loading)
    return (
      <div className="loading-screen">
        <span className="loader"></span>
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  if (!list.length)
    return (
      <div className="empty-screen">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png" alt="empty" />
        <p>Bạn chưa có lịch đặt sân nào</p>
        <Link to="/fields" className="empty-btn">Đặt sân ngay</Link>
      </div>
    );

  return (
    <div className="booking-layout">

      {/* LEFT SIDE */}
      <div className="left-panel">

        <div className="left-header">
          <Link to="/fields" className="back-btn">← Quay lại</Link>
          <h2>Lịch sử đặt sân</h2>
        </div>

        <div className="booking-list">
          {list.map((b) => (
            <div className="booking-item" key={b._id}>

              <div className="item-top">
                <h3 className="field-name">
                  {b.field_name || b.field?.name || "Sân thể thao"}
                </h3>

                <span className={`status-tag ${b.status === "booked" ? "status-ok" : "status-cancel"}`}>
                  {b.status === "booked" ? "Đã đặt" : "Đã hủy"}
                </span>
              </div>

              <div className="item-info">
                <p><strong>Loại sân:</strong> {b.sport_type}</p>
                <p><strong>Địa điểm:</strong> {b.field_location || b.field?.location}</p>
                <p><strong>Giá:</strong> {b.field_price?.toLocaleString("vi-VN")} VNĐ</p>
              </div>

              <div className="item-time">
                <p>📅 <strong>Ngày đặt:</strong> {formatDateTime(b.createdAt)}</p>
                <p>🕑 <strong>Ngày chơi:</strong> {formatDateTime(b.booking_date)} ({b.time_slot})</p>
              </div>

              <div className="item-footer">
                <span className="item-id">ID: {b._id}</span>

                {b.status !== "cancelled" && (
                  <button
                    className="btn-cancel"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Hủy đặt
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <img
          src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d"
          alt="sports"
          className="side-image"
        />

        <Link to="/fields" className="btn-continue">
          Tiếp tục đặt sân
        </Link>
      </div>

    </div>
  );
}
