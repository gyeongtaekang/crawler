import requests
ip = requests.get("https://api.ipify.org").text
print(f"현재 실행 중인 머신의 IP: {ip}")
