"""
배터리 API 라우터
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime

from services.battery_service import BatteryService

router = APIRouter()
battery_service = BatteryService()


@router.get("/status")
async def get_battery_status():
    """현재 배터리 상태 조회"""
    try:
        data = battery_service.generate_simulated_data()
        return {
            "success": True,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_battery_history(
    battery_id: Optional[int] = Query(None, description="배터리 ID"),
    limit: int = Query(50, ge=1, le=100, description="조회 개수")
):
    """배터리 히스토리 조회"""
    try:
        history = battery_service.get_battery_history(battery_id, limit)
        return {
            "success": True,
            "data": history,
            "count": len(history),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics")
async def get_battery_statistics():
    """배터리 통계 조회"""
    try:
        stats = battery_service.get_battery_statistics()
        return {
            "success": True,
            "data": stats,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{battery_id}")
async def get_battery_detail(battery_id: int):
    """특정 배터리 상세 정보 조회"""
    try:
        data = battery_service.generate_simulated_data()
        
        # 특정 배터리 찾기
        battery = next((b for b in data["batteries"] if b["id"] == battery_id), None)
        
        if not battery:
            raise HTTPException(status_code=404, detail="배터리를 찾을 수 없습니다")
        
        return {
            "success": True,
            "data": battery,
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
