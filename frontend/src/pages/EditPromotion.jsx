import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./AddPromotion.css";

export default function EditPromotion() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);

  // ⬇ Load dữ liệu khuyến mãi theo ID
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await API.get(`/promotions/${id}`);

        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          image: res.data.image || "",
          discountType: res.data.discountType || "none",
          discountValue: res.data.discountValue || "",
          minBookings: res.data.minBookings || 0,
          minPoints: res.data.minPoints || 0,
          fields: res.data.fields || [],
          validFrom: res.data.validFrom?.slice(0, 10) || "",
          validTo: res.data.validTo?.slice(0, 10) || "",
          status: res.data.status || "active",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu!");
      }
    };

    fetchPromo();
  }, [id]);

  // ⬇ Xử lý input thay đổi
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Xử lý giảm giá
    if (name === "discountValue") {
      value = value.replace(/[^0-9]/g, "");

      if (form.discountType === "percent") {
        if (value > 100) value = 100;
        if (value < 0) value = 0;
      }
    }

    // Reset discountValue khi đổi loại giảm giá
    if (name === "discountType") {
      return setForm({
        ...form,
        discountType: value,
        discountValue: "",
      });
    }

    setForm({ ...form, [name]: value });
  };

  // ⬇ Loại sân multiple select
  const handleFieldsChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm({ ...form, fields: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/promotions/${id}`, form);
      alert("🎉 Cập nhật thành công!");
      nav("/promotions");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật!");
    }
  };

  if (loading) return <h3>Đang tải dữ liệu...</h3>;

  return (
    <div className="add-promo-wrapper">
      <h2>✏️ Sửa Khuyến Mãi</h2>

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
          required
        />

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

        <label>
          Giá trị giảm{" "}
          {form.discountType === "percent" ? "(%)" : "(VND)"}
        </label>
        <input
          type="number"
          name="discountValue"
          value={form.discountValue}
          onChange={handleChange}
          placeholder={
            form.discountType === "percent" ? "0 - 100" : "Nhập số tiền giảm"
          }
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
        <select
          multiple
          name="fields"
          value={form.fields}
          onChange={handleFieldsChange}
        >
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
          💾 Lưu Thay Đổi
        </button>
      </form>
    </div>
  );
}
