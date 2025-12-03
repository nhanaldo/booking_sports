import "./Footer.css";
import { useEffect } from "react";

export default function Footer() {

  // Reveal animation on scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if(rect.top < window.innerHeight - 60){
          el.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <footer className="footer-container">

      <div className="lighting-bar"></div>

      <div className="footer-content reveal">

        {/* Brand zone */}
        <div className="footer-col">
          <h3 className="footer-title brand-title">⚽ SPORTFIELD</h3>
          <p className="footer-desc">
            “Nơi đam mê được kết nối – nơi mọi trận đấu bắt đầu.”
          </p>
          <p className="slogan">PLAY HARD — WIN SMART — BOOK FAST</p>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h3>🔥 HỖ TRỢ</h3>
          <ul>
            <li>Chính sách & Điều khoản</li>
            <li>Hướng dẫn đặt sân</li>
            <li>Hỗ trợ thanh toán</li>
            <li>Dành cho chủ sân</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h3>📩 NHẬN THÔNG BÁO ƯU ĐÃI</h3>
          <div className="newsletter-box">
            <input type="email" placeholder="Nhập email của bạn..." />
            <button>Đăng ký</button>
          </div>
          <small>Ưu đãi độc quyền mỗi tuần ⚡</small>
        </div>

        {/* Contact */}
        <div className="footer-col contact-box">
          <h3>☎ LIÊN HỆ</h3>
          <p className="hotline">Hotline: <span>0988 123 456</span></p>
          <button className="pulse-btn">Gọi ngay</button>
          <div className="social-icons">
            <i className="ri-facebook-circle-fill"></i>
            <i className="ri-instagram-fill"></i>
            <i className="ri-tiktok-fill"></i>
            <i className="ri-youtube-fill"></i>
          </div>
        </div>
      </div>

      <div className="footer-credits reveal">
        🏆 © 2025 SportField – Your Field, Your Game.
      </div>
    </footer>
  );
}
