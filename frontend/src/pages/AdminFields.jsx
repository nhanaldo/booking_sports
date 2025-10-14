import { useEffect, useState } from "react";
import API from "../api";

export default function AdminFields() {
  const [fields, setFields] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);

  // Lấy danh sách sân
  const loadFields = async () => {
    try {
      const res = await API.get("/admin/fields");
      setFields(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi load fields");
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  // Thêm hoặc cập nhật sân
  const saveField = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/admin/fields/${editing}`, { name, price });
        alert("✅ Cập nhật sân thành công");
      } else {
        await API.post("/admin/fields", { name, price });
        alert("✅ Thêm sân thành công");
      }
      setName("");
      setPrice("");
      setEditing(null);
      loadFields();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi lưu sân");
    }
  };

  // Chỉnh sửa
  const editField = (field) => {
    setEditing(field._id);
    setName(field.name);
    setPrice(field.price);
  };

  // Xóa sân
  const deleteField = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sân này?")) return;
    try {
      await API.delete(`/admin/fields/${id}`);
      alert("🗑️ Xóa sân thành công");
      loadFields();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa sân");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>⚽ Quản lý sân</h2>

      <form onSubmit={saveField} style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Tên sân"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Giá sân"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">
          {editing ? "💾 Cập nhật" : "➕ Thêm sân"}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setName(""); setPrice(""); }}>
            ❌ Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Tên sân</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f._id}>
              <td>{f.name}</td>
              <td>{f.price}</td>
              <td>
                <button onClick={() => editField(f)}>✏️ Sửa</button>
                <button onClick={() => deleteField(f._id)}>🗑️ Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
