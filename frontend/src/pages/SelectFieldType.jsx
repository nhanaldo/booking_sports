import { useNavigate } from "react-router-dom";
import "./SelectFieldTypeNew.css"; // CSS mới

export default function SelectFieldType() {
  const nav = useNavigate();

  return (
    <div className="fieldtype-wrapper">
      <div className="fieldtype-container">
        <h2 className="fieldtype-title">Chọn loại sân thể thao</h2>

        <div className="fieldtype-row">
          <button
            onClick={() => nav("/admin/edit-fields/football")}
            className="fieldtype-btn fieldtype-football"
          >
            ⚽ Bóng đá
          </button>

          <button
            onClick={() => nav("/admin/edit-fields/basketball")}
            className="fieldtype-btn fieldtype-basketball"
          >
            🏀 Bóng rổ
          </button>

          <button
            onClick={() => nav("/admin/edit-fields/tennis")}
            className="fieldtype-btn fieldtype-tennis"
          >
            🎾 Tennis
          </button>
        </div>
      </div>
    </div>
  );
}
