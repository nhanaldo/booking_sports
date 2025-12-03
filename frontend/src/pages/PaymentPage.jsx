import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api";
import axios from "axios";
import "./PaymentPage.css";

export default function PaymentPage() {
  const { state } = useLocation();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [voucherOpen, setVoucherOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [needLogin, setNeedLogin] = useState(false);

  if (!state) {
    return (
      <div className="pay-page">
        <div className="pay-main-card">
          <p>⚠️ Không có thông tin đặt sân. Vui lòng quay lại.</p>
          <button onClick={() => nav(-1)} className="btn-gray">
            ⬅ Quay lại
          </button>
        </div>
      </div>
    );
  }

  const {
    id: field_id,
    sportType: sport_type,
    date: booking_date,
    slot: time_slot,
    price,
    fieldInfo,
  } = state;

  const field_name = fieldInfo?.field_name;
  const field_location = fieldInfo?.field_location;
  const imageUrl = fieldInfo?.imageUrl;

  const finalPrice = selectedVoucher
    ? selectedVoucher.discountType === "percent"
      ? Math.floor(price - (price * selectedVoucher.discountValue) / 100)
      : Math.max(price - selectedVoucher.discountValue, 0)
    : price;

  const openVoucher = async () => {
    try {
      setVoucherOpen(true);
      const res = await API.get("/bookings/vouchers/available");
      setTotalBookings(res.data.totalBookings);
      setVouchers(res.data.vouchers);
    } catch (err) {
      console.error("❌ Lỗi load voucher:", err);
    }
  };

  const handlePayMomo = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNeedLogin(true);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/payment/momo", {
        amount: finalPrice,
        orderInfo: `Đặt sân ${sport_type} - ${time_slot} ngày ${booking_date}`,
        sport_type,
      });

      const momoPopup = window.open(
        res.data.payUrl,
        "_blank",
        "width=600,height=700"
      );

      setTimeout(async () => {
        if (momoPopup) momoPopup.close();

        setSuccessMsg("✅ Thanh toán thành công!");
        setLoading(false);

        await API.post("/bookings", {
          field_id,
          sport_type,
          booking_date,
          time_slot,
          usedVoucher: selectedVoucher?._id || null,
          final_price: finalPrice,
        });

        setTimeout(() => {
          setSuccessMsg("");
          nav("/payment-success");
        }, 1500);
      }, 5000);
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      setSuccessMsg("❌ Thanh toán thất bại!");
      setTimeout(() => setSuccessMsg(""), 2000);
      setLoading(false);
    }
  };

  return (
    <div className="pay-page">

      {/* ======================= LOGIN POPUP ======================= */}
      {needLogin && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>🔑 Cần đăng nhập</h3>
            <p>Vui lòng đăng nhập để tiếp tục thanh toán.</p>

            <div className="modal-btns">
              <button className="btn-primary" onClick={() => nav("/login")}>
                Đăng nhập
              </button>
              <button className="btn-blue" onClick={() => nav("/register")}>
                Đăng ký
              </button>
              <button className="btn-gray" onClick={() => setNeedLogin(false)}>
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MAIN LAYOUT 2 CỘT ======================= */}
      <div className="pay-wrapper">
        
        {/* ----------- LEFT: INFO ----------- */}
        <div className="pay-left">
          <h2 className="pay-title">💳 Xác nhận thanh toán</h2>

          <div className="info-block">
            <p><strong>Loại sân:</strong> {sport_type}</p>
            <p><strong>Tên sân:</strong> {field_name}</p>
            <p><strong>Khu:</strong> {field_location}</p>
            <p><strong>Ngày:</strong> {booking_date}</p>
            <p><strong>Khung giờ:</strong> {time_slot}</p>
            <p><strong>Giá gốc:</strong> {price.toLocaleString()} VNĐ</p>

            {selectedVoucher && (
              <p className="discount-line">
                🎁 Giảm còn: <strong>{finalPrice.toLocaleString()} VNĐ</strong>
              </p>
            )}

            <button className="btn-light" onClick={openVoucher}>
              🎟 Chọn voucher
            </button>
          </div>

          {/* Buttons */}
          <div className="pay-buttons">
            <button className="btn-gray" onClick={() => nav(-1)}>
              ⬅ Quay lại chọn sân
            </button>

            <button
              className="btn-momo"
              onClick={handlePayMomo}
              disabled={loading}
            >
              {loading ? "⏳ Đang xử lý..." : "💸 Thanh toán MoMo"}
            </button>
          </div>
        </div>

        {/* ----------- RIGHT: IMAGE + VOUCHER BTN ----------- */}
        <div className="pay-right">
          
             <img src="/images/coucher.jpg" alt="Home Banner" className="pay-image" />
           
        </div>

      </div>

      {successMsg && <div className="pay-toast">{successMsg}</div>}

      {/* ======================= VOUCHER POPUP ======================= */}
      {voucherOpen && (
        <div className="modal-overlay" onClick={() => setVoucherOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>🎁 Chọn voucher</h3>

            <div className="voucher-list">
              {vouchers.map((v) => {
                const isSelected = selectedVoucher?._id === v._id;

                return (
                  <div
                    key={v._id}
                    className={`voucher-item ${v.eligible ? "" : "disabled"} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => {
                      if (!v.eligible) return;
                      setSelectedVoucher(isSelected ? null : v);
                    }}
                  >
                    <h4>{v.title}</h4>
                    <p>{v.description}</p>

                    {v.discountType === "percent" && <p>Giảm {v.discountValue}%</p>}
                    {v.discountType === "fixed" && (
                      <p>Giảm {v.discountValue.toLocaleString()}đ</p>
                    )}

                    {isSelected && <span className="tag-selected">✔ Đã chọn</span>}
                  </div>
                );
              })}
            </div>

            <button className="btn-gray" onClick={() => setVoucherOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
