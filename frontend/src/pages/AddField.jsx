import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddField.css"; // CSS MỚI

export default function AddField() {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    location: "",
    size: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/fields", formData);
      alert(res.data.message || "Thêm sân thành công!");
      setFormData({ type: "", name: "", size: "", location: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi thêm sân");
    }
  };

  return (
    <div className="field-wrapper">
      <div className="field-container">
        <div className="field-header">
          <button className="field-back-btn" onClick={() => navigate(-1)}>
            ⬅️ Quay lại
          </button>

          <h2 className="field-title">🏟️ Thêm sân mới</h2>
        </div>

        <p className="field-description">
          Nhập thông tin cơ bản cho sân — tên, địa điểm và loại sân.
        </p>

        <form onSubmit={handleSubmit} className="field-form">
          <div className="field-row">
            <div className="field-input-group">
              <label className="field-label">Tên sân</label>
              <input
                type="text"
                className="field-input"
                placeholder="Ví dụ: Sân 7A - KCN A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <span className="field-note">Ví dụ kèm số hoặc khu vực.</span>
            </div>

            <div className="field-input-group">
              <label className="field-label">Địa điểm</label>
              <input
                type="text"
                className="field-input"
                placeholder="Khu vực / Quận / Cụm sân"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
              <span className="field-note">Ghi rõ quận/khu vực để người dùng dễ tìm.</span>
            </div>
          </div>

          <div className="field-row">
            <div className="field-input-group">
              <label className="field-label">Loại sân</label>
              <select
                className="field-select"
                value={formData.type}
                onChange={(e) => {
                  const t = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    type: t,
                    size: t === "football" ? prev.size : ""
                  }));
                }}
                required
              >
                <option value="">--Chọn loại sân--</option>
                <option value="football">Bóng đá</option>
                <option value="basketball">Bóng rổ</option>
                <option value="tennis">Tennis</option>
              </select>
            </div>

            {formData.type === "football" && (
              <div className="field-input-group">
                <label className="field-label">Kích thước</label>
                <select
                  className="field-select"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  required
                >
                  <option value="">--Chọn kích thước--</option>
                  <option value="5 người">5 người</option>
                  <option value="7 người">7 người</option>
                </select>
                <span className="field-note">Chỉ hiển thị khi loại sân là Bóng đá.</span>
              </div>
            )}
          </div>

          <div className="field-actions">
            <button
              type="button"
              className="field-reset-btn"
              onClick={() => setFormData({ type: "", name: "", location: "", size: "" })}
            >
              Đặt lại
            </button>

            <button type="submit" className="field-submit-btn">
              Thêm sân
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
