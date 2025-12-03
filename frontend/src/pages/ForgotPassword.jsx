import { useState } from "react";
import API from "../api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email });
      alert("Hãy kiểm tra email để đặt lại mật khẩu");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gửi email");
    }
  };

  return (
    <div className="fp-container">
      {/* LEFT */}
      <div className="fp-left">
        <form className="fp-card" onSubmit={submit}>
          <h2 className="fp-title">Quên mật khẩu</h2>

          <input
            type="email"
            className="fp-input"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="fp-btn">Gửi link đặt lại</button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="fp-right">
        <h1 className="fp-banner-title">Lấy lại mật khẩu dễ dàng</h1>
        <p className="fp-banner-desc">
          Nhập email và chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.
        </p>
      </div>
    </div>
  );
}
