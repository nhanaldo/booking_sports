import jwt from "jsonwebtoken";

export default function auth(req, res, next)  {

  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gán {id, role} vào req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
}
