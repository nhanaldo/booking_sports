import { useNavigate } from "react-router-dom";

export default function Fields() {
  const nav = useNavigate();

  
  const chooseType = (type) => {
    localStorage.setItem("selectedType", type);

    // 👉 Điều hướng theo loại sân đã chọn
    if (type === "Bóng đá") nav("/football");
    else if (type === "Bóng rổ") nav("/basketball");
    else if (type === "Tennis") nav("/tennis");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Chọn loại sân thể thao</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
        <button
          onClick={() => chooseType("Bóng đá")}
          style={{
            background: "#2196f3",
            color: "white",
            padding: "15px 25px",
            borderRadius: 8,
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ⚽ Bóng đá
        </button>

        <button
          onClick={() => chooseType("Bóng rổ")}
          style={{
            background: "#ff9800",
            color: "white",
            padding: "15px 25px",
            borderRadius: 8,
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          🏀 Bóng rổ
        </button>

        <button
          onClick={() => chooseType("Tennis")}
          style={{
            background: "#4caf50",
            color: "white",
            padding: "15px 25px",
            borderRadius: 8,
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          🎾 Tennis
        </button>
      </div>
    </div>
  );
}
