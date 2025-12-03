import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.css";
import { FaHome } from "react-icons/fa";

export default function Header({ token, role, name, setToken, setRole, setName }) {
    const nav = useNavigate();

    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const logout = () => {
        localStorage.clear();
        if (setToken) setToken(null);
        if (setRole) setRole(null);
        if (setName) setName(null);
        nav("/home");
    };

    const isLoggedIn = token && token !== "null" && token !== "undefined";

    const requireLogin = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowLoginPopup(true);
        }
    };

    return (
        <>
            <header className="header">

                {/* ================= TOP BAR ================= */}
                <div className="header-top-bar">
                    <div className="left-group">
                        <img src="/images/g1.png" alt="Banner" className="header-logo" />
                        <span className="header-brand">TyEnd Sports</span>
                    </div>

                    <div className="changing-text">Welcome to TyEnd Sports !!!</div>

                    {!isLoggedIn && (
                        <div className="top-auth-buttons">
                            <Link to="/login" className="top-auth-btn">Đăng nhập</Link>
                            <Link to="/register" className="top-auth-btn">Đăng ký</Link>
                        </div>
                    )}
                </div>

                {/* ================= MENU CHÍNH ================= */}
                <div className="header-inner">
                    <div className="header-left">
                        <Link to="/home" className="home-link">
                            <FaHome className="home-icon" />
                            <span>Trang chủ</span>
                        </Link>

                        {/* 👉 Khách hàng: Danh Sách Sân Bãi — Admin: Sân */}
                        {role === "admin" ? (
                            <Link to="/fields">Sân</Link>
                        ) : (
                            <Link to="/fields">Danh Sách Sân Bãi</Link>
                        )}

                        {/* KHÔNG cho admin xem "Lịch của tôi" */}
                        {role !== "admin" && (
                            <Link to="/my-bookings" onClick={requireLogin}>
                                Lịch của tôi
                            </Link>
                        )}

                        <Link to="/cancelled-bookings" onClick={requireLogin}>
                            Lịch sử hủy
                        </Link>

                        <Link to="/highlights">🌟 Thông tin </Link>

                        {/* 👉 CHỈ CHỈNH ĐÚNG PHẦN BẠN YÊU CẦU */}
                        {role === "admin" ? (
                            <Link to="/promotions">➕ Thêm khuyến mãi</Link>
                        ) : (
                            <Link to="/promotions">🌟 Khuyến mãi</Link>
                        )}

                        {role !== "admin" && (
                            <Link to="/reviews">🌟 Đánh giá</Link>
                        )}

                        {/* ADMIN DROPDOWN */}
                        {isLoggedIn && role === "admin" && (
                            <div className="admin-dropdown">
                                <span className="dropdown-title">⚙️ Quản lý chung ▾</span>

                                <div className="dropdown-menu">
                                    <Link to="/add-field">➕ Thêm sân</Link>
                                    <Link to="/admin/bookings">📋 DS đặt sân</Link>
                                    <Link to="/admin/edit-fields">✏️ Sửa sân</Link>
                                    <Link to="/admin/reviews">⭐ Xem đánh giá</Link>
                                    <Link to="/admin/revenue">💰 Xem doanh thu</Link>
                                      <Link to="/admin/users">👤 Xem tài khoản KH</Link>

                                </div>
                            </div>
                        )}
                    </div>


                    {isLoggedIn && (
                        <div className="header-right">
                            <span>👋 Xin chào, <strong>{name}</strong></span>
                            <button onClick={logout}>Đăng xuất</button>
                        </div>
                    )}
                </div>
            </header>

            <div className="header-spacing"></div>

            {/* ================= POPUP ĐĂNG NHẬP ================= */}
            {showLoginPopup && (
                <div className="login-popup-overlay">
                    <div className="login-popup">
                        <h2>⚠️ Bạn cần đăng nhập</h2>
                        <p>Vui lòng đăng nhập để tiếp tục sử dụng chức năng này.</p>

                        <div className="popup-buttons">
                            <button className="popup-btn login" onClick={() => nav("/login")}>
                                Đăng nhập
                            </button>
                            <button className="popup-btn register" onClick={() => nav("/register")}>
                                Đăng ký
                            </button>
                            <button className="popup-btn back" onClick={() => setShowLoginPopup(false)}>
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
