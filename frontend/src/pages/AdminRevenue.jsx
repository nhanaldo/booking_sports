import { useEffect, useState } from "react";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AdminRevenue.css";

export default function AdminRevenue() {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [type, setType] = useState("date");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [total, setTotal] = useState(0);

    // ================== LẤY BOOKING ==================
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

    // ================== LỌC NGÀY ==================
    const filterByDate = () => {
        if (!selectedDate) return;
        const result = bookings.filter(
            (b) => b.booking_date?.slice(0, 10) === selectedDate
        );
        setFiltered(result);
        calcTotal(result);
    };

    // ================== LỌC THÁNG ==================
    const filterByMonth = () => {
        if (!selectedMonth) return;
        const result = bookings.filter((b) => {
            const month = b.booking_date?.slice(0, 7); // YYYY-MM
            return month === selectedMonth;
        });
        setFiltered(result);
        calcTotal(result);
    };
    const showAll = () => {
        setFiltered(bookings);
        calcTotal(bookings);
    };

    // ================== XUẤT EXCEL ==================
    const exportExcel = () => {
        // Chuẩn bị mảng doanh thu 12 tháng
        const monthly = Array.from({ length: 12 }, (_, i) => ({
            Thang: `Tháng ${i + 1}`,
            Tong_Doanh_Thu: 0,
            So_Luot_Dat: 0,
        }));

        // Gom dữ liệu theo tháng
        bookings.forEach(b => {
            if (!b.booking_date) return;

            const month = new Date(b.booking_date).getMonth(); // 0 → 11
            const price = b.field_price || 0;

            monthly[month].Tong_Doanh_Thu += price;
            monthly[month].So_Luot_Dat += 1;
        });

        // Xuất Excel
        const ws = XLSX.utils.json_to_sheet(monthly);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DoanhThuTheoThang");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer]), "ThongKeDoanhThuTheoThang.xlsx");
    };


    return (
        <div className="admin-revenue-page">
            <h2>💰 Thống kê doanh thu hệ thống</h2>

            {/* ================= BỘ LỌC ================= */}
            <div className="filter-box">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="date">Theo ngày</option>
                    <option value="month">Theo tháng</option>
                </select>

                {type === "date" && (
                    <>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button onClick={filterByDate}>Lọc</button>
                        <button onClick={showAll} className="all-btn">Tất cả</button>
                    </>
                )}


                {type === "month" && (
                    <>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                        <button onClick={filterByMonth}>Lọc</button>
                        <button onClick={showAll} className="all-btn">Tất cả</button>
                    </>
                )}


                <button className="excel-btn" onClick={exportExcel}>
                    📥 Xuất Excel
                </button>
            </div>

            {/* ================= BẢNG DỮ LIỆU ================= */}
            <table className="revenue-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Sân</th>
                        <th>Giá</th>
                        <th>Vị trí</th>
                        <th>Ngày</th>
                        <th>Giờ</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((b, i) => (
                        <tr key={b._id}>
                            <td>{i + 1}</td>
                            <td>{b.field_name}</td>
                            <td>{b.field_price?.toLocaleString()} đ</td>
                            <td>{b.field_location}</td>
                            <td>{b.booking_date?.slice(0, 10) || "---"}</td>
                            <td>{b.time_slot || "---"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ================= TỔNG DOANH THU ================= */}
            <div className="total-box">
                Tổng doanh thu: <strong>{total.toLocaleString()} đ</strong>
            </div>
        </div>
    );
}
