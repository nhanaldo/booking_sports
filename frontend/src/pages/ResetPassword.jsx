import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      alert("Đặt lại mật khẩu thành công");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi đặt lại mật khẩu");
    }
  };

  return (
    <div className="rp-container">
      {/* LEFT */}
      <div className="rp-left">
        <form className="rp-card" onSubmit={submit}>
          <h2 className="rp-title">Đặt lại mật khẩu</h2>

          <input
            type="password"
            className="rp-input"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="rp-btn">Xác nhận</button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="rp-right">
        <h1 className="rp-banner-title">Tạo mật khẩu mới</h1>
        <p className="rp-banner-desc">
          Hãy đặt một mật khẩu mạnh để bảo vệ tài khoản của bạn.
        </p>
      </div>
    </div>
  );
}
