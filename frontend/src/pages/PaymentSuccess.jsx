import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Thanh toán thành công!
      </h1>
      <p className="text-lg">Cảm ơn bạn đã đặt sân qua hệ thống.</p>
      <a
        href="/fields"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Quay lại trang chủ
      </a>
    </div>
  );
}
