import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./FieldDetail.css";
import fieldImages from "../utils/fieldImages";
import typeMap from "../utils/typeMap";

export default function FieldDetail() {
  const { id } = useParams();
  const [field, setField] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    API.get(`/fields/${id}`)
      .then((res) => {
        console.log("DETAIL FIELD:", res.data);
        setField(res.data);
      })
      .catch((err) => console.error("Lỗi tải thông tin sân:", err));
  }, [id]);

  if (!field) return <div className="loading">Đang tải thông tin...</div>;

  const typeKey = typeMap[field.sport_type] || "default";

  return (
    <div className="detail-container">

  {/* ========== LEFT IMAGE ========== */}
  <div className="detail-left">
    <img
      src={fieldImages[typeKey]}
      alt={field.field_name}
      className="detail-image"
    />

    <p className="detail-caption">
      Sân đạt chuẩn thi đấu – mặt sân chất lượng cao, chiếu sáng hiện đại.
    </p>
  </div>

  {/* ========== RIGHT INFO ========== */}
  <div className="detail-right smooth-right">
    <h1 className="detail-title">{field.field_name}</h1>

    <div className="detail-info">
      <p><b>🏷 Loại sân:</b> {field.sport_type}</p>
      <p><b>📍 Địa chỉ:</b> {field.field_location || "Chưa có địa chỉ"} "Làng thể thao Tuyên Sơn" </p> 
      <p><b>📞 Liên hệ:</b> {field.phone || "0397541548"}</p>
      <p><b>⏱ Giờ mở cửa:</b> 6:00 - 22:00</p>
    </div>

    <button
      className="btn-booknow"
      onClick={() => nav(`/book/${id}`)}
    >
      🏆 Đặt sân ngay
    </button>

    {/* ======= GOOGLE MAP NHỎ ======= */}
    <div className="mini-map-box">
      <h3>📌 Vị trí sân</h3>
      <iframe
        title="mini-map"
        width="100%"
        height="200"
        loading="lazy"
        style={{ borderRadius: "10px" }}
        allowFullScreen
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.1090538475945!2d108.215561!3d16.038792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219cbe7168f1f%3A0xbcd00f9ba7ddfbaf!2zU-G7kyBUaOG6oW8gVGhp4bq_biBTxqFu!5e0!3m2!1svi!2s!4v1700000000000"
      ></iframe>
    </div>

  </div>

</div>

  );
}
