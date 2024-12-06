// middlewares/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (requireAdmin = false) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 토큰 존재 여부 확인
    if (!authHeader) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer TOKEN' 형식

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // 관리자 권한 필요시 체크
      if (requireAdmin && !req.user.isAdmin) {
        return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  };
};
