import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "./api";

// Pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Fields from "./pages/Fields";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import AddField from "./pages/AddField";
import AdminBookings from "./pages/AdminBookings";
import FootballFields from "./pages/FootballFields";
import BasketballField from "./pages/BasketballField";
import TennisField from "./pages/TennisField";
import CancelledBookings from "./pages/CancelledBookings";
import SelectFieldType from "./pages/SelectFieldType";
import EditFieldList from "./pages/EditFieldList";
import EditFieldDetail from "./pages/EditFieldDetail";
import EditTimeSlot from "./pages/EditTimeSlot";
import PaymentSuccess from "./pages/PaymentSuccess";
import Highlights from "./pages/Highlights";
import PromotionDetail from "./pages/PromotionDetail";
import PaymentPage from "./pages/PaymentPage";
import Promotions from "./pages/Promotions";
import Home from "./pages/Home";
import FieldDetail from "./pages/FieldDetail";
import Reviews from "./pages/Reviews";
import AdminReviews from "./pages/AdminReviews";
import AdminRevenue from "./pages/AdminRevenue";
import AddPromotion from "./pages/AddPromotion";
import AdminUsers from "./pages/AdminUsers";
import EditPromotion from "./pages/EditPromotion";


// Components
import Header from "./pages/Header";
import Footer from "./pages/Footer";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [loading, setLoading] = useState(true);

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
        localStorage.clear();
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
      {/* Header luôn hiển thị */}


      <Header
        token={token}
        role={role}
        name={name}
        setToken={setToken}
        setRole={setRole}
        setName={setName}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/football" element={<FootballFields />} />
        <Route path="/basketball" element={<BasketballField />} />
        <Route path="/tennis" element={<TennisField />} />
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} setName={setName} />} />
        <Route path="/add-field" element={<AddField />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/cancelled-bookings" element={<CancelledBookings />} />
        <Route path="/admin/edit-fields" element={<SelectFieldType />} />
        <Route path="/admin/edit-fields/:type" element={<EditFieldList />} />
        <Route path="/admin/edit-field/:type/:id" element={<EditFieldDetail />} />
        <Route path="/admin/edit-timeslot/:type/:id" element={<EditTimeSlot />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/highlights" element={<Highlights />} />
        <Route path="/promotions/:id" element={<PromotionDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/fields/:id" element={<FieldDetail />} />
        <Route path="/reviews" element={<Reviews />} />-
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/revenue" element={<AdminRevenue />} />
        <Route path="/promotions/add" element={<AddPromotion />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/promotions/edit/:id" element={<EditPromotion />} />






      </Routes>

      {/* Footer luôn hiển thị */}
      <Footer />
    </BrowserRouter>
  );
}
