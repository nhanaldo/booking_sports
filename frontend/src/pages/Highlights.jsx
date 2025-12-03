import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import "./Highlights.css";

export default function Highlights() {
  const nav = useNavigate();
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/promotions");
        setHighlights(res.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="highlights-page bg-[#0e1b25] min-h-screen text-white py-10 px-6">
      <motion.button
        className="bg-cyan-500 px-4 py-2 rounded-lg mb-6"
        onClick={() => nav("/fields")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅ Quay lại
      </motion.button>

      <motion.h1
        className="text-4xl font-bold text-cyan-400 text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        🌟 Thông tin nổi bật & Khuyến mãi
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {highlights.map((item, i) => (
          <motion.div
            key={item.id}
            className="bg-[#111c2d] rounded-xl shadow-xl overflow-hidden cursor-pointer hover:shadow-cyan-500/30 transition-all"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            onClick={() => nav(`/promotions/${item.id}`)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl text-cyan-400 font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-gray-300">{item.shortDescription}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
