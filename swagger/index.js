// index.js
// 주석: 현재 오류는 'ENOENT: no such file or directory'로, 즉 index.js에서 swagger.yaml 파일을 찾지 못하는 문제.
// 원인: 파일명 대소문자, 파일 경로 불일치 가능성. 아래 코드에서 로드하는 파일명과 실제 파일명을 맞추세요.
// 파일명이 Swagger.yaml이면 index.js에서도 'Swagger.yaml'로 불러오도록 수정하거나, 
// 파일명을 swagger.yaml로 소문자로 통일하세요.

// 이 예에서는 'Swagger.yaml'로 파일명을 맞춘다고 가정하면:
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// swagger.yaml 파일 명이 'Swagger.yaml'이라 가정
// 대소문자 정확히 맞추기 (리눅스 환경에서는 대소문자가 구분됨)
const swaggerDocument = YAML.load('./Swagger.yaml');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Recruitment API 서버 동작 중. Swagger UI 확인: /api-docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}\n/api-docs로 Swagger UI 확인하세요.`);
});
