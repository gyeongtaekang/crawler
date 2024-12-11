// generateSecrets.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 비밀 키 길이 설정 (256비트 = 32바이트)
const SECRET_LENGTH = 32;

// 비밀 키 생성 함수
const generateSecret = () => {
  return crypto.randomBytes(SECRET_LENGTH).toString('hex');
};

// JWT_SECRET과 JWT_REFRESH_SECRET 생성
const JWT_SECRET = generateSecret();
const JWT_REFRESH_SECRET = generateSecret();

// .env 파일 경로 설정
const envPath = path.join(__dirname, '.env');

// 기존 .env 파일 읽기 (존재할 경우)
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
}

// .env 파일에 비밀 키 추가 또는 업데이트
const newEnvContent = `
# JWT 비밀 키
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# 기존 .env 내용 유지
${envContent}
`.trim();

// .env 파일에 쓰기
fs.writeFileSync(envPath, newEnvContent, { encoding: 'utf8' });

console.log('JWT_SECRET과 JWT_REFRESH_SECRET이 .env 파일에 성공적으로 추가되었습니다.');
console.log(`JWT_SECRET: ${JWT_SECRET}`);
console.log(`JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}`);
