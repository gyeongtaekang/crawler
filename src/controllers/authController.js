const User = require('../models/User');
const jwt = require('jsonwebtoken');
const LoginHistory = require('../models/LoginHistory');

// Refresh Token 저장 (메모리 기반)
let refreshTokens = [];

// 회원가입
exports.register = async (req, res) => {
  const { email, password } = req.body;
  console.log('회원가입 요청:', req.body); // 요청 데이터 로깅

  try {
    if (!email || !password) {
      console.log('필수 데이터 누락: 이메일 또는 비밀번호'); // 누락된 데이터 로그
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('이미 존재하는 이메일:', email); // 중복 이메일 로그
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 비밀번호를 Base64로 인코딩하여 저장
    const encodedPassword = Buffer.from(password).toString('base64');
    const newUser = new User({ email, password: encodedPassword });
    await newUser.save();

    console.log('회원가입 성공:', newUser); // 성공적으로 저장된 사용자 정보 로그
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('회원가입 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('로그인 요청:', { email, providedPassword: password }); // 요청 데이터 로깅

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('사용자를 찾을 수 없음:', email); // 사용자 없음 로그
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 저장된 비밀번호 로그
    console.log('데이터베이스 저장된 비밀번호 (Base64):', user.password);

    // Base64 복호화
    const decodedPassword = Buffer.from(user.password, 'base64').toString('utf8');
    console.log('복호화된 비밀번호:', decodedPassword); // 복호화된 비밀번호 로그

    // 입력된 비밀번호와 비교
    if (decodedPassword !== password) {
      console.log('비밀번호 불일치:', { providedPassword: password, decodedPassword }); // 비교 정보 로그
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // JWT 발급
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();
    console.log('로그인 성공: 사용자 ID', user._id); // 로그인 성공 로그

    // 로그인 이력 저장
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const device = req.headers['user-agent'] || 'Unknown Device';
    await LoginHistory.create({ user: user._id, ip, device });
    console.log('로그인 이력 저장:', { ip, device }); // 로그인 이력 저장 로그

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    console.error('로그인 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log('Refresh Token 요청:', refreshToken); // Refresh Token 요청 로그

  try {
    if (!refreshToken) {
      console.log('Refresh Token 누락'); // 누락된 Refresh Token 로그
      return res.status(400).json({ message: 'Refresh Token is required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      console.log('유효하지 않은 Refresh Token'); // 유효하지 않은 Refresh Token 로그
      return res.status(403).json({ message: 'Refresh Token is invalid' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
      if (err) {
        console.log('Refresh Token 검증 실패:', err.message); // 검증 실패 로그
        return res.status(403).json({ message: 'Invalid Refresh Token', error: err.message });
      }

      const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Access Token 재발급:', newAccessToken); // 재발급된 Access Token 로그
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Refresh Token 처리 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 로그아웃
exports.logout = async (req, res) => {
  const { token } = req.body;
  console.log('로그아웃 요청:', token); // 로그아웃 요청 로그

  try {
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      console.log('유효하지 않은 Refresh Token으로 로그아웃 요청'); // 유효하지 않은 Refresh Token 로그
      return res.status(400).json({ message: 'Invalid Refresh Token' });
    }

    user.refreshToken = null;
    await user.save();
    console.log('로그아웃 성공: 사용자 ID', user._id); // 로그아웃 성공 로그

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('로그아웃 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 프로필 업데이트
exports.updateProfile = async (req, res) => {
  const { currentPassword, newPassword, name } = req.body;
  const userId = req.user.id;
  console.log('프로필 업데이트 요청:', req.body); // 요청 데이터 로깅

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('사용자를 찾을 수 없음:', userId); // 사용자 없음 로그
      return res.status(404).json({ message: 'User not found' });
    }

    const decodedPassword = Buffer.from(user.password, 'base64').toString('utf8');
    if (currentPassword && decodedPassword !== currentPassword) {
      console.log('현재 비밀번호 불일치'); // 비밀번호 불일치 로그
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword) {
      user.password = Buffer.from(newPassword).toString('base64');
    }
    if (name) {
      user.name = name;
    }
    await user.save();
    console.log('프로필 업데이트 성공:', user); // 성공적으로 업데이트된 사용자 정보 로그

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 사용자 정보 조회
exports.getProfile = async (req, res) => {
  console.log('프로필 조회 요청: 사용자 ID', req.user.id); // 프로필 조회 요청 로그
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('사용자를 찾을 수 없음:', req.user.id); // 사용자 없음 로그
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('프로필 조회 성공:', user); // 프로필 정보 로그
    res.status(200).json(user);
  } catch (error) {
    console.error('프로필 조회 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 사용자 계정 삭제
exports.deleteProfile = async (req, res) => {
  console.log('계정 삭제 요청: 사용자 ID', req.user.id); // 계정 삭제 요청 로그
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      console.log('사용자를 찾을 수 없음:', req.user.id); // 사용자 없음 로그
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('계정 삭제 성공:', req.user.id); // 계정 삭제 성공 로그
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('계정 삭제 오류:', error); // 에러 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
