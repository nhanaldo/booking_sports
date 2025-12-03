import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function EditTimeSlot() {
  const { type, id } = useParams(); // ✅ Lấy cả type và id từ URL
  const nav = useNavigate();
  const [slot, setSlot] = useState({ start: "", end: "", price: "" });

  // 🟢 Lấy dữ liệu cũ để hiển thị
useEffect(() => {
  if (!type || !id) return;

  API.get(`/timeslots/${type}/${id}`)
    .then((res) => {
      const data = res.data;

      setSlot({
        start: String(data.start ?? ""),
        end: String(data.end ?? ""),
        price: Number(data.price ?? 0),
      });
    })
    .catch((err) => console.error(err));
}, [type, id]);


  // 🟡 Cập nhật dữ liệu
  const handleSave = async () => {
    try {
      await API.put(`/timeslots/${type}/${id}`, slot);
      alert("✅ Cập nhật thành công!");
      nav(-1);
    } catch (err) {
      alert("❌ Lỗi khi lưu khung giờ");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">✏️ Chỉnh sửa khung giờ</h2>

      <div className="flex flex-col gap-3 max-w-sm">
        <label>
          Bắt đầu:
          <input
            type="text"
            value={slot.start}
            onChange={(e) => setSlot({ ...slot, start: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Kết thúc:
          <input
            type="text"
            value={slot.end}
            onChange={(e) => setSlot({ ...slot, end: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Giá (VND):
          <input
            type="number"
            value={slot.price}
            onChange={(e) => setSlot({ ...slot, price: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </label>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            💾 Lưu thay đổi
          </button>
          <button
            onClick={() => nav(-1)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
