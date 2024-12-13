// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Platform API',
      version: '1.0.0',
      description: 'API documentation for the Job Platform project',
    },
    servers: [
      {
        url: 'http://113.198.66.75:17120',
        description: 'Production server',
      },
      // 개발 서버 추가 (선택 사항)
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [ // 태그 정의
      {
        name: 'Authentication',
        description: '회원 가입/로그인 관련 API',
      },   
      {
        name: 'Job Postings',
        description: '채용 공고 관련 API',
      },
      {
        name: 'Applications',
        description: '지원 관련 API',
      },
    ],
    components: {
      schemas: {
        JobPosting: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '공고 ID',
              example: '6752c0ee0dfbdda05c8a33ac',
            },
            title: {
              type: 'string',
              description: '공고 제목',
              example: 'Front-end 개발자 채용 (Javascript, React)',
            },
            location: {
              type: 'string',
              description: '근무 지역',
              example: '서울 강남구',
            },
            salary: {
              type: 'string',
              description: '급여',
              example: 'null',
            },
            url: {
              type: 'string',
              description: '공고 URL',
              example: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=search&rec_idx=49212705&location=ts&searchword=react&searchType=search&paid_fl=n&search_uuid=a2fcbe11-b2d6-44a1-9aa2-4e7778fed790',
            },
            techStack: {
              type: 'array',
              description: '기술 스택',
              items: {
                type: 'string',
              },
              example: ['javascript', 'java', 'react'],
            },
            employmentType: {
              type: 'string',
              description: '고용 형태',
              example: '정규직',
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: '마감일',
              example: '2001-12-24T15:00:00.000Z',
            },
            approved: {
              type: 'boolean',
              description: '승인 여부',
              example: true,
            },
            relatedJobs: {
              type: 'array',
              description: '관련 공고 목록',
              items: {
                $ref: '#/components/schemas/JobPosting', // JobPosting을 참조
              },
            },
          },
        },
        Application: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Application ID',
              example: '64d9f2b2a3c9c2340e654321',
            },
            user: {
              type: 'string',
              description: '사용자 ID',
              example: '64c1f2b3e2a1c1230f123789',
            },
            job: {
              $ref: '#/components/schemas/JobPosting',
              description: '지원한 공고',
            },
            resume: {
              type: 'string',
              description: '이력서 링크',
              example: 'https://example.com/resumes/user123.pdf',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
              description: '지원 상태',
              example: 'Pending',
            },
            appliedAt: {
              type: 'string',
              format: 'date-time',
              description: '지원한 날짜 및 시간',
              example: '2023-12-05T10:15:30Z',
            },
          },
        },
        Bookmark: { // Bookmark 스키마 추가
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Bookmark ID',
              example: '64e1f2b3e2a1c1230f123456',
            },
            user: {
              type: 'string',
              description: '사용자 ID',
              example: '64c1f2b3e2a1c1230f123789',
            },
            job: {
              $ref: '#/components/schemas/JobPosting',
              description: '즐겨찾기한 공고',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '즐겨찾기 추가 날짜 및 시간',
              example: '2023-12-10T12:34:56Z',
            },
          },
        },
        User: { // User 스키마 수정
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: 'gyeongtae', // 변경: 기존 ObjectId에서 'gyeongtae'로 수정
            },
            email: {
              type: 'string',
              description: 'User Email',
              example: 'gyeongtae@example.com', // 변경: 이메일 예시 수정
            },
            name: { // 추가 필드 예시
              type: 'string',
              description: '사용자 이름',
              example: 'gyeongtae', // 변경: 이름 예시 수정
            },
            // 필요한 다른 필드를 추가하세요 (예: 생성일, 업데이트일 등)
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [`${__dirname}/../routes/*.js`], // Swagger 주석이 있는 파일 경로
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
