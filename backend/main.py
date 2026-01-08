"""
배터리진단 AI 시스템 - 메인 애플리케이션
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from datetime import datetime
import asyncio
import random
import json

from api import battery_router, ai_router, dashboard_router
from services.battery_service import BatteryService
from services.ai_service import AIService

# FastAPI 앱 초기화
app = FastAPI(
    title="배터리진단 AI 시스템",
    description="AI 기반 배터리 상태 진단 및 수명 예측 시스템",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
battery_service = BatteryService()
ai_service = AIService()

# 라우터 등록
app.include_router(battery_router.router, prefix="/api/battery", tags=["Battery"])
app.include_router(ai_router.router, prefix="/api/ai", tags=["AI"])
app.include_router(dashboard_router.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "배터리진단 AI 시스템 API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


class ConnectionManager:
    """WebSocket 연결 관리자"""
    
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass


manager = ConnectionManager()


@app.websocket("/ws/battery-data")
async def websocket_endpoint(websocket: WebSocket):
    """실시간 배터리 데이터 WebSocket"""
    await manager.connect(websocket)
    
    try:
        # 실시간 데이터 전송 루프
        while True:
            # 시뮬레이션 데이터 생성 (실제로는 센서에서 받아옴)
            battery_data = battery_service.generate_simulated_data()
            
            # AI 예측 수행
            prediction = ai_service.predict_battery_health(battery_data)
            
            # 데이터 결합
            response_data = {
                "timestamp": datetime.now().isoformat(),
                "battery_data": battery_data,
                "prediction": prediction
            }
            
            # 클라이언트로 전송
            await websocket.send_json(response_data)
            
            # 1초 대기
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


if __name__ == "__main__":
    print("=" * 50)
    print("배터리진단 AI 시스템 서버 시작")
    print("=" * 50)
    print(f"서버 주소: http://0.0.0.0:8000")
    print(f"API 문서: http://0.0.0.0:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
