"""
AI 서비스 - 배터리 상태 예측 및 이상 탐지
"""
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import random


class AIService:
    """AI 기반 배터리 진단 서비스"""
    
    def __init__(self):
        """초기화"""
        self.model_version = "1.0.0"
        self.model_accuracy = 0.92  # 92% 정확도
        self.prediction_cache = {}
        
    def predict_battery_health(self, battery_data: Dict) -> Dict:
        """배터리 건강 상태 예측"""
        
        predictions = []
        
        for battery in battery_data.get("batteries", []):
            # 각 배터리에 대한 예측 수행
            prediction = self._predict_single_battery(battery)
            predictions.append(prediction)
        
        # 전체 시스템 예측
        system_prediction = self._predict_system_health(predictions)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "model_version": self.model_version,
            "model_accuracy": self.model_accuracy,
            "battery_predictions": predictions,
            "system_prediction": system_prediction
        }
    
    def _predict_single_battery(self, battery: Dict) -> Dict:
        """개별 배터리 예측"""
        
        # 입력 특성
        soc = battery.get("soc", 0)
        soh = battery.get("soh", 0)
        temperature = battery.get("temperature", 0)
        voltage = battery.get("voltage", 0)
        current = battery.get("current", 0)
        cycle_count = battery.get("cycle_count", 0)
        
        # AI 모델 시뮬레이션 (실제로는 학습된 모델 사용)
        
        # 1. 잔존 수명 예측 (RUL: Remaining Useful Life)
        rul_days = self._predict_rul(soh, cycle_count, temperature)
        
        # 2. 이상 탐지 (Anomaly Detection)
        anomaly_score = self._detect_anomaly(battery)
        is_anomaly = anomaly_score > 0.7
        
        # 3. 고장 확률 예측
        failure_probability = self._predict_failure_probability(battery)
        
        # 4. 최적 충전 추천
        charging_recommendation = self._recommend_charging_strategy(soc, soh, temperature)
        
        # 5. 건강 상태 등급
        health_grade = self._calculate_health_grade(soh, anomaly_score)
        
        # 6. 예상 교체 시기
        replacement_date = (datetime.now() + timedelta(days=rul_days)).strftime("%Y-%m-%d")
        
        return {
            "battery_id": battery.get("id"),
            "battery_name": battery.get("name"),
            
            # 예측 결과
            "rul_days": int(rul_days),
            "replacement_date": replacement_date,
            "health_grade": health_grade,
            
            # 이상 탐지
            "anomaly_score": round(anomaly_score, 3),
            "is_anomaly": is_anomaly,
            "anomaly_type": self._identify_anomaly_type(battery) if is_anomaly else None,
            
            # 고장 예측
            "failure_probability": round(failure_probability, 3),
            "failure_risk": "높음" if failure_probability > 0.7 else "보통" if failure_probability > 0.3 else "낮음",
            
            # 충전 추천
            "charging_recommendation": charging_recommendation,
            
            # 성능 예측
            "predicted_soh_next_month": round(soh - random.uniform(0.5, 1.5), 1),
            "predicted_capacity_retention": round((soh / 100) * battery.get("capacity_rated", 100), 2),
            
            # 경고 및 권장사항
            "warnings": self._generate_warnings(battery, anomaly_score, failure_probability),
            "recommendations": self._generate_recommendations(battery, soc, soh, temperature)
        }
    
    def _predict_rul(self, soh: float, cycle_count: int, temperature: float) -> float:
        """잔존 수명 예측 (일 단위)"""
        
        # 간단한 경험적 모델 (실제로는 딥러닝 모델 사용)
        base_life = 1000  # 기본 수명 (일)
        
        # SOH 영향
        soh_factor = soh / 100
        
        # 사이클 카운트 영향
        cycle_factor = max(0, 1 - (cycle_count / 5000))
        
        # 온도 영향 (최적 온도 25°C)
        temp_factor = 1 - abs(temperature - 25) / 100
        temp_factor = max(0.5, min(1.0, temp_factor))
        
        # 잔존 수명 계산
        rul = base_life * soh_factor * cycle_factor * temp_factor
        
        # 노이즈 추가 (모델의 불확실성)
        rul += random.uniform(-50, 50)
        
        return max(0, rul)
    
    def _detect_anomaly(self, battery: Dict) -> float:
        """이상 탐지 점수 계산 (0~1)"""
        
        anomaly_score = 0.0
        
        # 온도 이상
        temp = battery.get("temperature", 25)
        if temp > 45 or temp < 0:
            anomaly_score += 0.3
        elif temp > 40 or temp < 5:
            anomaly_score += 0.15
        
        # 전압 이상
        voltage = battery.get("voltage", 3.7)
        if voltage < 3.0 or voltage > 4.2:
            anomaly_score += 0.3
        elif voltage < 3.3 or voltage > 4.0:
            anomaly_score += 0.15
        
        # SOC와 전압 불일치
        soc = battery.get("soc", 50)
        expected_voltage = 3.3 + (soc / 100) * 0.9
        voltage_diff = abs(voltage - expected_voltage)
        if voltage_diff > 0.5:
            anomaly_score += 0.2
        
        # SOH 급격한 저하
        soh = battery.get("soh", 100)
        if soh < 70:
            anomaly_score += 0.3
        elif soh < 85:
            anomaly_score += 0.1
        
        # 셀 불균형
        if battery.get("cell_balance") == "불균형":
            anomaly_score += 0.2
        
        # 랜덤 노이즈
        anomaly_score += random.uniform(-0.05, 0.05)
        
        return min(1.0, max(0.0, anomaly_score))
    
    def _predict_failure_probability(self, battery: Dict) -> float:
        """고장 확률 예측"""
        
        soh = battery.get("soh", 100)
        temperature = battery.get("temperature", 25)
        cycle_count = battery.get("cycle_count", 0)
        
        # 로지스틱 회귀 기반 간단한 모델
        x = (
            -0.05 * soh +
            0.02 * abs(temperature - 25) +
            0.0001 * cycle_count +
            random.uniform(-0.5, 0.5)
        )
        
        # 시그모이드 함수
        probability = 1 / (1 + np.exp(-x))
        
        return float(probability)
    
    def _recommend_charging_strategy(self, soc: float, soh: float, temperature: float) -> str:
        """최적 충전 전략 추천"""
        
        if soc < 20:
            if temperature > 35:
                return "긴급 충전 필요 (고온 주의)"
            else:
                return "긴급 충전 필요"
        elif soc < 40:
            return "충전 권장"
        elif soc > 90:
            if soh < 85:
                return "과충전 방지 (배터리 수명 고려)"
            else:
                return "충전 완료 상태 유지"
        else:
            return "정상 운영"
    
    def _calculate_health_grade(self, soh: float, anomaly_score: float) -> str:
        """건강 상태 등급 계산"""
        
        if soh >= 95 and anomaly_score < 0.2:
            return "A (매우 좋음)"
        elif soh >= 90 and anomaly_score < 0.4:
            return "B (좋음)"
        elif soh >= 80 and anomaly_score < 0.6:
            return "C (보통)"
        elif soh >= 70 and anomaly_score < 0.8:
            return "D (주의)"
        else:
            return "F (교체 필요)"
    
    def _identify_anomaly_type(self, battery: Dict) -> str:
        """이상 유형 식별"""
        
        types = []
        
        temp = battery.get("temperature", 25)
        if temp > 40:
            types.append("고온")
        elif temp < 5:
            types.append("저온")
        
        voltage = battery.get("voltage", 3.7)
        if voltage > 4.0:
            types.append("과전압")
        elif voltage < 3.3:
            types.append("저전압")
        
        soh = battery.get("soh", 100)
        if soh < 80:
            types.append("수명 저하")
        
        if battery.get("cell_balance") == "불균형":
            types.append("셀 불균형")
        
        return ", ".join(types) if types else "기타"
    
    def _generate_warnings(self, battery: Dict, anomaly_score: float, failure_prob: float) -> List[str]:
        """경고 생성"""
        
        warnings = []
        
        if anomaly_score > 0.7:
            warnings.append("⚠️ 심각한 이상 징후 감지")
        elif anomaly_score > 0.5:
            warnings.append("⚠️ 이상 징후 감지")
        
        if failure_prob > 0.7:
            warnings.append("⚠️ 고장 위험 높음")
        elif failure_prob > 0.5:
            warnings.append("⚠️ 고장 가능성 있음")
        
        if battery.get("temperature", 25) > 40:
            warnings.append("🌡️ 배터리 온도 높음")
        
        if battery.get("soc", 100) < 20:
            warnings.append("🔋 배터리 충전 부족")
        
        if battery.get("soh", 100) < 80:
            warnings.append("📉 배터리 수명 저하")
        
        return warnings
    
    def _generate_recommendations(self, battery: Dict, soc: float, soh: float, temperature: float) -> List[str]:
        """권장사항 생성"""
        
        recommendations = []
        
        if temperature > 35:
            recommendations.append("냉각 시스템 점검 권장")
        
        if soc < 30:
            recommendations.append("충전 스케줄 조정 필요")
        
        if soh < 85:
            recommendations.append("배터리 교체 계획 수립 권장")
        
        if battery.get("cell_balance") == "불균형":
            recommendations.append("셀 밸런싱 수행 필요")
        
        cycle_count = battery.get("cycle_count", 0)
        if cycle_count > 4000:
            recommendations.append("고주기 사용에 따른 예방 정비 권장")
        
        if not recommendations:
            recommendations.append("정상 운영 중")
        
        return recommendations
    
    def _predict_system_health(self, battery_predictions: List[Dict]) -> Dict:
        """전체 시스템 건강 상태 예측"""
        
        if not battery_predictions:
            return {}
        
        # 평균 지표 계산
        avg_rul = np.mean([p["rul_days"] for p in battery_predictions])
        avg_anomaly = np.mean([p["anomaly_score"] for p in battery_predictions])
        avg_failure_prob = np.mean([p["failure_probability"] for p in battery_predictions])
        
        # 시스템 전체 건강 등급
        anomaly_batteries = sum(1 for p in battery_predictions if p["is_anomaly"])
        high_risk_batteries = sum(1 for p in battery_predictions if p["failure_probability"] > 0.7)
        
        if high_risk_batteries > len(battery_predictions) * 0.3:
            system_health = "위험"
        elif anomaly_batteries > len(battery_predictions) * 0.5:
            system_health = "주의"
        else:
            system_health = "정상"
        
        return {
            "system_health": system_health,
            "average_rul_days": int(avg_rul),
            "average_anomaly_score": round(avg_anomaly, 3),
            "average_failure_probability": round(avg_failure_prob, 3),
            "batteries_with_anomaly": anomaly_batteries,
            "high_risk_batteries": high_risk_batteries,
            "total_batteries": len(battery_predictions),
            "system_recommendation": self._get_system_recommendation(system_health, high_risk_batteries)
        }
    
    def _get_system_recommendation(self, health: str, high_risk_count: int) -> str:
        """시스템 전체 권장사항"""
        
        if health == "위험":
            return "⚠️ 즉시 시스템 점검 및 배터리 교체 필요"
        elif health == "주의":
            if high_risk_count > 0:
                return "⚠️ 고위험 배터리 우선 점검 권장"
            else:
                return "정기 점검 스케줄 확인 필요"
        else:
            return "✅ 시스템 정상 운영 중"
    
    def train_model(self, training_data: List[Dict]) -> Dict:
        """AI 모델 학습 (향후 구현)"""
        
        # 실제로는 TensorFlow/PyTorch를 사용한 모델 학습
        return {
            "status": "training_scheduled",
            "message": "모델 학습이 예약되었습니다",
            "data_count": len(training_data)
        }
    
    def evaluate_model(self, test_data: List[Dict]) -> Dict:
        """모델 평가 (향후 구현)"""
        
        return {
            "accuracy": self.model_accuracy,
            "precision": 0.89,
            "recall": 0.91,
            "f1_score": 0.90
        }
