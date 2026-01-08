# B-Nexus AI - 배터리진단 AI 플랫폼

## 프로젝트 개요

B-Nexus AI는 **대동씨엠씨**의 배터리진단 기술을 기반으로 한 차세대 배터리 모니터링 및 태양광 발전소 통합 관리 플랫폼입니다.

### 주요 목표
- 배터리 상태 예측 AI 알고리즘 정확도 **90% 이상** 달성
- 실시간 배터리 상태(SOH, SOC) 모니터링 시스템 구현
- 클라우드 기반 진단 대시보드 개발
- 태양광 발전소 통합 관리

### 핵심 기능

#### 1. 배터리 상태 모니터링
- 실시간 전압, 전류, 온도 측정
- SOC (State of Charge): 충전 상태
- SOH (State of Health): 수명 상태
- 배터리 셀 간 불균형 모니터링

#### 2. AI 기반 예측 분석
- 머신러닝 기반 배터리 잔존 수명(RUL) 예측
- 이상 징후 탐지 (Anomaly Detection)
- 고장 발생 사전 감지
- 배터리 성능 저하 예측

#### 3. 태양광 발전소 관리
- 실시간 발전량 모니터링
- 발전소 효율 분석
- 인버터 상태 관리
- 경보 이력 조회

#### 4. 대시보드 시각화
- 직관적인 UI/UX
- 실시간 데이터 시각화 (차트, 그래프)
- 알림 및 경고 시스템
- 다중 발전소 통합 관리

## 기술 스택

### Backend
- Node.js
- Express (REST API)
- CORS

### Frontend
- React 18
- Vite
- Recharts / Chart.js (데이터 시각화)
- Lucide React (아이콘)
- React Router (라우팅)
- Axios (HTTP 클라이언트)

### AI/ML
- TensorFlow / PyTorch (딥러닝 모델)
- Scikit-learn (전통적 ML)
- Time Series Analysis (시계열 분석)

## 프로젝트 구조

```
webapp/
├── backend/              # 백엔드 API 서버
│   ├── server.js        # Express 서버
│   └── package.json
├── frontend/            # 프론트엔드 웹 애플리케이션
│   ├── public/          # 정적 파일
│   └── src/             # 소스 코드
│       ├── components/  # React 컴포넌트
│       ├── pages/       # 페이지 컴포넌트
│       ├── services/    # API 서비스
│       └── App.jsx      # 메인 앱
├── data/                # 데이터 저장소
├── docs/               # 문서
└── tests/              # 테스트 코드
```

## 설치 및 실행

### Backend 설치
```bash
cd backend
npm install
npm start
```

Backend 서버가 `http://localhost:5000`에서 실행됩니다.

### Frontend 설치
```bash
cd frontend
npm install
npm run dev
```

Frontend 애플리케이션이 `http://localhost:5173`에서 실행됩니다.

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
pm2 start server.js --name bnexus-ai-api
```

## 브랜딩

### B-Nexus AI 로고
- **B-Nexus**: 흰색 (Bold)
- **AI**: 민트색 (#00ffcc, Bold)

### 컬러 팔레트
- **Primary Blue**: #0066ff
- **AI Mint**: #00ffcc
- **Success Green**: #00cc66
- **Warning Orange**: #ff9933
- **Error Red**: #ff3333

## 향후 개발 계획

- [ ] 사용자 인증 및 권한 관리
- [ ] 데이터베이스 연동 (PostgreSQL/MongoDB)
- [ ] WebSocket을 통한 실시간 업데이트
- [ ] 모바일 반응형 최적화
- [ ] PWA (Progressive Web App) 지원
- [ ] 다국어 지원 (i18n)
- [ ] 데이터 내보내기 (Excel, PDF)
- [ ] AI 기반 예측 분석 통합
- [ ] 배터리 진단 모듈 통합

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Express 공식 문서](https://expressjs.com/)
- [Recharts 문서](https://recharts.org/)

## 라이센스

Copyright © 2025 주식회사 대동씨엠씨. All rights reserved.

## 문의

프로젝트 관련 문의사항이 있으시면 아래로 연락 주세요:
- 대표이사: 최진혁 (jhchoi@daedongcmc.com / 010-8513-0535)
- 실무책임자: 김혜진 (hjkim@daedongcmc.com / 010-2835-6977)
- 주소: 울산광역시 울주군 서생면 에너지산업6로 23
- 전화: 052-903-1070
