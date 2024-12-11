const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const JobPosting = require('./src/models/JobPosting'); // JobPosting 모델 경로
const Company = require('./src/models/Company'); // Company 모델 경로

// MongoDB 연결
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'jobDB' // jobDB 데이터베이스 사용
})
  .then(async () => {
    console.log('MongoDB에 성공적으로 연결되었습니다.');

    // 모든 JobPosting 문서 가져오기
    const jobs = await JobPosting.find();

    for (let job of jobs) {
      // companyName으로 Company 문서 찾기
      const company = await Company.findOne({ name: job.companyName });
      if (!company) {
        console.log(`회사 "${job.companyName}"을(를) 찾을 수 없습니다. 스킵합니다.`);
        continue;
      }

      // 필드 이름 변경 및 값 매핑
      job.url = job.link; // link 필드를 url로 변경
      job.company = company._id; // Company 문서의 ObjectId를 company 필드에 설정
      job.deadline = new Date(job.dueDate); // dueDate를 Date 객체로 변환
      job.techStack = job.tags; // tags를 techStack에 매핑

      // 필요 없는 필드 제거
      job.link = undefined;
      job.companyName = undefined;
      job.dueDate = undefined;
      job.tags = undefined;

      // 변경사항 저장
      await job.save();
      console.log(`JobPosting ${job._id} 업데이트 완료.`);

      // 추가 작업 수행
      console.log(`회사 "${company.name}"에 대한 작업 수행 중...`);
    }

    console.log('모든 문서 변환 완료.');
    mongoose.disconnect(); // MongoDB 연결 종료
  })
  .catch((err) => {
    console.error('MongoDB 연결 오류:', err);
  });
