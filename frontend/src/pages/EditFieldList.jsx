import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFieldList() {
    const { type } = useParams();
    const [fields, setFields] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ start: "", end: "", price: "" });
    const nav = useNavigate();

    // 🟢 Lấy danh sách sân
    useEffect(() => {
        API.get(`/admin/fields/${type}`)
            .then((res) => setFields(res.data))
            .catch(() => alert("Không thể tải danh sách sân"));
    }, [type]);

    // 🟢 Lấy danh sách khung giờ
    useEffect(() => {
        API.get(`/timeslots/${type}`) // "football", "basketball", "tennis"
            .then(res => setTimeSlots(res.data))
            .catch(err => {
                console.error(err.response?.data || err.message);
                alert("Không thể tải danh sách khung giờ");
            });
    }, [type]);
    const deleteField = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sân này không?")) return;
        try {
            await API.delete(`/admin/fields/${type}/${id}`);
            setFields(fields.filter((f) => f._id !== id));
            alert("🗑️ Đã xóa sân!");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("❌ Lỗi khi xóa sân!");
        }
    };
    // 🟡 Thêm khung giờ mới
    const addTimeSlot = async () => {

        if (!newSlot.start || !newSlot.end || !newSlot.price) {
            return alert("Vui lòng nhập đủ thông tin khung giờ!");
        }
        try {

            const res = await API.post(`/timeslots/${type}`, newSlot);
            setTimeSlots([res.data, ...timeSlots]);

            setNewSlot({ start: "", end: "", price: "" });
            alert("✅ Đã thêm khung giờ mới!");
        } catch (err) {
            alert("❌ Lỗi khi thêm khung giờ");
            console.error(err.response?.data || err.message);
        }
    };

    // 🔴 Xóa khung giờ
    const deleteTimeSlot = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khung giờ này?")) return;
        try {
            await API.delete(`/timeslots/${type}/${id}`);
            setTimeSlots(timeSlots.filter((s) => s._id !== id));
            alert("🗑️ Đã xóa khung giờ");
        } catch (err) {
            alert("❌ Lỗi khi xóa khung giờ");
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🏟️ Danh sách sân {type}</h2>

            {/* Danh sách sân */}
            {fields.length === 0 ? (
                <p>Không có sân nào.</p>
            ) : (
                <table className="w-full border mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Tên sân</th>
                            <th className="border p-2">Khu</th>
                            <th className="border p-2">Hành động</th>
                        </tr>
                    </thead>
                    {fields.map((f) => (
                        <tr key={f._id || f.name}>
                            <td className="border p-2">{f.name}</td>
                            <td className="border p-2">{f.location}</td>
                            <td className="border p-2 text-center">
                                <button
                                    onClick={() => nav(`/admin/edit-field/${type}/${f._id}`)}
                                    className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => deleteField(f._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}

                </table>
            )}

            {/* Danh sách khung giờ */}
            <h3 className="text-xl font-semibold mb-2">🕒 Danh sách khung giờ (giá theo giờ)</h3>
            <table className="w-full border mb-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Bắt đầu</th>
                        <th className="border p-2">Kết thúc</th>
                        <th className="border p-2">Giá (VND)</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                {timeSlots.map((slot) => (
                    <tr key={slot._id || `${slot.start}-${slot.end}`}>
                        <td className="border p-2">{slot.start || "—"}</td>
                        <td className="border p-2">{slot.end || "—"}</td>
                        <td className="border p-2">
                            {slot.price ? slot.price.toLocaleString() : "—"}
                        </td>
                        <td className="border p-2 text-center">
                            <button
                                onClick={() => nav(`/admin/edit-timeslot/${type}/${slot._id}`)}
                                className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 mr-2"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => deleteTimeSlot(slot._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}


            </table>

            {/* Thêm khung giờ mới */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Bắt đầu (vd: 17:00)"
                    value={newSlot.start}
                    onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                    className="border p-2 rounded w-32"
                />
                <input
                    type="text"
                    placeholder="Kết thúc (vd: 18:00)"
                    value={newSlot.end}
                    onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                    className="border p-2 rounded w-32"
                />
                <input
                    type="number"
                    placeholder="Giá (VND)"
                    value={newSlot.price}
                    onChange={(e) => setNewSlot({ ...newSlot, price: e.target.value })}
                    className="border p-2 rounded w-40"
                />
                <button
                    onClick={addTimeSlot}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    + Thêm khung giờ mới
                </button>
            </div>
        </div>
    );
}
