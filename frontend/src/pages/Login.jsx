import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login({ setToken, setRole, setName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.user.name);

      setToken(res.data.token);
      setRole(res.data.role);
      setName(res.data.user.name);

      nav("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-form">
            <div className="brand">
              <div className="logo">SB</div>
              <h1>Sports Booking</h1>
            </div>

            <h2>Đăng nhập</h2>

            <form onSubmit={submit}>
              <div className="field">
                <label className="input-row">
                  <span className="icon">📧</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="field">
                <label className="input-row">
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="actions">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Đăng nhập"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => nav('/fields')}>
                  Xem danh sách sân (không đăng nhập)
                </button>
              </div>

              <div className="alt">
                Chưa có tài khoản? <Link to="/register" className="link">Đăng ký</Link>
                <div style={{marginTop:8}}>
                  <Link to="/forgot-password" className="link">Quên mật khẩu?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="auth-right">
          <div className="hero-title">Đặt sân nhanh, dễ dàng</div>
          <div className="hero-sub">Tìm và đặt sân bóng, tennis, cầu lông... mọi lúc, mọi nơi.</div>
        </div>
      </div>
    </div>
  );
}
