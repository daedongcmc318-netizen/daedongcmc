# API 문서

## 기본 정보

- **Base URL**: `http://localhost:8000`
- **API 문서**: `http://localhost:8000/docs`
- **WebSocket**: `ws://localhost:8000/ws/battery-data`

## 인증

현재 버전에서는 인증이 필요하지 않습니다. (개발 단계)

---

## 배터리 API

### 1. 현재 배터리 상태 조회

```
GET /api/battery/status
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-12-19T10:30:00",
    "batteries": [
      {
        "id": 1,
        "name": "대동씨엠씨 1단 1호발전소",
        "status": "정상",
        "voltage": 3.75,
        "current": 1.85,
        "temperature": 28.5,
        "soc": 87.3,
        "soh": 94.2
      }
    ]
  }
}
```

### 2. 배터리 히스토리 조회

```
GET /api/battery/history?battery_id=1&limit=50
```

**파라미터:**
- `battery_id` (optional): 특정 배터리 ID
- `limit` (optional): 조회 개수 (기본값: 50)

### 3. 배터리 통계 조회

```
GET /api/battery/statistics
```

### 4. 특정 배터리 상세 정보

```
GET /api/battery/{battery_id}
```

---

## AI 예측 API

### 1. 배터리 건강 상태 예측

```
GET /api/ai/predict
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "model_version": "1.0.0",
    "model_accuracy": 0.92,
    "battery_predictions": [
      {
        "battery_id": 1,
        "rul_days": 450,
        "replacement_date": "2027-03-15",
        "health_grade": "A (매우 좋음)",
        "anomaly_score": 0.15,
        "is_anomaly": false,
        "failure_probability": 0.12
      }
    ]
  }
}
```

### 2. 특정 배터리 예측

```
GET /api/ai/predict/{battery_id}
```

### 3. AI 모델 정보

```
GET /api/ai/model/info
```

### 4. 모델 학습

```
POST /api/ai/train
```

### 5. 모델 평가

```
POST /api/ai/evaluate
```

---

## 대시보드 API

### 1. 대시보드 개요

```
GET /api/dashboard/overview
```

### 2. 전력 추세 차트

```
GET /api/dashboard/chart/power-trend?hours=24
```

### 3. SOC 분포 차트

```
GET /api/dashboard/chart/soc-distribution
```

### 4. 온도 이력 차트

```
GET /api/dashboard/chart/temperature-history?hours=12
```

### 5. 에너지 생산량 차트

```
GET /api/dashboard/chart/energy-production?days=20
```

### 6. 알림 목록

```
GET /api/dashboard/alerts?limit=10
```

### 7. 유지보수 일정

```
GET /api/dashboard/maintenance/schedule
```

---

## WebSocket

### 실시간 배터리 데이터 스트림

```
ws://localhost:8000/ws/battery-data
```

**메시지 형식:**
```json
{
  "timestamp": "2025-12-19T10:30:00",
  "battery_data": { ... },
  "prediction": { ... }
}
```

---

## 오류 코드

| 코드 | 설명 |
|------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 |
| 404 | 리소스를 찾을 수 없음 |
| 500 | 서버 오류 |

---

## 사용 예시

### Python

```python
import requests

# 배터리 상태 조회
response = requests.get('http://localhost:8000/api/battery/status')
data = response.json()
print(data)

# AI 예측
response = requests.get('http://localhost:8000/api/ai/predict')
prediction = response.json()
print(prediction)
```

### JavaScript

```javascript
// 배터리 상태 조회
fetch('http://localhost:8000/api/battery/status')
  .then(response => response.json())
  .then(data => console.log(data));

// WebSocket 연결
const ws = new WebSocket('ws://localhost:8000/ws/battery-data');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

---

## 업데이트 이력

- **v1.0.0** (2025-12-19): 초기 API 릴리스
