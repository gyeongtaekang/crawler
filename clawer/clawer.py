import requests
from bs4 import BeautifulSoup
import time
import datetime
from pymongo import MongoClient

# MongoDB 연결
client = MongoClient('mongodb://gyeongtae:gyeongtae123@localhost:3000/jobDB?authSource=admin')
db = client['jobDB']
collection = db['jobs']

# 검색 키워드 설정
keyword = '데이터 분석'

# 페이지 순회
for page_num in range(1, 5):
    url = f'https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword={keyword}&recruitPage={page_num}&recruitSort=relation&recruitPageCount=100'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    raw = requests.get(url, headers=headers)
    html = BeautifulSoup(raw.text, "html.parser")
    
    # 크롤링 데이터 처리 및 MongoDB에 저장
    jobs = html.select('.item_recruit')
    for job in jobs:
        title = job.select_one('.job_tit').text.strip()
        company = job.select_one('.corp_name').text.strip()
        date = datetime.datetime.now()
        
        job_data = {
            'title': title,
            'company': company,
            'date': date
        }
        
        try:
            collection.update_one({'title': title, 'company': company}, {'$set': job_data}, upsert=True)
        except Exception as e:
            print(f"Error processing job: {e}")

print("사람인 크롤링 데이터가 MongoDB에 저장되었습니다.")

# MongoDB 연결 종료
client.close()