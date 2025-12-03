import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./AddPromotion.css";

export default function AddPromotion() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    discountType: "none",
    discountValue: "",
    minBookings: 0,
    minPoints: 0,
    fields: [],
    validFrom: "",
    validTo: "",
    status: "active",
  });

const handleChange = (e) => {
  let { name, value } = e.target;

  // Xử lý khi đổi loại giảm giá
  if (name === "discountType") {
    return setForm({
      ...form,
      discountType: value,
      discountValue: "",
    });
  }

  // Xử lý discountValue
  if (name === "discountValue") {
    let num = Number(value);

    // Nếu là % thì khóa 0–100
    if (form.discountType === "percent") {
      num = Math.max(0, Math.min(100, num));
    }

    return setForm({
      ...form,
      discountValue: num,
    });
  }

  setForm({ ...form, [name]: value });
};


  const handleFieldsChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm({ ...form, fields: value });
  };

  const openImageSearch = () => {
    window.open("https://unsplash.com/s/photos/sports", "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/promotions", form);
      alert("🎉 Thêm khuyến mãi thành công!");
      nav("/admin/promotions");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi thêm khuyến mãi!");
    }
  };

  return (
    <div className="add-promo-wrapper">
      <h2>➕ Thêm Khuyến Mãi Mới</h2>

      <form className="add-promo-form" onSubmit={handleSubmit}>
        
        <label>Tiêu đề *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Mô tả chi tiết</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
        ></textarea>

        <label>Ảnh đại diện (URL)*</label>
        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Dán link ảnh ở đây"
          onClick={openImageSearch}
          required
        />
        <small className="hint">Nhấp vào ô để mở trang tìm ảnh</small>

        <label>Loại giảm giá</label>
        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="none">Không giảm giá</option>
          <option value="percent">Giảm phần trăm (%)</option>
          <option value="fixed">Giảm cố định (VND)</option>
        </select>

        <label>Giá trị giảm {form.discountType === "percent" ? "(%)" : "(VND)"}</label>
        <input
          type="number"
          name="discountValue"
          value={form.discountValue}
          onChange={handleChange}
          placeholder={
            form.discountType === "percent"
              ? "0 - 100"
              : "Nhập số tiền giảm"
          }
          min={form.discountType === "percent" ? 0 : undefined}
          max={form.discountType === "percent" ? 100 : undefined}
          disabled={form.discountType === "none"}
        />

        <label>Số lần đặt tối thiểu</label>
        <input
          type="number"
          name="minBookings"
          value={form.minBookings}
          onChange={handleChange}
        />

        <label>Điểm tích lũy tối thiểu</label>
        <input
          type="number"
          name="minPoints"
          value={form.minPoints}
          onChange={handleChange}
        />

        <label>Áp dụng cho loại sân</label>
        <select multiple name="fields" onChange={handleFieldsChange}>
          <option value="football">⚽ Sân bóng</option>
          <option value="tennis">🎾 Tennis</option>
          <option value="basketball">🏀 Bóng rổ</option>
          <option value="all">📌 Tất cả loại sân</option>
        </select>

        <label>Ngày bắt đầu</label>
        <input
          type="date"
          name="validFrom"
          value={form.validFrom}
          onChange={handleChange}
        />

        <label>Ngày kết thúc</label>
        <input
          type="date"
          name="validTo"
          value={form.validTo}
          onChange={handleChange}
        />

        <label>Trạng thái</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng</option>
        </select>

        <button type="submit" className="btn-submit">
          ➕ Thêm Khuyến Mãi
        </button>
      </form>
    </div>
  );
}
