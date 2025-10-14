import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";



export default function AddField() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Bóng đá"); 

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); //e.preventDefault() → chặn reload trang khi submit form.
    try {
      await API.post(
        "/admin/fields",
        { name, location, price, type }, 
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }//xac thuc admin
        }
      );
      alert("Thêm sân thành công");
      nav("/fields");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm sân");
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 400 }}>
      <h2>Thêm sân</h2>

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

      {/* 👇 Thêm loại sân */}
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="Bóng đá">Bóng đá</option>
        <option value="Bóng rổ">Bóng rổ</option>
        <option value="Tennis">Tennis</option>
      </select>

      <button>Thêm sân</button>
    </form>
  );
}
