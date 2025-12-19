# Solar@Care - 태양광 발전 모니터링 시스템

## 프로젝트 개요

Solar@Care는 **대동씨엠씨**의 배터리진단 기술을 기반으로 한 태양광 발전소 실시간 모니터링 시스템입니다.

### 주요 기능

#### 1. 실시간 모니터링 대시보드
- 전체 발전소 현황 한눈에 보기
- 발전량, 효율, 상태 실시간 업데이트
- 직관적인 데이터 시각화

#### 2. 발전소 상세 관리
- 개별 발전소 상세 정보
- 인버터 상태 모니터링
- 경보 이력 조회 및 관리

#### 3. 데이터 분석 및 시각화
- 시간대별 발전량 추이
- 일일/월간 통계 차트
- 효율 분석 리포트

#### 4. 알람/경고 시스템
- 이상 징후 자동 감지
- 실시간 알람 알림
- 경보 이력 관리

## 기술 스택

### Frontend
- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구
- **Recharts** - 데이터 시각화
- **Lucide React** - 아이콘
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트

### Backend
- **Node.js** - 런타임
- **Express** - 웹 프레임워크
- **CORS** - Cross-Origin Resource Sharing

## 프로젝트 구조

```
webapp/
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/   # 재사용 가능한 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/        # 페이지 컴포넌트
│   │   │   ├── Dashboard.jsx
│   │   │   └── PowerPlantDetail.jsx
│   │   ├── services/     # API 서비스
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/              # Node.js 백엔드
│   ├── server.js        # Express 서버
│   └── package.json
│
└── README_SOLARCARE.md  # 이 파일
```

## 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 1. Backend 서버 실행

```bash
# Backend 디렉토리로 이동
cd backend

# 패키지 설치 (처음 한 번만)
npm install

# 서버 실행
npm start

# 또는 개발 모드 (자동 재시작)
npm run dev
```

Backend 서버가 `http://localhost:5000`에서 실행됩니다.

### 2. Frontend 애플리케이션 실행

```bash
# Frontend 디렉토리로 이동
cd frontend

# 패키지 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

Frontend 애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### 3. 브라우저에서 접속

```
http://localhost:5173
```

## API 엔드포인트

### Power Plants
- `GET /api/powerplants` - 모든 발전소 목록
- `GET /api/powerplants/:id` - 특정 발전소 상세 정보
- `GET /api/powerplants/:id/alerts` - 발전소 알람 이력

### Statistics
- `GET /api/stats` - 전체 통계

### Charts
- `GET /api/chart/hourly` - 시간대별 데이터
- `GET /api/chart/daily` - 일일 데이터

### Health Check
- `GET /health` - 서버 상태 확인

## 주요 화면

### 1. Dashboard (대시보드)
- 전체 발전소 현황
- 운영 중, 정상, 경고, 오류 통계
- 발전소 목록 테이블
- 시간대별/일일 발전량 차트

### 2. 발전소 상세
- 실시간 발전 데이터
- 전압, 전류, 효율, 주파수
- 일별 발전 추이
- 인버터 경보 이력

## 기능 상세

### 실시간 모니터링
- **발전량**: 현재 발전 중인 전력량 (kW)
- **전압**: 시스템 전압 (kWh)
- **효율**: 발전 효율 (%)
- **상태**: 정상/경고/오류 상태 표시

### 데이터 시각화
- **시간대별 차트**: 24시간 발전량 추이
- **일일 차트**: 20일간 발전량 및 소비량 비교
- **효율 바**: 각 발전소의 효율 시각화

### 알람 시스템
- 실시간 알람 수신
- 경보 이력 조회
- 인버터별 필터링

## 개발 가이드

### 새로운 컴포넌트 추가
```javascript
// src/components/NewComponent.jsx
import React from 'react';
import './NewComponent.css';

const NewComponent = () => {
  return (
    <div className="new-component">
      {/* 컴포넌트 내용 */}
    </div>
  );
};

export default NewComponent;
```

### API 엔드포인트 추가
```javascript
// backend/server.js
app.get('/api/new-endpoint', (req, res) => {
  res.json({
    success: true,
    data: { /* 데이터 */ }
  });
});
```

### 새로운 API 서비스 추가
```javascript
// frontend/src/services/api.js
export const getNewData = async () => {
  const response = await api.get('/new-endpoint');
  return response.data;
};
```

## 트러블슈팅

### CORS 오류
Backend 서버에서 CORS가 활성화되어 있는지 확인하세요.

### 포트 충돌
- Frontend: `vite.config.js`에서 포트 변경
- Backend: `server.js`의 PORT 변수 수정

### API 연결 실패
1. Backend 서버가 실행 중인지 확인
2. `frontend/src/services/api.js`의 API_BASE_URL 확인

## 배포

### Frontend 빌드
```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/dist/` 디렉토리에 생성됩니다.

### Backend 배포
```bash
cd backend
node server.js
```

또는 PM2 사용:
```bash
pm2 start server.js --name solarcare-api
```

## 향후 개발 계획

- [ ] 사용자 인증 및 권한 관리
- [ ] 데이터베이스 연동 (PostgreSQL/MongoDB)
- [ ] WebSocket을 통한 실시간 업데이트
- [ ] 모바일 반응형 최적화
- [ ] PWA (Progressive Web App) 지원
- [ ] 다국어 지원 (i18n)
- [ ] 데이터 내보내기 (Excel, PDF)
- [ ] AI 기반 예측 분석 통합

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Express 공식 문서](https://expressjs.com/)
- [Recharts 문서](https://recharts.org/)

## 라이센스

Copyright © 2025 주식회사 대동씨엠씨. All rights reserved.

## 문의

프로젝트 관련 문의사항이 있으시면 아래로 연락 주세요:
- 총괄책임자: 최진혁 (jhchoi@daedongcmc.com)
- 실무책임자: 김혜진 (hjkim@daedongcmc.com)
