import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import Swal from "sweetalert2";   // popup đẹp
import "./Book.css";
import socket from "../socket";

export default function Book() {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const editingBooking = location.state?.editingBooking || null;
  const isEdit = !!editingBooking;

  const sportType =
    editingBooking?.sport_type ||
    localStorage.getItem("selectedType") ||
    "Bóng đá";

  const [date, setDate] = useState(editingBooking?.booking_date || "");
  const [slot, setSlot] = useState(editingBooking?.time_slot || "");
  const [price, setPrice] = useState(editingBooking?.price || null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [fieldInfo, setFieldInfo] = useState({
    field_name: "",
    field_location: "",
  });

  // Lấy thông tin sân
  useEffect(() => {
    API.get(`/fields/${id}`)
      .then((res) => setFieldInfo(res.data))
      .catch((err) => console.error("Lỗi lấy thông tin sân:", err));
  }, [id]);

  const convertType = (type) => {
    switch (type.toLowerCase()) {
      case "bóng đá":
        return "football";
      case "bóng rổ":
        return "basketball";
      case "quần vợt":
        return "tennis";
      default:
        return type.toLowerCase();
    }
  };

  // 🟢 Lắng nghe realtime từ người khác đặt
  useEffect(() => {
    function handleRealtime(data) {
      const sameField = String(data.field_id) === String(id);
      const sameDate = data.date === date;

      if (!sameField || !sameDate) return;

      // Nếu slot đang chọn bị chiếm → reset + popup
      if (slot === data.slot) {
        Swal.fire({
          icon: "warning",
          title: "Khung giờ đã bị đặt!",
          text: `Khung giờ ${slot} vừa được đặt bởi người khác.`,
          confirmButtonText: "OK",
        });

        setSlot("");
        setPrice(null);
      }

      // Cập nhật UI
      setBookedSlots((prev) =>
        prev.includes(data.slot) ? prev : [...prev, data.slot]
      );

      // Thông báo slot khác bị chiếm
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: `Khung giờ ${data.slot} vừa có người đặt!`,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: "#fff",
      });

    }

    socket.on("slotBooked", handleRealtime);

    return () => socket.off("slotBooked", handleRealtime);
  }, [id, date, slot]);

  // Lấy danh sách khung giờ
  useEffect(() => {
    if (isEdit) return;

    API.get(`/timeslots/${convertType(sportType)}`)
      .then((res) => setTimeSlots(res.data))
      .catch((err) => console.error("Lỗi tải khung giờ:", err));
  }, [sportType, isEdit]);

  // Lấy slot đã đặt theo ngày
  useEffect(() => {
    if (!date || isEdit) return;

    API.get(`/bookings/booked-slots/${id}/${date}`)
      .then((res) => setBookedSlots(res.data || []))
      .catch((err) => console.error("Lỗi lấy booked slots:", err));
  }, [date, id, isEdit]);

  // Khi chọn slot
  const handleSlotChange = (e) => {
    const selected = e.target.value;
    setSlot(selected);

    const found = timeSlots.find(
      (s) => `${s.start}-${s.end}` === selected
    );

    setPrice(found ? found.price : null);
  };

  const handleGoToPayment = () => {
    if (!date || !slot || !price) {
      Swal.fire({
        icon: "error",
        title: "Thiếu thông tin!",
        text: "Vui lòng chọn ngày và khung giờ.",
      });
      return;
    }

    nav("/payment", {
      state: {
        id,
        sportType,
        date,
        slot,
        price,
        fieldInfo,
      },
    });
  };

  return (
    <div className="booking-container">
      <div className="booking-card">

        {/* HEADER */}
        <div className="booking-header">
          <h2>{isEdit ? "✏️ Sửa đặt sân" : `Đặt sân — ${sportType}`}</h2>
        </div>

        {/* FIELD INFO */}
        {!isEdit && (
          <div className="field-box">
            <p><strong>Tên sân:</strong> {fieldInfo.field_name}</p>
            <p><strong>Khu:</strong> {fieldInfo.field_location}</p>
          </div>
        )}

        {/* FORM */}
        <div className="form-section">
          <label>Ngày đặt</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />

          {!isEdit && (
            <>
              <label>Khung giờ</label>
              <select value={slot} onChange={handleSlotChange} disabled={!date}>
                <option value="">-- Chọn khung giờ --</option>

                {timeSlots.map((s) => {
                  const label = `${s.start}-${s.end}`;
                  const isBooked = bookedSlots.includes(label);
                  return (
                    <option key={s._id} value={label} disabled={isBooked}>
                      {label} — {s.price.toLocaleString()}đ{" "}
                      {isBooked ? "(Đã đặt)" : ""}
                    </option>
                  );
                })}
              </select>
            </>
          )}

          {price && (
            <div className="price-box">
              💰 Giá: <span>{price.toLocaleString()} VNĐ</span>
            </div>
          )}

          <div className="bottom-actions">
            <button className="cancel-btn" onClick={() => nav(-1)}>
              Hủy
            </button>

            {!isEdit && (
              <button className="pay-btn" onClick={handleGoToPayment}>
                Chuyển qua trang thanh toán
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
