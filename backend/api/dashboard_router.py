"""
대시보드 API 라우터
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
from typing import List, Dict

from services.battery_service import BatteryService
from services.ai_service import AIService

router = APIRouter()
battery_service = BatteryService()
ai_service = AIService()


@router.get("/overview")
async def get_dashboard_overview():
    """대시보드 개요 조회"""
    try:
        # 배터리 데이터
        battery_data = battery_service.generate_simulated_data()
        
        # AI 예측
        prediction = ai_service.predict_battery_health(battery_data)
        
        # 개요 데이터 구성
        overview = {
            # 전체 통계
            "total_batteries": len(battery_data.get("batteries", [])),
            "normal_count": sum(1 for b in battery_data.get("batteries", []) if b["status"] == "정상"),
            "warning_count": sum(1 for b in battery_data.get("batteries", []) if b["status"] == "점검중"),
            "error_count": sum(1 for b in battery_data.get("batteries", []) if b["status"] == "고장"),
            
            # 배터리 상태
            "batteries": battery_data.get("batteries", []),
            
            # AI 예측 결과
            "predictions": prediction.get("battery_predictions", []),
            "system_prediction": prediction.get("system_prediction", {}),
            
            # 전체 통계
            "total_stats": battery_data.get("total_stats", {}),
            
            # 알림
            "alerts": battery_data.get("alerts", []),
            
            # 환경 정보
            "environment": battery_data.get("environment", {}),
        }
        
        return {
            "success": True,
            "data": overview,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chart/power-trend")
async def get_power_trend(hours: int = 24):
    """전력 추세 차트 데이터"""
    try:
        # 시간별 데이터 생성
        now = datetime.now()
        data_points = []
        
        for i in range(hours):
            timestamp = (now - timedelta(hours=hours-i-1)).strftime("%Y-%m-%d %H:%M")
            
            # 시뮬레이션 데이터
            data_points.append({
                "timestamp": timestamp,
                "power": round(30 + random.uniform(-10, 20), 2),
                "voltage": round(3.7 + random.uniform(-0.3, 0.3), 2),
                "current": round(1.5 + random.uniform(-0.5, 1.0), 2),
            })
        
        return {
            "success": True,
            "data": data_points,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chart/soc-distribution")
async def get_soc_distribution():
    """SOC 분포 차트 데이터"""
    try:
        battery_data = battery_service.generate_simulated_data()
        
        soc_data = [
            {
                "battery_id": b["id"],
                "battery_name": b["name"],
                "soc": b["soc"],
                "soh": b["soh"]
            }
            for b in battery_data.get("batteries", [])
        ]
        
        return {
            "success": True,
            "data": soc_data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chart/temperature-history")
async def get_temperature_history(hours: int = 12):
    """온도 이력 차트 데이터"""
    try:
        now = datetime.now()
        batteries = battery_service.generate_simulated_data().get("batteries", [])
        
        # 각 배터리별 온도 이력
        data = {}
        for battery in batteries:
            battery_history = []
            base_temp = 25.0
            
            for i in range(hours):
                timestamp = (now - timedelta(hours=hours-i-1)).strftime("%Y-%m-%d %H:%M")
                temp = base_temp + random.uniform(-5, 15)
                
                battery_history.append({
                    "timestamp": timestamp,
                    "temperature": round(temp, 1)
                })
            
            data[f"battery_{battery['id']}"] = {
                "name": battery["name"],
                "history": battery_history
            }
        
        return {
            "success": True,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chart/energy-production")
async def get_energy_production(days: int = 20):
    """에너지 생산량 차트 데이터"""
    try:
        now = datetime.now()
        data_points = []
        
        for i in range(days):
            date = (now - timedelta(days=days-i-1)).strftime("%m/%d")
            
            data_points.append({
                "date": date,
                "energy": round(150 + random.uniform(-30, 50), 2),
                "target": 169.10
            })
        
        return {
            "success": True,
            "data": data_points,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alerts")
async def get_alerts(limit: int = 10):
    """알림 목록 조회"""
    try:
        battery_data = battery_service.generate_simulated_data()
        alerts = battery_data.get("alerts", [])[:limit]
        
        return {
            "success": True,
            "data": alerts,
            "count": len(alerts),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/maintenance/schedule")
async def get_maintenance_schedule():
    """유지보수 일정 조회"""
    try:
        # AI 예측을 기반으로 유지보수 일정 생성
        battery_data = battery_service.generate_simulated_data()
        prediction = ai_service.predict_battery_health(battery_data)
        
        schedule = []
        for pred in prediction.get("battery_predictions", []):
            if pred["failure_risk"] in ["높음", "보통"]:
                schedule.append({
                    "battery_id": pred["battery_id"],
                    "battery_name": pred["battery_name"],
                    "scheduled_date": pred["replacement_date"],
                    "priority": "높음" if pred["failure_risk"] == "높음" else "보통",
                    "type": "교체" if pred["health_grade"].startswith("F") else "점검",
                    "reason": ", ".join(pred["warnings"]),
                })
        
        # 날짜순 정렬
        schedule.sort(key=lambda x: x["scheduled_date"])
        
        return {
            "success": True,
            "data": schedule,
            "count": len(schedule),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
