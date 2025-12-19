import React from 'react';
import './BatteryCard.css';

function BatteryCard({ battery, prediction }) {
  const getStatusColor = (status) => {
    switch (status) {
      case '정상': return '#4caf50';
      case '점검중': return '#ff9800';
      case '고장': return '#f44336';
      default: return '#999';
    }
  };

  const getHealthGradeColor = (grade) => {
    if (!grade) return '#999';
    const letter = grade.charAt(0);
    switch (letter) {
      case 'A': return '#4caf50';
      case 'B': return '#8bc34a';
      case 'C': return '#ff9800';
      case 'D': return '#ff5722';
      case 'F': return '#f44336';
      default: return '#999';
    }
  };

  return (
    <div className="battery-card">
      {/* 헤더 */}
      <div className="battery-card-header">
        <div className="battery-info">
          <h3>{battery.name}</h3>
          <span 
            className="status-badge" 
            style={{ backgroundColor: getStatusColor(battery.status) + '20', color: getStatusColor(battery.status) }}
          >
            {battery.status}
          </span>
        </div>
        {prediction && (
          <div className="health-grade" style={{ backgroundColor: getHealthGradeColor(prediction.health_grade) }}>
            {prediction.health_grade?.split(' ')[0] || 'N/A'}
          </div>
        )}
      </div>

      {/* 주요 지표 */}
      <div className="battery-metrics">
        <div className="metric-row">
          <div className="metric">
            <span className="metric-label">SOC (충전상태)</span>
            <div className="metric-value-bar">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${battery.soc}%`, backgroundColor: battery.soc > 20 ? '#4caf50' : '#f44336' }}></div>
              </div>
              <span className="metric-value">{battery.soc}%</span>
            </div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric">
            <span className="metric-label">SOH (수명상태)</span>
            <div className="metric-value-bar">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${battery.soh}%`, backgroundColor: battery.soh > 80 ? '#4caf50' : '#ff9800' }}></div>
              </div>
              <span className="metric-value">{battery.soh}%</span>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-item">
            <span className="metric-label">전압</span>
            <span className="metric-value">{battery.voltage}V</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">전류</span>
            <span className="metric-value">{battery.current}A</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">온도</span>
            <span className="metric-value" style={{ color: battery.temperature > 40 ? '#f44336' : '#333' }}>
              {battery.temperature}°C
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">전력</span>
            <span className="metric-value">{battery.power_current}kW</span>
          </div>
        </div>
      </div>

      {/* AI 예측 정보 */}
      {prediction && (
        <div className="prediction-info">
          <div className="prediction-header">
            <strong>AI 분석 결과</strong>
            {prediction.is_anomaly && (
              <span className="anomaly-badge">⚠️ 이상 감지</span>
            )}
          </div>
          
          <div className="prediction-details">
            <div className="prediction-item">
              <span className="label">잔존 수명:</span>
              <span className="value">{prediction.rul_days}일</span>
            </div>
            <div className="prediction-item">
              <span className="label">교체 예정:</span>
              <span className="value">{prediction.replacement_date}</span>
            </div>
            <div className="prediction-item">
              <span className="label">고장 위험:</span>
              <span className={`value risk-${prediction.failure_risk}`}>
                {prediction.failure_risk}
              </span>
            </div>
          </div>

          {prediction.warnings && prediction.warnings.length > 0 && (
            <div className="warnings">
              {prediction.warnings.map((warning, idx) => (
                <div key={idx} className="warning-item">{warning}</div>
              ))}
            </div>
          )}

          {prediction.charging_recommendation && (
            <div className="recommendation">
              <strong>충전 권장:</strong> {prediction.charging_recommendation}
            </div>
          )}
        </div>
      )}

      {/* 추가 정보 */}
      <div className="additional-info">
        <div className="info-item">
          <span>오늘 에너지: {battery.energy_today}kWh</span>
        </div>
        <div className="info-item">
          <span>누적 에너지: {battery.energy_total}kWh</span>
        </div>
        <div className="info-item">
          <span>사이클: {battery.cycle_count}회</span>
        </div>
      </div>
    </div>
  );
}

export default BatteryCard;
