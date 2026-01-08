# 배포 가이드

## 개발 환경 설정

### 1. 백엔드 설정

```bash
cd backend

# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (Windows)
venv\Scripts\activate

# 가상환경 활성화 (Mac/Linux)
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python main.py
```

서버가 `http://localhost:8000`에서 실행됩니다.

### 2. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드가 `http://localhost:3000`에서 실행됩니다.

---

## 프로덕션 배포

### Docker를 사용한 배포

#### 1. Backend Dockerfile

`backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Frontend Dockerfile

`frontend/Dockerfile`:
```dockerfile
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./data:/app/data

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8000
```

#### 실행

```bash
# 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

---

## 클라우드 배포

### AWS EC2 배포

1. **EC2 인스턴스 생성**
   - Ubuntu 20.04 LTS
   - t2.medium 이상 권장
   - 보안 그룹: 80, 443, 8000 포트 오픈

2. **서버 설정**

```bash
# 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
sudo apt install docker.io docker-compose -y

# Git 클론
git clone <repository-url>
cd webapp

# 환경 변수 설정
cp .env.example .env
nano .env

# 실행
docker-compose up -d
```

3. **도메인 및 SSL 설정**

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx -y

# SSL 인증서 발급
sudo certbot --nginx -d yourdomain.com
```

### Azure App Service 배포

1. **Azure CLI 설치**

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

2. **배포**

```bash
# 로그인
az login

# 리소스 그룹 생성
az group create --name battery-ai-rg --location koreacentral

# App Service 생성
az webapp up --name battery-ai-app --resource-group battery-ai-rg
```

---

## 환경 변수 설정

### Backend (.env)

```env
# 데이터베이스
DATABASE_URL=sqlite:///./battery_ai.db

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# AI 모델
MODEL_PATH=./data/models/battery_ai_model.h5

# 로그 레벨
LOG_LEVEL=INFO
```

### Frontend (.env)

```env
# API URL
REACT_APP_API_URL=http://localhost:8000

# WebSocket URL
REACT_APP_WS_URL=ws://localhost:8000
```

---

## 모니터링 및 로깅

### 1. 로그 확인

```bash
# Backend 로그
tail -f backend/logs/app.log

# Docker 로그
docker-compose logs -f backend
```

### 2. 시스템 모니터링

```bash
# CPU, 메모리 사용량
docker stats

# 프로세스 확인
ps aux | grep python
ps aux | grep node
```

---

## 백업 및 복구

### 데이터 백업

```bash
# 데이터베이스 백업
cp backend/battery_ai.db backup/battery_ai_$(date +%Y%m%d).db

# 모델 파일 백업
tar -czf backup/models_$(date +%Y%m%d).tar.gz data/models/
```

### 복구

```bash
# 데이터베이스 복구
cp backup/battery_ai_20251219.db backend/battery_ai.db

# 서비스 재시작
docker-compose restart
```

---

## 성능 최적화

### 1. Backend 최적화

- Uvicorn workers 증가: `--workers 4`
- Redis 캐싱 도입
- 데이터베이스 인덱싱
- AI 모델 양자화

### 2. Frontend 최적화

- Code splitting
- Lazy loading
- Image optimization
- CDN 사용

---

## 보안 설정

### 1. 방화벽 설정

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. API 인증 추가

- JWT 토큰 기반 인증
- API 키 관리
- Rate limiting

### 3. HTTPS 강제

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 문제 해결

### 일반적인 문제

1. **Backend가 시작되지 않음**
   - 포트 충돌 확인: `lsof -i :8000`
   - 의존성 재설치: `pip install -r requirements.txt --force-reinstall`

2. **Frontend 빌드 실패**
   - Node 버전 확인: `node -v` (18+ 권장)
   - 캐시 삭제: `rm -rf node_modules package-lock.json && npm install`

3. **WebSocket 연결 실패**
   - CORS 설정 확인
   - 프록시 설정 확인

---

## 지원

문의사항: support@daedongcmc.com
