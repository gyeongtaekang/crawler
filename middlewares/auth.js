const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (requireAdmin = false) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer TOKEN'

  try {
    // 토큰 디코딩
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.user에 디코딩된 데이터 저장
    req.user = {
      id: decoded.id,
      name: decoded.name || 'Unknown User', // 이름이 없을 경우 기본값 설정
      email: decoded.email || 'unknown@example.com', // 이메일이 없을 경우 기본값 설정
      isAdmin: decoded.isAdmin || false
    };

    // 관리자 권한 필요 시 검사
    if (requireAdmin && !req.user.isAdmin) {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
