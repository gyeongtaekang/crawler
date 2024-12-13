# Crawler

## 웹서비스 설계 과제3

### 설치 및 실행 방법

1. 파일 다운로드 후 압축 해제.
2. 터미널에서 아래 명령어를 실행:
   ```bash
   cd crawler
   npm install
   npm start
   ```

### Swagger 문서

- Swagger UI 주소: [http://113.198.66.75:17120/api-docs/#/](http://113.198.66.75:17120/api-docs/#/)

### 사용 방법

1. **로그인 API**를 이용하여 로그인:
   - 로그인 시 반환된 `accessToken` 값을 복사.
2. Swagger UI 사이트 상단 오른쪽의 `Authorize` 버튼 클릭.
3. `Authorize` 창이 열리면 다음을 입력:
   - `Barber`는 자동으로 입력되므로 **`accessToken`**만 입력.
4. 입력 후 `Authorize`를 클릭하면 API 사용이 가능합니다.

### 주의 사항

- `accessToken`은 각 API 호출 시 인증에 필요하므로 반드시 올바르게 입력하세요.
- `npm install`을 실행하여 의존성을 설치하지 않으면 서비스가 정상적으로 작동하지 않습니다.
