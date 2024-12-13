import asyncio
import logging
import random
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv
import os
import time
import motor.motor_asyncio

# 환경 변수 로드
load_dotenv()

# MongoDB 연결 설정
MONGO_URI = os.getenv('DB_URI')  # 환경 변수에서 DB_URI를 가져옵니다
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client['jobDB']  # 실제 데이터베이스 이름으로 변경

# 컬렉션 설정
job_postings_col = db['jobs123']
companies_col = db['Company']
job_categories_col = db['JobCategory']
recruiters_col = db['Recruiter']
job_status_col = db['JobStatus']

# 유저 에이전트 리스트
USER_AGENTS = [
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    # 추가 사용자 에이전트
]

TECH_STACK_KEYWORDS = ["python"]  # 예시 키워드 리스트

# 대기 함수 정의 (초 단위)
async def delay(ms):
    await asyncio.sleep(ms / 1000)

# 인덱스 생성 함수 정의
async def create_indexes():
    # 기존 인덱스 정보 가져오기
    indexes = await job_postings_col.index_information()
    
    # 'url_1' 인덱스가 있는지 확인
    if 'url_1' in indexes:
        # 유니크 옵션이 아닌 경우 삭제
        if not indexes['url_1'].get('unique', False):
            await job_postings_col.drop_index('url_1')
            logging.info("기존 'url_1' 인덱스를 삭제했습니다.")
    
    # 'url' 필드에 유니크 인덱스 생성
    await job_postings_col.create_index("url", unique=True)
    logging.info("'url' 필드에 유니크 인덱스를 생성했습니다.")
    
    # 다른 인덱스들도 필요한 경우 추가 생성
    await companies_col.create_index("name", unique=True)
    # await job_categories_col.create_index("_id", unique=True)  # 이 줄을 삭제 또는 주석 처리
    await recruiters_col.create_index("name", unique=True)
    await job_status_col.create_index("status", unique=True)
    
    logging.info("모든 인덱스가 성공적으로 생성되었습니다.")

async def goto_with_retries(page, url, max_retries=3, timeout=120000):
    for attempt in range(1, max_retries + 1):
        try:
            logging.info(f"페이지 로딩 시도 {attempt}/{max_retries}: {url}")
            await page.goto(url, timeout=timeout, wait_until="networkidle")
            return True
        except PlaywrightTimeoutError as e:
            logging.error(f"페이지 로딩 타임아웃: {e}. 재시도 중...")
            if attempt == max_retries:
                logging.error(f"페이지 로딩 실패: {url}")
                return False
            await delay(2000)
        except Exception as e:
            logging.error(f"페이지 로딩 중 오류 발생: {e}")
            if attempt == max_retries:
                logging.error(f"페이지 로딩 실패: {url}")
                return False
            await delay(2000)

async def crawl_job_pages(keyword):
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=random.choice(USER_AGENTS)  # 랜덤 유저 에이전트 사용
        )
        page = await context.new_page()

        try:
            url = f'https://www.example.com/search?query={keyword}'
            success = await goto_with_retries(page, url)
            if not success:
                return []

            # 페이지 소스 가져오기
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')

            jobs = []
            job_elements = soup.select('.job-card')  # 실제 CSS 셀렉터로 변경

            for job_elem in job_elements:
                try:
                    job_title = job_elem.select_one('.job-title').get_text(strip=True)
                    company_name = job_elem.select_one('.company-name').get_text(strip=True)
                    category_id = job_elem.get('data-category-id')  # 예시
                    job_url = job_elem.select_one('a.job-link')['href']
                    location = job_elem.select_one('.job-location').get_text(strip=True)
                    experience = job_elem.select_one('.job-experience').get_text(strip=True)
                    education = job_elem.select_one('.job-education').get_text(strip=True)
                    employment_type = job_elem.select_one('.job-type').get_text(strip=True)
                    salary = job_elem.select_one('.job-salary').get_text(strip=True)
                    deadline = job_elem.select_one('.application-deadline')['data-deadline']  # 예시
                    related_jobs = [rel_job.get_text(strip=True) for rel_job in job_elem.select('.related-jobs .job')]

                    job_data = {
                        'title': job_title,
                        'company': company_name,
                        'categoryId': category_id,
                        'url': job_url,
                        'location': location,
                        'experience': experience,
                        'education': education,
                        'employmentType': employment_type,
                        'salary': salary,
                        'deadline': deadline,
                        'approved': True,
                        'relatedJobs': related_jobs
                    }

                    jobs.append(job_data)
                except Exception as e:
                    logging.error(f"개별 공고 크롤링 중 오류 발생: {e}")
                    continue

            logging.info(f'페이지 {url} 크롤링 완료')
            return jobs
        except Exception as error:
            logging.error(f'크롤링 중 오류 발생: {error}')
            return []
        finally:
            await browser.close()
            logging.info("브라우저 종료 완료")

