"""
배터리 서비스 - 배터리 데이터 처리 및 관리
"""
import random
import time
from datetime import datetime
from typing import Dict, List, Optional
import numpy as np


class BatteryService:
    """배터리 데이터 관리 서비스"""
    
    def __init__(self):
        self.battery_count = 3
        self.base_voltage = 3.7
        self.base_temperature = 25.0
        self.history: List[Dict] = []
        
    def generate_simulated_data(self) -> Dict:
        """시뮬레이션 배터리 데이터 생성"""
        
        # 현재 시간
        current_time = datetime.now()
        
        # 배터리 데이터 생성
        batteries = []
        for i in range(1, self.battery_count + 1):
            # 시간에 따른 변동
            time_factor = time.time() % 100 / 100
            
            # 배터리별 특성
            battery_data = {
                "id": i,
                "name": f"대동씨엠씨 1단 {i}호발전소",
                "status": "정상" if random.random() > 0.1 else "점검중",
                
                # 전압 (V)
                "voltage": round(self.base_voltage + random.uniform(-0.2, 0.2) + time_factor * 0.1, 2),
                "voltage_max": round(self.base_voltage * 1.2, 2),
                "voltage_min": round(self.base_voltage * 0.8, 2),
                
                # 전류 (A)
                "current": round(random.uniform(0.5, 2.5), 2),
                
                # 온도 (°C)
                "temperature": round(self.base_temperature + random.uniform(-5, 15), 2),
                
                # SOC (State of Charge) - 충전 상태 (%)
                "soc": round(85 + random.uniform(-10, 10) - time_factor * 5, 1),
                
                # SOH (State of Health) - 수명 상태 (%)
                "soh": round(95 + random.uniform(-5, 2), 1),
                
                # 용량
                "capacity_current": round(77.48 + random.uniform(-5, 5), 2),  # kW
                "capacity_rated": 99.54,  # kW
                
                # 전력
                "power_current": round(30.3 + random.uniform(-10, 10), 2),  # kW
                "power_peak": round(12.3 + random.uniform(-2, 2), 2),  # kW
                
                # 에너지
                "energy_today": round(169.10 + random.uniform(-10, 10), 2),  # kWh
                "energy_total": round(150 + i * 10 + random.uniform(0, 10), 2),  # kWh
                
                # 사용 시간
                "runtime": f"{random.randint(1, 3)}.{random.randint(10, 99)}시간",
                
                # 충방전 횟수
                "cycle_count": random.randint(50, 100),
                
                # 내부 저항 (mΩ)
                "internal_resistance": round(random.uniform(10, 30), 1),
                
                # 셀 밸런스 상태
                "cell_balance": "정상" if random.random() > 0.2 else "불균형",
            }
            
            batteries.append(battery_data)
        
        # 전체 시스템 데이터
        system_data = {
            "timestamp": current_time.isoformat(),
            "batteries": batteries,
            
            # 전체 통계
            "total_stats": {
                "total_power": round(sum(b["power_current"] for b in batteries), 2),
                "total_energy": round(sum(b["energy_total"] for b in batteries), 2),
                "average_soc": round(sum(b["soc"] for b in batteries) / len(batteries), 1),
                "average_soh": round(sum(b["soh"] for b in batteries) / len(batteries), 1),
                "average_temperature": round(sum(b["temperature"] for b in batteries) / len(batteries), 1),
            },
            
            # 알림 및 경고
            "alerts": self._generate_alerts(batteries),
            
            # 환경 데이터
            "environment": {
                "outdoor_temperature": round(12.0 + random.uniform(-2, 2), 1),
                "humidity": round(94 + random.uniform(-5, 5), 0),
                "weather": "맑음",
            }
        }
        
        # 히스토리에 저장 (최근 100개만 유지)
        self.history.append(system_data)
        if len(self.history) > 100:
            self.history.pop(0)
        
        return system_data
    
    def _generate_alerts(self, batteries: List[Dict]) -> List[Dict]:
        """알림 생성"""
        alerts = []
        
        for battery in batteries:
            # 온도 경고
            if battery["temperature"] > 40:
                alerts.append({
                    "level": "경고",
                    "battery_id": battery["id"],
                    "message": f"{battery['name']}: 고온 감지 ({battery['temperature']}°C)",
                    "timestamp": datetime.now().isoformat()
                })
            
            # SOC 경고
            if battery["soc"] < 20:
                alerts.append({
                    "level": "주의",
                    "battery_id": battery["id"],
                    "message": f"{battery['name']}: 낮은 충전 상태 ({battery['soc']}%)",
                    "timestamp": datetime.now().isoformat()
                })
            
            # SOH 경고
            if battery["soh"] < 80:
                alerts.append({
                    "level": "경고",
                    "battery_id": battery["id"],
                    "message": f"{battery['name']}: 배터리 수명 저하 ({battery['soh']}%)",
                    "timestamp": datetime.now().isoformat()
                })
            
            # 셀 밸런스 경고
            if battery["cell_balance"] == "불균형":
                alerts.append({
                    "level": "주의",
                    "battery_id": battery["id"],
                    "message": f"{battery['name']}: 셀 불균형 감지",
                    "timestamp": datetime.now().isoformat()
                })
        
        return alerts
    
    def get_battery_history(self, battery_id: Optional[int] = None, limit: int = 50) -> List[Dict]:
        """배터리 히스토리 조회"""
        history = self.history[-limit:]
        
        if battery_id:
            # 특정 배터리의 히스토리만 추출
            filtered_history = []
            for data in history:
                for battery in data.get("batteries", []):
                    if battery["id"] == battery_id:
                        filtered_history.append({
                            "timestamp": data["timestamp"],
                            **battery
                        })
            return filtered_history
        
        return history
    
    def get_battery_statistics(self) -> Dict:
        """배터리 통계 조회"""
        if not self.history:
            return {}
        
        latest_data = self.history[-1]
        
        return {
            "summary": {
                "total_batteries": len(latest_data.get("batteries", [])),
                "normal_count": sum(1 for b in latest_data.get("batteries", []) if b["status"] == "정상"),
                "warning_count": sum(1 for b in latest_data.get("batteries", []) if b["status"] == "점검중"),
                "error_count": sum(1 for b in latest_data.get("batteries", []) if b["status"] == "고장"),
            },
            "total_stats": latest_data.get("total_stats", {}),
            "latest_alerts": latest_data.get("alerts", [])[:5],
        }
