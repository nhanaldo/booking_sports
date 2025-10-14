import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [footballFilter, setFootballFilter] = useState("all"); // ⚽ lọc sân 5 / 7
  const nav = useNavigate();

  const load = async () => {
    try {
      const res = await API.get("/admin/bookings", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách booking:", err);
      alert(err.response?.data?.message || "Lỗi khi tải danh sách đặt sân");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Chưa có dữ liệu";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt sân này?")) return;
    try {
      await API.delete(`/admin/bookings/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      alert("✅ Hủy đặt sân thành công!");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Lỗi khi hủy đặt sân");
    }
  };

  // 🟢 Chia booking theo loại sân
  const footballBookings = bookings.filter((b) => b.sport_type === "Bóng đá");
  const basketballBookings = bookings.filter((b) => b.sport_type === "Bóng rổ");
  const tennisBookings = bookings.filter((b) => b.sport_type === "Tennis");

  // ⚽ Lọc sân 5 hoặc 7 người
  const filteredFootball =
    footballFilter === "all"
      ? footballBookings
      : footballBookings.filter((b) =>
          footballFilter === "5"
            ? b.field_name?.includes("5")
            : b.field_name?.includes("7")
        );

  // 🟢 Hàm render danh sách mỗi loại sân
  const renderBookings = (list, title, icon) => (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 12,
        background: "#fff",
        minHeight: "300px",
      }}
    >
      <h3 style={{ color: "#1976d2", marginBottom: 12 }}>
        {icon} {title}
      </h3>
      {list.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#999" }}>Chưa có đặt sân</p>
      ) : (
        list.map((b) => (
          <div
            key={b._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              background: "#fafafa",
            }}
          >
            <p><b>Sân:</b> {b.field_name}</p>
            <p><b>Giá:</b> {b.field_price?.toLocaleString()} VNĐ</p>
            <p><b>Địa điểm:</b> {b.field_location}</p>
            <p>📅 <b>Ngày đặt:</b> {formatDateTime(b.createdAt)}</p>
            <p>🕑 <b>Ngày chơi:</b> {formatDateTime(b.booking_date)} ({b.time_slot})</p>
            <p>👤 <b>Khách:</b> {b.user?.name} ({b.user?.phone})</p>
            <button
              onClick={() => handleDelete(b._id)}
              style={{
                marginTop: 6,
                background: "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ❌ Hủy
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => nav("/fields")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ⬅ Quay lại danh sách sân
      </button>

      <h2 style={{ marginBottom: 16 }}>📋 Danh sách đặt sân (Admin)</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {/* ⚽ Bóng đá có filter */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 12,
            background: "#fff",
          }}
        >
          <h3 style={{ color: "#1976d2", marginBottom: 12 }}>⚽ Bóng đá</h3>

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button
              onClick={() => setFootballFilter("all")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: footballFilter === "all" ? "#1976d2" : "#ccc",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFootballFilter("5")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: footballFilter === "5" ? "#1976d2" : "#ccc",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Sân 5 người
            </button>
            <button
              onClick={() => setFootballFilter("7")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: footballFilter === "7" ? "#1976d2" : "#ccc",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Sân 7 người
            </button>
          </div>

          {filteredFootball.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#999" }}>Chưa có đặt sân</p>
          ) : (
            filteredFootball.map((b) => (
              <div
                key={b._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                  background: "#fafafa",
                }}
              >
                <p><b>Sân:</b> {b.field_name}</p>
                <p><b>Giá:</b> {b.field_price?.toLocaleString()} VNĐ</p>
                <p><b>Địa điểm:</b> {b.field_location}</p>
                <p>📅 <b>Ngày đặt:</b> {formatDateTime(b.createdAt)}</p>
                <p>🕑 <b>Ngày chơi:</b> {formatDateTime(b.booking_date)} ({b.time_slot})</p>
                <p>👤 <b>Khách:</b> {b.user?.name} ({b.user?.phone})</p>
                <button
                  onClick={() => handleDelete(b._id)}
                  style={{
                    marginTop: 6,
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ❌ Hủy
                </button>
              </div>
            ))
          )}
        </div>

        {/* 🏀 Bóng rổ & 🎾 Tennis */}
        {renderBookings(basketballBookings, "Bóng rổ", "🏀")}
        {renderBookings(tennisBookings, "Tennis", "🎾")}
      </div>
    </div>
  );
}
