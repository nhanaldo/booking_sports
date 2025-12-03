import { useNavigate } from "react-router-dom";
import "./Fields.css";
import Header from "./Header";
import Footer from "./Footer";

export default function Fields({ token, role, name, setToken, setRole, setName }) {
  const nav = useNavigate();

  const chooseType = (type) => {
    localStorage.setItem("selectedType", type);
    if (type === "Bóng đá") nav("/football");
    else if (type === "Bóng rổ") nav("/basketball");
    else if (type === "Tennis") nav("/tennis");
  };

  return (
    <div className="fields-page">
      {/* HEADER */}


      {/* CONTENT */}
      <div className="fields-page-inner">

        <div className="decor" />
        <div className="fields-header">
          <div>
            <div className="fields-title">Chọn loại sân thể thao</div>
            <div className="fields-sub">Chọn nhanh loại sân bạn muốn đặt</div>
          </div>
        </div>

        <div className="types-grid">
          <div className="type-card" onClick={() => chooseType("Bóng đá")}>
            <div className="icon sport-football">⚽</div>
            <div className="type-title">Bóng đá</div>
            <div className="type-desc">Tìm sân 5, 7, 11 gần bạn</div>
            <img src="/images/f1.png" alt="player" className="type-img" />
          </div>

          <div className="type-card" onClick={() => chooseType("Bóng rổ")}>
            <div className="icon sport-basketball">🏀</div>
            <div className="type-title">Bóng rổ</div>
            <div className="type-desc">Sân trong nhà & ngoài trời</div>
            <img src="/images/b1.png" alt="player" className="type-img" />
          </div>

          <div className="type-card" onClick={() => chooseType("Tennis")}>
            <div className="icon sport-tennis">🎾</div>
            <div className="type-title">Tennis</div>
            <div className="type-desc">Sân hardcourt & grass</div>
            <img src="/images/t1.png" alt="player" className="type-img" />
          </div>
        </div>
      </div>

      {/* FOOTER */}

    </div>
  );
}