async def main():
    logging.info("메인 함수 시작")
    await create_indexes()  # 인덱스 생성 함수 호출
    keywords = ['python', 'java', 'javascript']
    for keyword in keywords:
        print(f'키워드 "{keyword}"에 대한 공고 크롤링 중')
        try:
            # 크롤링 함수 호출 및 데이터 수집
            jobs_data = await crawl_job_pages(keyword)
            if jobs_data:
                for job in jobs_data:
                    # 회사 ID 매핑
                    company = await companies_col.find_one({"name": job['company']})
                    if not company:
                        company_insert = await companies_col.insert_one({
                            "name": job['company'],
                            "industry": "알 수 없는 업종",
                            "website": ""
                        })
                        company_id = company_insert.inserted_id
                    else:
                        company_id = company['_id']

                    # 카테고리 ID 매핑
                    category = await job_categories_col.find_one({"_id": job['categoryId']})
                    if not category:
                        category_insert = await job_categories_col.insert_one({
                            "_id": job['categoryId'],
                            "name": "Unknown Category"
                        })
                        category_id = category_insert.inserted_id
                    else:
                        category_id = category['_id']

                    # 관련 채용 정보 매핑
                    related_jobs_ids = []
                    for related_job in job['relatedJobs']:
                        related = await job_postings_col.find_one({"title": related_job})
                        if related:
                            related_jobs_ids.append(related['_id'])
                        else:
                            # 관련 채용 정보가 없으면 새로 생성
                            related_insert = await job_postings_col.insert_one({
                                "title": related_job,
                                "approved": False
                            })
                            related_jobs_ids.append(related_insert.inserted_id)

                    # 최종 저장할 데이터 구조
                    job_document = {
                        'title': job['title'],
                        'company': company_id,
                        'categoryId': category_id,
                        'url': job['url'],
                        'location': job['location'],
                        'experience': job['experience'],
                        'education': job['education'],
                        'employmentType': job['employmentType'],
                        'salary': job['salary'],
                        'deadline': job['deadline'],
                        'approved': job['approved'],
                        'relatedJobs': related_jobs_ids
                    }

                    try:
                        await job_postings_col.insert_one(job_document)
                        print(f"JobPosting '{job['title']}' 저장 완료.")
                        logging.info(f"JobPosting '{job['title']}' 저장 완료.")
                    except DuplicateKeyError:
                        print(f"중복된 JobPosting '{job['title']}'이(가) 이미 존재합니다.")
                        logging.warning(f"중복된 JobPosting '{job['title']}'이(가) 이미 존재합니다.")
        except Exception as e:
            print(f'크롤링 중 오류 발생: {e}')
            logging.error(f'크롤링 중 오류 발생: {e}')
    print('크롤링 및 저장 완료')
    logging.info("크롤링 및 저장 완료")

if __name__ == "__main__":
    # 로깅 설정
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler("crawler.log"),
            logging.StreamHandler()
        ]
    )
    asyncio.run(main())
