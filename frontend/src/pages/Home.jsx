import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GiSoccerField } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  const [selectedType, setSelectedType] = useState("");
  const nav = useNavigate();

  const handleSearch = () => {
    if (!selectedType) {
      alert("Vui lòng chọn loại sân!");
      return;
    }
    localStorage.setItem("selectedType", selectedType);
    nav(`/${selectedType}`);
  };

  return (
    <div>
      {/* Banner & Search */}
      <div className="home-banner">
        <img src="/images/hom2.jpg" alt="Home Banner" className="banner-image" />

        <div className="banner-content">
          <h1>HỆ THỐNG HỖ TRỢ TÌM KIẾM ĐẶT SÂN NHANH</h1>
          <p>Dữ liệu được cập nhật thường xuyên giúp người dùng tìm sân nhanh nhất</p>

          <div className="search-box">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">-- Chọn loại sân --</option>
              <option value="football">⚽ Bóng đá</option>
              <option value="basketball">🏀 Bóng rổ</option>
              <option value="volleyball">🏐 Bóng chuyền</option>
            </select>
            <button onClick={handleSearch}>Tìm kiếm 🔍</button>
          </div>
        </div>
      </div>

      {/* === Feature Section === */}
      {/* === Feature Section === */}
      <div className="feature-container">
        <div className="feature-item">
          <GiSoccerField className="feature-icon" />
          <h2>Tìm kiếm vị trí sân</h2>
          <p>Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm kiếm theo khu vực mong muốn</p>
        </div>

        <div className="divider"></div>

        <div className="feature-item">
          <FaRegCalendarAlt className="feature-icon" />
          <h2>Đặt lịch online</h2>
          <p>Không cần đến trực tiếp, bạn có thể đặt sân bất kỳ đâu thông qua internet</p>
        </div>

        <div className="divider"></div>

        <div className="feature-item">
          <FaRunning className="feature-icon" />
          <h2>Tìm đối, bắt cặp đấu</h2>
          <p>Kết nối cộng đồng thể thao sôi nổi, mạnh mẽ và mở rộng quan hệ</p>
        </div>
      </div>


      {/* === Register Section === */}
      <div className="register-banner">
        <img src="/images/f1.png" alt="player" className="player-img" />

        <div className="register-content">
          <h2>Bạn muốn đăng ký sử dụng phần mềm quản lý sân <br /> Datsan247 MIỄN PHÍ?</h2>

          <div className="register-form">
            <input type="text" placeholder="Họ & tên *" />
            <input type="text" placeholder="Số điện thoại *" />
            <input type="email" placeholder="Email" />
            <button>GỬI</button>
          </div>
        </div>
      </div>
    </div>
  );
}
