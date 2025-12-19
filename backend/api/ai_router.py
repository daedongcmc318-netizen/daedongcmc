"""
AI 예측 API 라우터
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Dict

from services.battery_service import BatteryService
from services.ai_service import AIService

router = APIRouter()
battery_service = BatteryService()
ai_service = AIService()


@router.get("/predict")
async def predict_battery_health():
    """배터리 건강 상태 예측"""
    try:
        # 현재 배터리 데이터 가져오기
        battery_data = battery_service.generate_simulated_data()
        
        # AI 예측 수행
        prediction = ai_service.predict_battery_health(battery_data)
        
        return {
            "success": True,
            "data": prediction,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/predict/{battery_id}")
async def predict_single_battery(battery_id: int):
    """특정 배터리 건강 상태 예측"""
    try:
        # 현재 배터리 데이터 가져오기
        battery_data = battery_service.generate_simulated_data()
        
        # 특정 배터리 찾기
        battery = next((b for b in battery_data["batteries"] if b["id"] == battery_id), None)
        
        if not battery:
            raise HTTPException(status_code=404, detail="배터리를 찾을 수 없습니다")
        
        # AI 예측 수행
        prediction = ai_service._predict_single_battery(battery)
        
        return {
            "success": True,
            "data": prediction,
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model/info")
async def get_model_info():
    """AI 모델 정보 조회"""
    try:
        return {
            "success": True,
            "data": {
                "model_version": ai_service.model_version,
                "model_accuracy": ai_service.model_accuracy,
                "supported_features": [
                    "배터리 수명 예측 (RUL)",
                    "이상 탐지 (Anomaly Detection)",
                    "고장 확률 예측",
                    "충전 전략 추천",
                    "건강 상태 등급 분류"
                ],
                "model_type": "Deep Learning (CNN + RNN + Transformer)",
                "training_data_count": 50000,
                "last_updated": "2025-06-01"
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/train")
async def train_model(training_data: List[Dict]):
    """AI 모델 학습"""
    try:
        result = ai_service.train_model(training_data)
        return {
            "success": True,
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate")
async def evaluate_model(test_data: List[Dict]):
    """AI 모델 평가"""
    try:
        result = ai_service.evaluate_model(test_data)
        return {
            "success": True,
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
