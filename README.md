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
   npm install dotenv
   npm start
   ```

### Swagger 문서

- Swagger UI 주소: [http://113.198.66.75:17120/api-docs/#/](http://113.198.66.75:17120/api-docs/#/)

### 사용 방법

1. **회원가입 API**를 이용하여 회원가입:
   - 회원가입이 완료되면 계정이 생성됩니다.
2. **로그인 API**를 이용하여 로그인:
   - 로그인 시 반환된 `accessToken` 값을 복사.
3. Swagger UI 사이트 상단 오른쪽의 `Authorize` 버튼 클릭.
4. `Authorize` 창이 열리면 복사한 `accessToken`을 입력:
   - `Barber`는 자동으로 입력되므로 **`accessToken`**만 입력.
5. 입력 후 `Authorize`를 클릭하면 API 사용이 가능합니다.

### 주의 사항

- `accessToken`은 각 API 호출 시 인증에 필요하므로 반드시 올바르게 입력하세요.
- `npm install`을 실행하여 의존성을 설치하지 않으면 서비스가 정상적으로 작동하지 않습니다.
