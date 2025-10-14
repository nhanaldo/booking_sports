import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken, setRole, setName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // ✅ Lưu thông tin user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.user.name);

      // ✅ Cập nhật state cho App.jsx để Nav hiển thị tên
      setToken(res.data.token);
      setRole(res.data.role);
      setName(res.data.user.name);

      alert("Đăng nhập thành công!");
      nav("/fields");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: 8,
        maxWidth: 320,
        margin: "40px auto",
        textAlign: "center"
      }}
    >
      <h2>Đăng nhập</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button style={{ background: "#4caf50", color: "#fff", padding: "8px" }}>
        Đăng nhập
      </button>

      {/* 👇 Nút quên mật khẩu */}
      <div style={{ marginTop: 10 }}>
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </div>
    </form>
  );
}
