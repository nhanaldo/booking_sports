import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFieldDetail() {
    const { type, id } = useParams();
    const [field, setField] = useState({});
    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ start: "", end: "", price: "" });
    const nav = useNavigate();

    // 🟢 Lấy thông tin sân + danh sách khung giờ
    useEffect(() => {
        API.get(`/admin/fields/${type}/${id}`).then((res) => setField(res.data));
        API.get(`/timeslots/${type}`).then((res) => setTimeSlots(res.data));

    }, [type, id]);

    // 🟡 Cập nhật thông tin sân
    const handleChange = (e) => {
        setField({ ...field, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await API.put(`/admin/fields/${type}/${id}`, field);
        alert("✅ Cập nhật thông tin sân thành công!");
        nav(`/admin/edit-fields/${type}`);
    };

    // 🕒 Xử lý khung giờ
    const handleAddSlot = async () => {
        if (!newSlot.start || !newSlot.end || !newSlot.price) {
            alert("Vui lòng nhập đầy đủ thông tin khung giờ!");
            return;
        }

        await API.post(`/timeslots/${type}`, newSlot);

        const updated = await API.get(`/admin/fields/${type}/${id}/times`);
        setTimeSlots(updated.data);
        setNewSlot({ start: "", end: "", price: "" });
    };

    const handleDeleteSlot = async (slotId) => {
        if (window.confirm("Bạn có chắc muốn xóa khung giờ này?")) {
            await API.delete(`/timeslots/${type}/${slotId}`);

            setTimeSlots(timeSlots.filter((s) => s._id !== slotId));
        }
    };




    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">⚽ Sửa sân</h2>

            {/* Thông tin sân */}
            <form onSubmit={handleSave} className="space-y-3 mb-8">
                <input
                    type="text"
                    name="name"
                    value={field.name || ""}
                    onChange={handleChange}
                    placeholder="Tên sân"
                    className="w-full border p-2 rounded-md"
                />
                <input
                    type="text"
                    name="location"
                    value={field.location || ""}
                    onChange={handleChange}
                    placeholder="Khu"
                    className="w-full border p-2 rounded-md"
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md">
                    💾 Lưu thay đổi
                </button>
            </form>

           
        </div>
    );
}
