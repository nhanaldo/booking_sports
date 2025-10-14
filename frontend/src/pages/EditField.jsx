import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function EditField() {
  const { id } = useParams(); // 👈 lấy id từ URL
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState(""); // 👈 thêm state cho loại sân
  const nav = useNavigate();

  // Lấy thông tin sân khi load trang
  useEffect(() => {
    API.get(`/fields/${id}`)
      .then((res) => {
        setName(res.data.name);
        setLocation(res.data.location);
        setPrice(res.data.price);
        setType(res.data.type || ""); // 👈 set loại sân
      })
      .catch(() => alert("Không tìm thấy sân"));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `/admin/fields/${id}`,
        { name, location, price, type }, // 👈 gửi kèm type
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      alert("Cập nhật sân thành công");
      nav("/fields");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật sân");
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 400 }}>
      <h2>Sửa sân</h2>

      <input
        placeholder="Tên sân"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Địa điểm"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <input
        placeholder="Giá (VNĐ/giờ)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      {/* 👇 thêm chọn loại sân */}
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">-- Chọn loại sân --</option>
        <option value="Bóng đá">Bóng đá</option>
        <option value="Bóng rổ">Bóng rổ</option>
        <option value="Tennis">Tennis</option>
      </select>

      <button>Cập nhật</button>
    </form>
  );
}
