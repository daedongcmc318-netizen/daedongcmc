import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import { dashboardService, createWebSocketConnection } from '../services/api';
import BatteryCard from '../components/BatteryCard';
import StatsCard from '../components/StatsCard';
import ChartPanel from '../components/ChartPanel';
import AlertPanel from '../components/AlertPanel';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [ws, setWs] = useState(null);

  // WebSocket 메시지 처리
  const handleWebSocketMessage = useCallback((wsData) => {
    console.log('WebSocket 데이터 수신:', wsData);
    
    // 실시간 데이터 업데이트
    if (wsData.battery_data && wsData.prediction) {
      setData(prevData => ({
        ...prevData,
        batteries: wsData.battery_data.batteries,
        predictions: wsData.prediction.battery_predictions,
        system_prediction: wsData.prediction.system_prediction,
        total_stats: wsData.battery_data.total_stats,
        alerts: wsData.battery_data.alerts,
        environment: wsData.battery_data.environment,
      }));
      setLastUpdate(new Date());
    }
  }, []);

  // 대시보드 데이터 로드
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview();
      
      if (response.success) {
        setData(response.data);
        setError(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('대시보드 데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로드 및 WebSocket 연결
  useEffect(() => {
    loadDashboardData();
    
    // WebSocket 연결
    const websocket = createWebSocketConnection(
      handleWebSocketMessage,
      (error) => {
        console.error('WebSocket 연결 오류:', error);
        // WebSocket 실패 시 폴링으로 대체
        const interval = setInterval(loadDashboardData, 5000);
        return () => clearInterval(interval);
      }
    );
    
    setWs(websocket);
    
    // 정리
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [loadDashboardData, handleWebSocketMessage]);

  if (loading && !data) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>대시보드 로딩 중...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="dashboard-error">
        <h2>오류 발생</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>배터리진단 관제 시스템</h1>
          <p className="subtitle">전체 발전소 현황</p>
        </div>
        <div className="header-right">
          <div className="update-time">
            마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
          </div>
          <div className="current-date">
            {lastUpdate.toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long' 
            })}
          </div>
        </div>
      </header>

      {/* 전체 통계 카드 */}
      <div className="stats-overview">
        <StatsCard
          title="운영 발전소"
          value={data?.normal_count || 0}
          unit="개소"
          icon="⚡"
          color="#4caf50"
        />
        <StatsCard
          title="점검"
          value={data?.warning_count || 0}
          unit="개소"
          icon="⚠️"
          color="#ff9800"
        />
        <StatsCard
          title="고장"
          value={data?.error_count || 0}
          unit="개소"
          icon="❌"
          color="#f44336"
        />
        <StatsCard
          title="총 발전량"
          value={data?.total_stats?.total_energy?.toFixed(2) || 0}
          unit="kWh"
          icon="🔋"
          color="#2196f3"
        />
      </div>

      {/* 배터리 카드 목록 */}
      <div className="battery-cards-section">
        <h2 className="section-title">발전소 모니터링</h2>
        <div className="battery-cards">
          {data?.batteries?.map((battery, index) => {
            const prediction = data?.predictions?.find(p => p.battery_id === battery.id);
            return (
              <BatteryCard 
                key={battery.id} 
                battery={battery} 
                prediction={prediction}
              />
            );
          })}
        </div>
      </div>

      {/* 차트 패널 */}
      <div className="charts-section">
        <ChartPanel data={data} />
      </div>

      {/* 알림 패널 */}
      <div className="alerts-section">
        <AlertPanel alerts={data?.alerts || []} predictions={data?.predictions || []} />
      </div>

      {/* 시스템 예측 패널 */}
      {data?.system_prediction && (
        <div className="system-prediction-section">
          <h2 className="section-title">AI 시스템 분석</h2>
          <div className="system-prediction-card">
            <div className="prediction-header">
              <h3>전체 시스템 건강 상태</h3>
              <span className={`health-badge ${data.system_prediction.system_health.toLowerCase()}`}>
                {data.system_prediction.system_health}
              </span>
            </div>
            <div className="prediction-stats">
              <div className="stat-item">
                <span className="stat-label">평균 잔존 수명</span>
                <span className="stat-value">{data.system_prediction.average_rul_days}일</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">이상 배터리</span>
                <span className="stat-value">{data.system_prediction.batteries_with_anomaly}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">고위험 배터리</span>
                <span className="stat-value">{data.system_prediction.high_risk_batteries}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">평균 이상 점수</span>
                <span className="stat-value">{(data.system_prediction.average_anomaly_score * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="prediction-recommendation">
              <strong>시스템 권장사항:</strong> {data.system_prediction.system_recommendation}
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="dashboard-footer">
        <p>© 2025 주식회사 대동씨엠씨. All rights reserved.</p>
        <p>배터리진단 AI 시스템 v1.0.0 | AI 모델 정확도: 92%</p>
      </footer>
    </div>
  );
}

export default Dashboard;
