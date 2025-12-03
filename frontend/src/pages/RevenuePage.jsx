import { useEffect, useState } from "react";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./RevenuePage.css";

export default function RevenuePage() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [type, setType] = useState("date"); 
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [total, setTotal] = useState(0);

  // ================== LẤY DATA BOOKING ==================
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/bookings"); 
      setBookings(res.data);
      setFiltered(res.data);
      calcTotal(res.data);
    };
    fetchData();
  }, []);

  // ================== TÍNH DOANH THU ==================
  const calcTotal = (data) => {
    const sum = data.reduce((acc, item) => acc + (item.field_price || 0), 0);
    setTotal(sum);
  };

  // ================== LỌC THEO NGÀY ==================
  const filterByDate = () => {
    if (!selectedDate) return;
    const result = bookings.filter(
      (b) => b.booking_date.slice(0, 10) === selectedDate
    );
    setFiltered(result);
    calcTotal(result);
  };

  // ================== LỌC THEO THÁNG ==================
  const filterByMonth = () => {
    if (!selectedMonth) return;
    const result = bookings.filter((b) => {
      const month = b.booking_date.slice(0, 7); // YYYY-MM
      return month === selectedMonth;
    });
    setFiltered(result);
    calcTotal(result);
  };

  // ================== XUẤT EXCEL ==================
  const exportExcel = () => {
    const rows = filtered.map((b, i) => ({
      STT: i + 1,
      Sân: b.field_name,
      Vị_trí: b.field_location,
      Ngày: b.booking_date.slice(0, 10),
      Giờ: b.time_slot,
      Giá: b.field_price,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DoanhThu");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "DoanhThu.xlsx");
  };

  return (
    <div className="revenue-container">
      <h2>📊 Thống kê doanh thu</h2>

      {/* BỘ LỌC */}
      <div className="filter-box">
        
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="date">Theo ngày</option>
          <option value="month">Theo tháng</option>
        </select>

        {type === "date" && (
          <>
            <input type="date" value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />
            <button onClick={filterByDate}>Lọc</button>
          </>
        )}

        {type === "month" && (
          <>
            <input type="month" value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)} />
            <button onClick={filterByMonth}>Lọc</button>
          </>
        )}

        <button className="excel-btn" onClick={exportExcel}>
          📥 Xuất Excel
        </button>
      </div>

      {/* BẢNG DOANH THU */}
      <table className="revenue-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Sân</th>
            <th>Vị trí</th>
            <th>Ngày</th>
            <th>Giờ</th>
            <th>Giá (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{b.field_name}</td>
              <td>{b.field_location}</td>
              <td>{b.booking_date.slice(0, 10)}</td>
              <td>{b.time_slot}</td>
              <td>{b.field_price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TỔNG DOANH THU */}
      <div className="total-box">
        Tổng doanh thu: 
        <strong> {total.toLocaleString()} VNĐ</strong>
      </div>
    </div>
  );
}
