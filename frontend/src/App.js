import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "./api";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Fields from "./pages/Fields";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import AddField from "./pages/AddField";
import EditField from "./pages/EditField";
import AdminBookings from "./pages/AdminBookings";
import FootballFields from "./pages/FootballFields";
import BasketballField from "./pages/BasketballField";
import TennisField from "./pages/TennisField";
import CancelledBookings from "./pages/CancelledBookings";

/* -------------------- NAVBAR -------------------- */
function Nav({ token, role, name, setToken, setRole, setName }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setToken(null);
    setRole(null);
    setName(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Cột trái */}
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/fields">Sân</Link>

       {token && <Link to="/my-bookings">Lịch của tôi</Link>}
        {token && <Link to="/cancelled-bookings">Lịch sử hủy</Link>}
       
        {token && role === "admin" && (
          <>
            <Link to="/add-field">Thêm sân</Link>
            <Link to="/admin/bookings">DS đặt sân</Link>
          </>
        )}
      </div>

      {/* Cột phải */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {token ? (
          <>
            <span style={{ fontWeight: "bold", color: "#1976d2" }}>
              👋 Xin chào, {name || "Người dùng"}
            </span>
            <button
              onClick={logout}
              style={{
                background: "#958180ff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Đăng ký</Link>
            <Link to="/login">Đăng nhập</Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* -------------------- APP -------------------- */
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [loading, setLoading] = useState(true);

  // Kiểm tra token hợp lệ khi mở app
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/verify", {
          headers: { Authorization: "Bearer " + savedToken },
        });
        setToken(savedToken);
        setRole(res.data.role);
        setName(res.data.user?.name || "");
        localStorage.setItem("name", res.data.user?.name || "");
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setToken(null);
        setRole(null);
        setName(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) return <p>Đang kiểm tra phiên đăng nhập...</p>;

  return (
    <BrowserRouter>
      <Nav token={token} role={role} name={name} setToken={setToken} setRole={setRole} setName={setName} />
      <div style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/football" element={<FootballFields />} />
          <Route path="/basketball" element={<BasketballField />} />
          <Route path="/tennis" element={<TennisField />} />
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} setName={setName} />} />
          <Route path="/add-field" element={<AddField />} />
          <Route path="/edit-field/:id" element={<EditField />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/cancelled-bookings" element={<CancelledBookings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
