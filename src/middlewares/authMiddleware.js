const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("[AUTH MIDDLEWARE] Request received");
  
  const authHeader = req.header("Authorization");
  console.log(`[AUTH MIDDLEWARE] Authorization header: ${authHeader}`);

  const token = authHeader?.split(" ")[1]; // Bearer 뒤의 토큰 추출
  if (!token) {
    console.log("[AUTH MIDDLEWARE] No token provided in the Authorization header");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  console.log("[AUTH MIDDLEWARE] Token extracted:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET 사용
    console.log("[AUTH MIDDLEWARE] Token successfully verified. Decoded payload:", decoded);

    req.user = decoded; // decoded 정보 저장
    console.log("[AUTH MIDDLEWARE] Decoded token set to req.user:", req.user);

    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE] Token verification failed:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
