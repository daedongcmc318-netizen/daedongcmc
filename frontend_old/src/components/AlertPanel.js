import React, { useState } from 'react';
import './AlertPanel.css';

function AlertPanel({ alerts, predictions }) {
  const [activeTab, setActiveTab] = useState('alerts');

  const getLevelColor = (level) => {
    switch (level) {
      case '경고': return '#f44336';
      case '주의': return '#ff9800';
      case '정보': return '#2196f3';
      default: return '#999';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case '높음': return '#f44336';
      case '보통': return '#ff9800';
      case '낮음': return '#4caf50';
      default: return '#999';
    }
  };

  return (
    <div className="alert-panel">
      <div className="panel-header">
        <h2 className="section-title">알림 및 예측</h2>
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            알림 ({alerts?.length || 0})
          </button>
          <button 
            className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            AI 예측 ({predictions?.length || 0})
          </button>
        </div>
      </div>

      <div className="panel-content">
        {activeTab === 'alerts' && (
          <div className="alerts-list">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className="alert-item" style={{ borderLeftColor: getLevelColor(alert.level) }}>
                  <div className="alert-header">
                    <span className="alert-level" style={{ color: getLevelColor(alert.level) }}>
                      {alert.level}
                    </span>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString('ko-KR')}
                    </span>
                  </div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>✅ 현재 알림이 없습니다</p>
                <span>시스템이 정상적으로 운영되고 있습니다</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="predictions-list">
            {predictions && predictions.length > 0 ? (
              predictions.map((pred, index) => (
                <div key={index} className="prediction-item">
                  <div className="prediction-header">
                    <div className="prediction-title">
                      <strong>{pred.battery_name}</strong>
                      <span className="health-badge">{pred.health_grade}</span>
                    </div>
                    <span className="risk-badge" style={{ backgroundColor: getRiskColor(pred.failure_risk) + '20', color: getRiskColor(pred.failure_risk) }}>
                      위험도: {pred.failure_risk}
                    </span>
                  </div>

                  <div className="prediction-details">
                    <div className="detail-item">
                      <span className="label">잔존 수명:</span>
                      <span className="value">{pred.rul_days}일</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">교체 예정일:</span>
                      <span className="value">{pred.replacement_date}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">이상 점수:</span>
                      <span className="value">{(pred.anomaly_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {pred.is_anomaly && (
                    <div className="anomaly-warning">
                      ⚠️ 이상 징후: {pred.anomaly_type}
                    </div>
                  )}

                  {pred.recommendations && pred.recommendations.length > 0 && (
                    <div className="recommendations">
                      <strong>권장사항:</strong>
                      <ul>
                        {pred.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>📊 AI 예측 데이터가 없습니다</p>
                <span>데이터를 수집하는 중입니다</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertPanel;
