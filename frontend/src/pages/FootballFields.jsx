import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function FootballFields() {
  const [fields, setFields] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    API.get("/football")
      .then(res => setFields(res.data))
      .catch(err => console.error("❌ Lỗi lấy sân bóng đá:", err));
  }, []);

  const handleSelect = (field) => {
    localStorage.setItem("selectedType", "Bóng đá");
    nav(`/book/${field._id}`); // <-- dùng _id
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>⚽ Danh sách sân bóng đá</h2>

      {fields.length === 0 ? (
        <p>⏳ Đang tải dữ liệu hoặc chưa có sân nào.</p>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {fields.map((f) => (
            <button
              key={f._id}
              onClick={() => handleSelect(f)}
              style={{
                width: 120,
                height: 80,
                borderRadius: 10,
                background: "#4caf50",
                color: "#fff",
                fontSize: 18,
                border: "none",
                cursor: "pointer",
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      <button onClick={() => nav("/fields")} style={{ marginTop: 30 }}>
        ⬅ Quay lại
      </button>
    </div>
  );
}
