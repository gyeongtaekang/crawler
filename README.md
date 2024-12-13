# Crawler

## 웹서비스 설계 과제3

### 설치 및 실행 방법

1. 파일 다운로드 후 압축 해제.
2. 가장 안쪽에 있는 `crawler-main` 폴더 안에 `.env` 파일 생성.
3. `.env` 파일에 아래 내용을 추가:
   ```
   DB_URI=mongodb://gyeongtae:gyeongtae123@0.0.0.0:3000/admin
   PORT=443
   TOKEN_EXPIRY=1h
   REFRESH_TOKEN_EXPIRY=7d
   JWT_SECRET=492890ae7bbfdc00e1b3caadd38d53428a33654b045c67951eedee3386b54ceb
   JWT_REFRESH_SECRET=1d2dd82f0beea6ee0f064b38403db4f8c29255c189fe2290b5c31ba78a955c43
   ```
4. 터미널에서 아래 명령어 실행:
   ```bash
   cd crawler-main
   npm install
   npm start
   ```
   npm install dotenv은 안되면 한번 해봐도됨.
---

### Swagger 문서

- Swagger UI 주소: [http://113.198.66.75:17120/api-docs/#/](http://113.198.66.75:17120/api-docs/#/)

#### Swagger 사용을 위한 설치 명령어
Swagger를 사용하려면 아래 패키지를 설치해야 합니다:
```bash
npm install swagger-jsdoc swagger-ui-express
```

#### Swagger 설정 방법
`app.js` 파일에 아래 코드를 추가하여 Swagger를 설정합니다:
```javascript
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Crawler 프로젝트의 API 문서",
    },
    servers: [
      {
        url: "http://localhost:443",
        description: "Local Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // API 문서 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

#### Swagger 문서 확인 방법
1. 서버를 시작한 후 브라우저에서 아래 주소로 접속:
   ```
   http://<your-server>:<port>/api-docs
   ```
2. API 목록을 확인하고 테스트할 수 있습니다.

---

### 사용 방법

1. **회원가입 API**를 이용하여 회원가입:
   - 회원가입이 완료되면 계정이 생성됩니다.
2. **로그인 API**를 이용하여 로그인:
   - 로그인 시 반환된 `accessToken` 값을 복사.
3. Swagger UI 사이트 상단 오른쪽의 `Authorize` 버튼 클릭.
4. `Authorize` 창이 열리면 복사한 `accessToken` 입력:
   - `Barber`는 자동으로 입력되므로 **`accessToken`**만 입력.
5. 입력 후 `Authorize`를 클릭하면 API 사용이 가능합니다.

---

### 주요 명령어

#### 기본 실행 명령어
1. **서버 시작**:
   ```bash
   npm start
   ```

2. **개발 모드로 실행**:
   ```bash
   npm run dev
   ```

3. **테스트 실행**:
   ```bash
   npm test
   ```

#### 의존성 관리
1. **의존성 설치**:
   ```bash
   npm install
   ```

2. **특정 패키지 설치**:
   ```bash
   npm install <패키지 이름>
   ```

3. **특정 패키지 제거**:
   ```bash
   npm uninstall <패키지 이름>
   ```

4. **의존성 업데이트**:
   ```bash
   npm update
   ```

#### 프로젝트 초기화
1. **새 프로젝트 초기화**:
   ```bash
   npm init
   ```

2. **빠른 초기화**:
   ```bash
   npm init -y
   ```

---

# 기술 스택

- **Database**: MongoDB
- **Backend Framework**: Node.js (Express)
- **API Documentation**: Swagger
- **Authentication**: JWT


# 폴더 구조

# 📂 프로젝트 폴더 구조

```plaintext
├── 📂 node_modules           # 프로젝트 의존성 모듈 폴더 (자동 생성)
├── 📂 src                    # 주요 소스 코드 디렉토리
│   ├── 📂 config             # 환경 설정 및 초기화 관련 파일
│   │   ├── 🟨 db.js         # 데이터베이스 연결 설정
│   │   └── 🟨 swagger.js    # Swagger 설정 파일
│   ├── 📂 controllers        # 비즈니스 로직 처리 담당 컨트롤러
│   │   ├── 🟨 applicationController.js  # 지원서 관련 로직
│   │   ├── 🟨 authController.js         # 인증 및 로그인 관련 로직
│   │   ├── 🟨 bookmarkController.js     # 북마크 기능 처리
│   │   ├── 🟨 jobController.js          # 채용 공고 관련 로직
│   │   ├── 🟨 resumeController.js       # 이력서 관리 로직
│   │   └── 🟨 reviewController.js       # 리뷰 처리 로직
│   ├── 📂 middlewares         # 미들웨어 관련 파일
│   │   ├── 🟨 authMiddleware.js        # 인증 미들웨어
│   │   └── 🟨 responseMiddleware.js    # 공통 응답 처리 미들웨어
│   ├── 📂 models             # 데이터베이스 모델 정의
│   │   ├── 🟨 Application.js          # 지원서 모델
│   │   ├── 🟨 Bookmark.js             # 북마크 모델
│   │   ├── 🟨 Company.js              # 회사 정보 모델
│   │   ├── 🟨 JobCategory.js          # 직업 카테고리 모델
│   │   ├── 🟨 JobPosting.js           # 채용 공고 모델
│   │   ├── 🟨 JobStatus.js            # 채용 상태 모델
│   │   ├── 🟨 LoginHistory.js         # 로그인 기록 모델
│   │   ├── 🟨 Recruiter.js            # 채용 담당자 모델
│   │   ├── 🟨 Resume.js               # 이력서 모델
│   │   ├── 🟨 Review.js               # 리뷰 모델
│   │   └── 🟨 User.js                 # 사용자 모델
│   ├── 📂 routes             # API 라우팅 파일
│   │   ├── 🟨 applications.js        # 지원서 관련 API 라우트
│   │   ├── 🟨 auth.js                # 인증 관련 API 라우트
│   │   ├── 🟨 bookmarks.js           # 북마크 관련 API 라우트
│   │   ├── 🟨 jobs.js                # 채용 공고 관련 API 라우트
│   │   ├── 🟨 resume.js              # 이력서 관련 API 라우트
│   │   └── 🟨 review.js              # 리뷰 관련 API 라우트
│   ├── 📂 utils              # 유틸리티 함수 파일
│   │   └── 🟨 pagination.js         # 페이지네이션 관련 유틸 함수
│   └── 🟨 app.js              # Express 애플리케이션의 진입점
├── 📄 .env                    # 환경 변수 파일
├── 📄 .gitignore              # Git에 포함되지 않을 파일/폴더 설정
├── 📄 crawler.log             # 로그 파일
├── 🐍 crawler.py              # Python 크롤러 스크립트
├── 🟨 generateToken.js        # JWT 토큰 생성 유틸리티
├── 🟨 package.json            # 프로젝트 의존성 및 설정 파일
├── 🟨 package-lock.json       # 의존성 잠금 파일
└── 🟦 README.md               # 프로젝트 설명 파일
```

# API 소개

## Authentication (회원 가입/로그인 관련 API)
- **POST** `/auth/register` : 회원가입
- **POST** `/auth/login` : 로그인
- **GET** `/auth/me` : 사용자 정보 조회
- **DELETE** `/auth/me` : 사용자 계정 삭제
- **POST** `/auth/refresh` : 토큰 갱신
- **POST** `/auth/logout` : 로그아웃
- **PUT** `/auth/profile` : 사용자 정보 수정

---

## Job Postings (채용 공고 관련 API)
- **GET** `/jobs` : 공고 목록 조회 (필터링, 정렬, 페이지네이션 지원)
- **POST** `/jobs` : 채용 공고 등록
- **GET** `/jobs/{id}` : 채용 공고 검색
- **PUT** `/jobs/{id}` : 채용 공고 수정
- **DELETE** `/jobs/{id}` : 채용 공고 삭제

---

## Applications (지원 관련 API)
- **POST** `/applications` : 지원하기
- **GET** `/applications` : 지원 내역 조회
- **DELETE** `/applications/{id}` : 지원 취소
- **GET** `/applications/summary` : 지원 현황 집계

---

## Bookmarks (북마크 관련 API)
- **POST** `/bookmarks` : 북마크 추가
- **DELETE** `/bookmarks` : 북마크 제거
- **GET** `/bookmarks` : 북마크 목록 조회

---

## Reviews (리뷰 및 평점 관리)
- **POST** `/reviews` : 리뷰 작성
- **GET** `/reviews` : 리뷰 조회
- **DELETE** `/reviews/{id}` : 리뷰 삭제

---

## Resumes (이력서 관련 API)
- **POST** `/resumes` : 지원서 작성
- **GET** `/resumes` : 지원서 조회
- **DELETE** `/resumes/{id}` : 지원서 삭제


### 주의 사항

- `accessToken`은 각 API 호출 시 인증에 필요하므로 반드시 올바르게 입력하세요.
- `npm install`을 실행하지 않으면 서비스가 정상적으로 작동하지 않습니다.
