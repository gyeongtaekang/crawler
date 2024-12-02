const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting'); // JobPosting 모델 임포트
require('dotenv').config();

// MongoDB 연결 설정
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 검색 키워드 설정
const keyword = '데이터 분석';

// 페이지 순회
(async () => {
  try {
    for (let pageNum = 1; pageNum <= 5; pageNum++) {
      const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(
        keyword
      )}&recruitPage=${pageNum}&recruitSort=relation&recruitPageCount=100`;

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      };

      const response = await axios.get(url, { headers });
      const $ = cheerio.load(response.data);
      const results = $('div.item_recruit');

      for (let i = 0; i < results.length; i++) {
        try {
          const element = results[i];
          const jobElement = $(element);

          const companyName = jobElement
            .find('strong.corp_name')
            .text()
            .trim();

          const title = jobElement.find('h2.job_tit a').attr('title');

          const link =
            'https://www.saramin.co.kr' +
            jobElement.find('h2.job_tit a').attr('href');

          const location =
            jobElement
              .find('div.job_condition span.work_place')
              .text()
              .trim() || '미지정';

          const experience =
            jobElement
              .find('div.job_condition span.experience')
              .text()
              .trim() || '신입/경력';

          const education =
            jobElement
              .find('div.job_condition span.education')
              .text()
              .trim() || '학력무관';

          const employmentType =
            jobElement
              .find('div.job_condition span.employment_type')
              .text()
              .trim() || '정규직';

          const dueDate =
            jobElement
              .find('div.job_date span.date')
              .text()
              .trim() || '상시채용';

          const jobSector =
            jobElement.find('div.job_sector').text().trim() || '미지정';

          const salary =
            jobElement
              .find('div.job_condition span.salary')
              .text()
              .trim() || '회사내규에 따름';

          // 데이터 객체 생성
          const jobData = {
            companyName,
            title,
            link,
            location,
            experience,
            education,
            employmentType,
            dueDate,
            jobSector,
            salary,
          };

          // MongoDB에 데이터 저장 - 링크를 기준으로 중복 체크
          await JobPosting.updateOne(
            { link: jobData.link }, // 중복 체크 조건
            { $set: jobData }, // 데이터 업데이트
            { upsert: true } // 없으면 새로 생성
          );

          console.log(`Job saved: ${title}`);

          // 요청 간 간격 조절 (필요에 따라)
          // await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error processing job: ${error.message}`);
        }
      }

      console.log(
        `페이지 ${pageNum} - '${keyword}'의 채용공고 크롤링을 완료했습니다.`
      );

      // 페이지 간 간격 조절 (필요에 따라)
      // await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log('사람인 크롤링 데이터가 MongoDB에 저장되었습니다.');
    mongoose.connection.close();
  } catch (error) {
    console.error(`Crawler Error: ${error.message}`);
    mongoose.connection.close();
  }
})();
