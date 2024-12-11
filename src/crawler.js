const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const JobPosting = require('./models/JobPosting');
const Company = require('./models/Company');
const JobCategory = require('./models/JobCategory');
const Recruiter = require('./models/Recruiter');
const JobStatus = require('./models/JobStatus');

dotenv.config();

// MongoDB 연결 설정
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB에 연결되었습니다'))
    .catch((err) => console.error('MongoDB 연결 오류:', err));

// 딜레이 함수 (임의로 설정한 딜레이)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 통합된 크롤링 및 기술 스택 키워드
const techStackKeywords = [
    'python', 'java', 'javascript', 'node.js', 'react', 'vue', 'angular',
    'django', 'flask', 'spring', 'mysql', 'mongodb', 'docker', 'typescript', 'aws'
];

// 크롤링 함수
async function crawlSaramin(keyword, pages = 1) {
    const jobs = [];
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
    };
    // 1 페이지씩 크롤링
    for (let page = 1; page <= pages; page++) {
        const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${keyword}&recruitPage=${page}`;
        console.log(`페이지 ${page}를 가져오는 중: ${url}`);

        try {
            const response = await axios.get(url, { headers });
            const $ = cheerio.load(response.data);

            $('.item_recruit').each((_, el) => {
                try {
                    const companyName = $(el).find('.corp_name a').text().trim();
                    const jobTitle = $(el).find('.job_tit a').text().trim();
                    const jobUrl = 'https://www.saramin.co.kr' + $(el).find('.job_tit a').attr('href');
                    const conditions = $(el).find('.job_condition span');
                    const location = conditions.eq(0).text().trim();
                    const experience = conditions.eq(1).text().trim();
                    const education = conditions.eq(2).text().trim();
                    const employmentType = conditions.eq(3).text().trim();
                    const jobCategory = $(el).find('.job_sector').text().trim();
                    const salary = $(el).find('.salary_class_selector').text().trim();
                    const deadlineText = $(el).find('.job_date .date').text().trim();

                    // 마감일 변환 로직
                    let deadline = null;
                    if (deadlineText === '오늘마감') {
                        deadline = new Date();
                    } else if (deadlineText === '내일마감') {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        deadline = tomorrow;
                    } else if (!['채용시', '상시채용'].includes(deadlineText)) {
                        deadline = new Date(deadlineText);
                    }

                    // 키워드 기반 기술 스택 추출
                    const techStack = techStackKeywords.filter((stack) => jobTitle.toLowerCase().includes(stack) || jobCategory.toLowerCase().includes(stack));

                    jobs.push({
                        companyName: companyName || '알 수 없는 회사',
                        jobTitle: jobTitle || '알 수 없는 제목',
                        jobUrl: jobUrl || 'URL 없음',
                        location: location || '지역 미지정',
                        experience: experience || '경력 미지정',
                        education: education || '학력 미지정',
                        employmentType: employmentType || '고용 형태 미지정',
                        jobCategory: jobCategory || '카테고리 미지정',
                        salary: salary || '미지정',
                        techStack: techStack.length > 0 ? techStack : ['해당 없음'],
                        deadline: deadline || null,
                    });
                } catch (error) {
                    console.error(`채용 공고 파싱 오류: ${error.message}`);
                }
            });

            console.log(`페이지 ${page} 크롤링 완료`);
        } catch (error) {
            console.error(`페이지 ${page} 가져오기 오류: ${error.message}`);
        }

        await delay(5000); // 페이지 간 요청 간격
    }

    return jobs;
}

// 회사 저장
async function saveCompanyToDB(companyName) {
    // 회사 저장
    let company = await Company.findOne({ name: companyName });
    if (!company) {
        company = await Company.create({
            name: companyName,
            industry: '알 수 없는 업종', // 기본값 설정
            website: '', // 기본값 설정
            location: '알 수 없는 위치', // 기본값 설정
        });
        console.log(`새로운 회사 저장됨: ${companyName}`);
    } else {
        console.log(`기존 회사: ${companyName}`);
    }

    // Recruiter 저장
    let recruiter = await Recruiter.findOne({ company: company._id });
    if (!recruiter) {
        recruiter = await Recruiter.create({
            name: `${companyName} 담당자`, // 기본값 설정
            email: `${companyName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            company: company._id,
        });
        console.log(`${companyName} 회사의 새로운 담당자 저장됨`);
    }
    return company._id;
}

// 직무 분야 저장
async function saveJobCategoryToDB(categoryName) {
    if (!categoryName) return null;

    const existingCategory = await JobCategory.findOne({ name: categoryName });
    if (existingCategory) return existingCategory._id;

    const newCategory = await JobCategory.create({ name: categoryName });
    return newCategory._id;
}

// 채용 공고 상태 저장
async function saveJobStatus(jobPostingId, status = 'Open') {
    try {
        const jobStatus = await JobStatus.create({
            jobPosting: jobPostingId,
            status, // 'Open', 'Closed', 'Cancelled'
        });
        console.log(`채용 공고 상태 저장됨 (ID: ${jobPostingId})`);
    } catch (error) {
        console.error(`채용 공고 상태 저장 오류 (ID: ${jobPostingId}): ${error.message}`);
    }
}

// 채용 공고 저장
async function saveJobsToDB(jobs) {
    for (const job of jobs) {
        try {
            // 회사 저장
            const companyId = await saveCompanyToDB(job.companyName);

            // 직무 분야 저장
            const categoryId = await saveJobCategoryToDB(job.jobCategory);

            // 중복 확인
            const existingJob = await JobPosting.findOne({ url: job.jobUrl });
            if (existingJob) {
                console.log(`중복 공고 건너뜀: ${job.jobTitle}`);
                continue;
            }

            // 새 공고 저장
            const savedJob = await JobPosting.create({
                title: job.jobTitle,
                company: companyId,  // companyId를 `company` 필드에 전달
                categoryId,
                url: job.jobUrl,
                location: job.location,
                experience: job.experience,
                education: job.education,
                employmentType: job.employmentType,
                salary: job.salary,
                deadline: job.deadline,
                approved: true,
            });
            // 채용 공고 상태 저장 (Open 상태로 기본 설정)
            await saveJobStatus(savedJob._id, 'Open');

            console.log(`공고 저장됨: ${job.jobTitle}`);
        } catch (error) {
            console.error(`DB에 공고 저장 오류: ${error.message}`);
        }
    }
}

// 실행
(async () => {
    try {
        console.log('크롤링 시작...');
        const pages = 3;

        for (const keyword of techStackKeywords) {
            console.log(`키워드 "${keyword}"에 대한 공고 크롤링 중`);
            const jobs = await crawlSaramin(keyword, pages);

            console.log(`키워드 "${keyword}"에 대해 크롤링된 공고 수: ${jobs.length}. MongoDB에 저장 중...`);
            await saveJobsToDB(jobs);
        }

        console.log('크롤링 및 저장 완료');
    } catch (error) {
        console.error(`크롤링 중 오류 발생: ${error.message}`);
    } finally {
        mongoose.disconnect();
    }
})();
