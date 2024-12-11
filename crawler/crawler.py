import requests
from bs4 import BeautifulSoup
import time
import datetime
from pymongo import MongoClient
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

# MongoDB 연결 설정
client = MongoClient('mongodb://gyeongtae:gyeongtae123@113.198.66.75:3000/admin')
db = client['jobDB']

# 컬렉션 존재 여부 확인 및 생성
if 'jobs11' not in db.list_collection_names():
    db.create_collection('jobs11')
    print("컬렉션 'jobs11'이 생성되었습니다.")
else:
    print("컬렉션 'jobs11'이 이미 존재합니다.")

collection = db['jobs11']

# MongoDB에 데이터를 저장하는 함수
def save_to_mongodb(job_data):
    try:
        collection.insert_one(job_data)
        print(f"Job saved: {job_data['title']}")
    except Exception as e:
        print(f"Error saving job: {e}")

# 검색 키워드 설정
keyword = '데이터 분석'

# requests 세션 설정 (재시도 전략 포함)
session = requests.Session()
retry = Retry(
    total=5,  # 최대 재시도 횟수
    backoff_factor=1,  # 재시도 간 대기 시간 (초)
    status_forcelist=[500, 502, 503, 504],  # 재시도할 HTTP 상태 코드
    allowed_methods=["HEAD", "GET", "OPTIONS"]  # 재시도할 HTTP 메소드
)
adapter = HTTPAdapter(max_retries=retry)
session.mount("https://", adapter)
session.mount("http://", adapter)  # HTTP도 추가

# 사용자 에이전트 및 추가 헤더 설정
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Referer': 'https://www.google.com/',
    'Connection': 'keep-alive'
}

# 페이지 순회
for page_num in range(1, 5):
    url = f'https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword={keyword}&recruitPage={page_num}&recruitSort=relation&recruitPageCount=100'
    
    try:
        print(f"페이지 {page_num} 요청 중: {url}")
        raw = session.get(url, headers=headers, timeout=10)  # 타임아웃 10초 설정
        raw.raise_for_status()  # HTTP 오류 발생 시 예외 발생
    except requests.exceptions.Timeout:
        print(f"타임아웃 발생: {url}")
        continue
    except requests.exceptions.RequestException as e:
        print(f"요청 실패: {e}")
        continue
    
    html = BeautifulSoup(raw.text, "html.parser")
    
    # 크롤링 데이터 처리 및 MongoDB에 저장
    jobs = html.select('.item_recruit')
    print(f"찾은 채용 공고 수: {len(jobs)}")
    for job in jobs:
        title = job.select_one('.job_tit').get_text(strip=True) if job.select_one('.job_tit') else 'N/A'
        company = job.select_one('.corp_name').get_text(strip=True) if job.select_one('.corp_name') else 'N/A'
        location = job.select_one('.job_condition').get_text(strip=True) if job.select_one('.job_condition') else 'N/A'
        description = job.select_one('.job_sector').get_text(strip=True) if job.select_one('.job_sector') else 'N/A'
        due_date = job.select_one('.date').get_text(strip=True) if job.select_one('.date') else 'N/A'
        link = job.select_one('.job_tit a')['href'] if job.select_one('.job_tit a') else 'N/A'

        job_data = {
            '_id': link.split('?rec_idx=')[-1] if link != 'N/A' else None,
            'title': title,
            'companyName': company,
            'location': location,
            'description': description,
            'dueDate': due_date,
            'link': link,
            'scraped_at': datetime.datetime.now(),
            'tags': [],
            'keyword': keyword
        }
        
        save_to_mongodb(job_data)
        time.sleep(1)  # 서버 부하를 줄이기 위해 잠시 대기

    print(f"페이지 {page_num} - {keyword}의 채용공고 크롤링을 완료했습니다.")

print("사람인 크롤링 데이터가 MongoDB에 저장되었습니다.")
client.close()  # MongoDB 연결 종료
