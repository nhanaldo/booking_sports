import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Book() {
  const { id } = useParams();
  const nav = useNavigate();
  const sportType = localStorage.getItem("selectedType") || "Bóng đá";

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [price, setPrice] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]); // 🟢 các khung giờ đã có người đặt

  // 🟢 Lấy tất cả khung giờ của môn thể thao
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const res = await API.get(`/timeslots/${sportType.toLowerCase()}`);
        setTimeSlots(res.data);
      } catch (err) {
        console.error("Lỗi tải khung giờ:", err);
        alert("Không thể tải danh sách khung giờ từ server.");
      }
    };
    fetchTimeSlots();
  }, [sportType]);

  // 🟢 Khi chọn ngày → gọi API xem ngày đó có giờ nào bị đặt rồi
  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      try {
        const res = await API.get(`/bookings/booked-slots/${id}/${date}`);
        setBookedSlots(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy booked slots:", err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [date, id]);

  // 🟢 Khi chọn khung giờ → hiển thị giá
  const handleSlotChange = (e) => {
    const selected = e.target.value;
    setSlot(selected);

    const found = timeSlots.find((s) => `${s.start}-${s.end}` === selected);
    setPrice(found ? found.price : null);
  };

  // 🟢 Gửi yêu cầu đặt sân
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", {
        field_id: id,
        sport_type: sportType,
        booking_date: date,
        time_slot: slot,
      });
      alert("✅ Đặt sân thành công!");
      nav("/fields");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi đặt sân");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Đặt sân — {sportType}</h2>

      {/* 🗓️ Chọn ngày */}
      <div style={{ marginTop: 20 }}>
        <label>Ngày: </label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* 🕑 Chọn khung giờ */}
      <div style={{ marginTop: 20 }}>
        <label>Khung giờ: </label>
        <select
          value={slot}
          onChange={handleSlotChange}
          required
          disabled={!date} // chưa chọn ngày thì ko cho chọn giờ
        >
          <option value="">-- Chọn khung giờ --</option>
          {timeSlots.map((s) => {
            const timeLabel = `${s.start}-${s.end}`;
            const isBooked = bookedSlots.includes(timeLabel);

            return (
              <option
                key={s._id}
                value={timeLabel}
                disabled={isBooked}
                style={{
                  color: isBooked ? "#999" : "#000",
                  backgroundColor: isBooked ? "#ffeaea" : "#fff",
                  fontStyle: isBooked ? "italic" : "normal",
                }}
              >
                {s.start} - {s.end} — {s.price.toLocaleString()} VNĐ{" "}
                {isBooked ? "(Đã đặt)" : ""}
              </option>
            );
          })}
        </select>
      </div>

      {/* 💰 Giá */}
      {price && (
        <p style={{ marginTop: 15, fontWeight: "bold", color: "#1976d2" }}>
          💰 Giá: {price.toLocaleString()} VNĐ
        </p>
      )}

      <button
        type="submit"
        disabled={!date || !slot || bookedSlots.includes(slot)}
        style={{
          marginTop: 30,
          background: "#4caf50",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          cursor: bookedSlots.includes(slot) ? "not-allowed" : "pointer",
          opacity: bookedSlots.includes(slot) ? 0.6 : 1,
        }}
      >
        ✅ Xác nhận đặt sân
      </button>
    </form>
  );
}
