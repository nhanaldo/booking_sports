import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./FootballFields.css"; 
import fieldImages from "../utils/fieldImages";
import typeMap from "../utils/typeMap";

export default function TennisFields() {
  const [fields, setFields] = useState([]);
  const [query, setQuery] = useState("");
  const nav = useNavigate();

  const [counts, setCounts] = useState({
    football: 0,
    basketball: 0,
    tennis: 0,
  });

  const fieldTypes = [
    { name: "Bóng đá", key: "football" },
    { name: "Bóng rổ", key: "basketball" },
    { name: "Tennis", key: "tennis" }
  ];

  const normalize = (t) => String(t).trim().toLowerCase();

  // 👉 Gọi API /fields
  useEffect(() => {
    API.get("/fields")
      .then((res) => {
        // 👉 chỉ lấy sân tennis
        const tennisOnly = res.data.filter(
          (f) => normalize(f.type) === "tennis"
        );

        setFields(tennisOnly);

        // 👉 tính tổng 3 loại
        const football = res.data.filter(f => normalize(f.type) === "bóng đá").length;
        const basketball = res.data.filter(f => normalize(f.type) === "bóng rổ").length;
        const tennis = res.data.filter(f => normalize(f.type) === "tennis").length;

        setCounts({ football, basketball, tennis });
      })
      .catch((err) => console.error("❌ Lỗi load fields:", err));
  }, []);

  // 👉 lọc theo tên sân
  const filtered = fields.filter((f) =>
    f.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3 className="sidebar-title">Danh sách sân bãi</h3>
        <hr className="sidebar-line" />

        {fieldTypes.map((t, i) => (
          <div className="sidebar-row" key={i}>
            <span className="sidebar-name">{t.name}</span>
            <span className="sidebar-count">{counts[t.key]}</span>
          </div>
        ))}

        {/* search */}
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên sân..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">

        <div className="title-wrapper">
          <div className="stars">
            <span className="star gray">★</span>
            <span className="star yellow">★</span>
            <span className="star gray">★</span>
          </div>

          <h1 className="page-title">Danh sách sân Tennis</h1>
          <div className="title-underline"></div>
        </div>

        {/* LIST */}
        <div className="cards">
          {filtered.map((f) => {
            const cleanType = String(f.type).trim();
            const typeKey = typeMap[cleanType] || "default";

            return (
              <div className="field-card" key={f._id}>
                <img
                  src={fieldImages[typeKey]}
                  className="field-img"
                  alt={f.type}
                />

                <div className="card-body">
                  <h3 className="field-name">{f.name}</h3>

                  <p className="promo-text">
                    🎾 Sân tennis chất lượng cao – phù hợp luyện tập & thi đấu.
                  </p>

                  <button
                    className="detail-btn"
                    onClick={() => nav(`/fields/${f._id}`)}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
