import { useState } from "react";
import API from "../api";

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
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
      <h2>Quên mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button>Gửi link đặt lại</button>
    </form>
  );
}
