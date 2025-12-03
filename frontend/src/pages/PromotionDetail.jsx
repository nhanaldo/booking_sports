import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

export default function PromotionDetail() {
  const { id } = useParams();
  const [promo, setPromo] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await API.get(`/promotions/${id}`);
        setPromo(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };
    fetchPromo();
  }, [id]);

  if (!promo)
    return <p className="text-white text-center mt-10">Đang tải...</p>;

  return (
    <motion.div
      className="w-full min-h-screen bg-[#0e1b25] text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Nút quay lại */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => nav(-1)}
          className="bg-cyan-500 px-4 py-2 rounded-lg text-white hover:bg-cyan-600"
        >
          ⬅ Quay lại
        </button>
      </div>

      {/* Ảnh chính full màn */}
      <motion.div
        className="w-full h-[90vh] relative"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 text-center max-w-3xl px-4 drop-shadow-lg">
            {promo.title}
          </h1>
        </div>
      </motion.div>

      {/* Nội dung */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          className="text-gray-200 leading-relaxed text-lg whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: promo.description }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        ></motion.div>

        {/* Ảnh nhỏ bên dưới */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {promo.subImages?.map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`sub-${idx}`}
              className="w-full h-64 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
