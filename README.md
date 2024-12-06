# crawler

# API 사용 가이드

## 기본 정보

- **Base URL**: `http://localhost:443`
- 모든 요청은 JSON 형태의 Request/Response를 기본으로 가정합니다.
- **인증 필요**: 로그인 후 응답받은 `accessToken`을 이용해 인증이 필요한 API 호출 시 `Authorization` 헤더에 `Bearer <accessToken>` 형태로 전달합니다.

## 회원 관련 API

### 회원가입

**요청**:  
POST /auth/register  
Content-Type: application/json

**Request Body**:
{
  "email": "gyeong@example.com",
  "password": "password123",
  "name": "강경태"
}

**Response (성공)**:
{
  "message": "회원가입이 완료되었습니다."
}

### 로그인

**요청**:  
POST /auth/login  
Content-Type: application/json

**Request Body**:
{
  "email": "gyeong@example.com",
  "password": "password123"
}

**Response (성공)**:
{
  "message": "로그인 성공",
  "accessToken": "eyJhbGciOiJI... (토큰)",
  "tokenType": "Bearer",
  "authorization": "Bearer eyJhbGciOiJI..."
}

로그인 후 응답받은 accessToken을 이후 요청의 Authorization 헤더에 `Bearer <accessToken>` 형태로 추가하세요.

### 회원 정보 조회

**요청**:  
GET /users/profile  
Authorization: Bearer <accessToken>

**Response**:
{
  "status": "success",
  "data": {
    "_id": "...",
    "email": "gyeong@example.com",
    "name": "강경태",
    "createdAt": "...",
    "updatedAt": "..."
  }
}

### 회원 탈퇴

**요청**:  
DELETE /users/me  
Authorization: Bearer <accessToken>

**Response**:
{
  "message": "회원 탈퇴 완료"
}

### 회원 정보 수정 (예시)

**요청**:  
PUT /users/profile  
Authorization: Bearer <accessToken>  
Content-Type: application/json

**Request Body**:
{
  "name": "새로운 이름"
}

**Response**:
{
  "message": "회원 정보가 수정되었습니다."
}

## 채용 공고 관련 API

### 채용 공고 목록 조회

**요청**:  
GET /jobs

**Query Params (옵션)**:  
- page: 페이지 번호 (예: ?page=2)
- limit: 페이지 당 항목 수 (예: ?limit=10)
- search: 검색어 (예: ?search=백엔드)
- location: 지역 필터 (예: ?location=서울)
- experience: 경력 필터 (예: ?experience=3년)
- sort: 정렬 기준 필드명 (예: ?sort=createdAt)

**예)**  
GET /jobs?search=백엔드&location=서울&sort=createdAt&page=1&limit=10

**Response**:
{
  "status": "success",
  "data": [ ... 채용공고 목록 ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": ...,
    "totalItems": ...
  }
}

### 채용 공고 상세 조회

**요청**:  
GET /jobs/:id

**Response**:
{
  "status": "success",
  "data": {
    "_id": "공고ID",
    "title": "프론트엔드 개발자",
    "companyName": "ABC Corp",
    ...
  }
}

### 채용 공고 등록 (관리자 전용)

**요청**:  
POST /jobs  
Authorization: Bearer <adminAccessToken>  
Content-Type: application/json

**Request Body**:
{
  "companyName": "MyCompany",
  "title": "백엔드 개발자",
  "location": "서울",
  "experience": "3년",
  "link": "http://example.com/job/123"
}

**Response**:
{
  "message": "채용공고 등록 성공",
  "data": {...}
}

### 채용 공고 수정 (관리자 전용)

**요청**:  
PUT /jobs/:id  
Authorization: Bearer <adminAccessToken>  
Content-Type: application/json

**Request Body (예)**:
{
  "title": "백엔드 개발자(고경력)"
}

**Response**:
{
  "message": "채용공고 수정 성공",
  "data": {...}
}

### 채용 공고 삭제 (관리자 전용)

**요청**:  
DELETE /jobs/:id  
Authorization: Bearer <adminAccessToken>

**Response**:
{
  "message": "채용공고 삭제 성공"
}

### 데이터 집계 API

**요청**:  
GET /jobs/stats/aggregate

**Response**:
{
  "status": "success",
  "data": [
    {
      "_id": "서울",
      "count": 10
    },
    {
      "_id": "부산",
      "count": 5
    }
  ]
}

## 지원 관련 API

### 지원하기

**요청**:  
POST /applications  
Authorization: Bearer <accessToken>  
Content-Type: application/json

**Request Body**:
{
  "jobPostingId": "공고ID"
}

**Response**:
{
  "message": "지원이 완료되었습니다."
}

### 지원 내역 조회

**요청**:  
GET /applications  
Authorization: Bearer <accessToken>

**Response**:
{
  "status": "success",
  "data": [
    {
      "user": {
        "name": "강경태",
        "email": "gyeong@example.com"
      },
      "jobPosting": {
        "_id": "공고ID",
        "title": "..."
      },
      ...
    }
  ]
}

### 지원 취소

**요청**:  
DELETE /applications/:id  
Authorization: Bearer <accessToken>

**Response**:
{
  "message": "지원이 취소되었습니다."
}

## 북마크 관련 API

### 북마크 추가/제거

**요청**:  
POST /bookmarks  
Authorization: Bearer <accessToken>  
Content-Type: application/json

**Request Body**:
{
  "jobPostingId": "공고ID"
}

**Response (북마크 없었다면)**:
{
  "message": "북마크가 추가되었습니다."
}

이미 있었다면:
{
  "message": "북마크가 제거되었습니다."
}

### 북마크 목록 조회

**요청**:  
GET /bookmarks  
Authorization: Bearer <accessToken>

**Response**:
{
  "status": "success",
  "data": [ ... 북마크 목록 ... ]
}

## 알림 관련 API

### 알림 목록 조회

**요청**:  
GET /notifications  
Authorization: Bearer <accessToken>

**Response**:
{
  "status": "success",
  "data": [
    {
      "_id": "알림ID",
      "message": "새로운 채용공고가 등록되었습니다.",
      "isRead": false,
      "user": "사용자ID"
    }
  ]
}

### 알림 읽음 처리

**요청**:  
PUT /notifications/:id/read  
Authorization: Bearer <accessToken>

**Response**:
{
  "message": "알림을 읽음 처리했습니다."
}

---

## 인증 토큰 사용 방법 요약

1. 로그인 후 `POST /auth/login` 요청으로 `accessToken` 획득.
2. 인증 필요한 API 호출 시 `Authorization: Bearer <accessToken>` 형태로 헤더 설정.

예:
GET /users/profile  
Authorization: Bearer eyJhbGciOiJI...
