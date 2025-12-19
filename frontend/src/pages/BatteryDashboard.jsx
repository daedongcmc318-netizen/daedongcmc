import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp, Cpu, Battery } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BatteryDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [liveData, setLiveData] = useState({
    soh: 92,
    soc: 75,
    rul: 450,
    temperature: 38.5,
    voltage: 3.85,
    current: 2.4,
  });

  // 실시간 데이터 애니메이션
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setLiveData(prev => ({
        soh: Math.max(85, Math.min(98, prev.soh + (Math.random() - 0.5) * 0.5)),
        soc: Math.max(60, Math.min(95, prev.soc + (Math.random() - 0.5) * 2)),
        rul: Math.max(400, Math.min(500, prev.rul + (Math.random() - 0.5) * 5)),
        temperature: Math.max(35, Math.min(42, prev.temperature + (Math.random() - 0.5) * 0.8)),
        voltage: Math.max(3.7, Math.min(4.2, prev.voltage + (Math.random() - 0.5) * 0.05)),
        current: Math.max(1.8, Math.min(3.2, prev.current + (Math.random() - 0.5) * 0.2)),
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // 실시간 차트 데이터
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 20 }, (_, i) => ({
        time: `${i * 3}s`,
        temperature: 35 + Math.sin(i * 0.5) * 5 + Math.random() * 2,
        voltage: 3.75 + Math.sin(i * 0.3) * 0.3 + Math.random() * 0.1,
      }));
      setChartData(newData);
    };
    
    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  // AI 예측 수명 데이터
  const lifeCurveData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    predicted: 100 - (i * 8) - Math.random() * 5,
    actual: 100 - (i * 7) - Math.random() * 3,
  }));

  // AI 진단 로그
  const [aiLogs, setAiLogs] = useState([
    { id: 1, time: '14:32:15', level: 'info', message: '배터리 상태 정상 - SOH 92%', icon: '✓' },
    { id: 2, time: '14:31:48', level: 'warning', message: '셀 4번 미세 전압 강하 감지 (-0.05V)', icon: '⚠' },
    { id: 3, time: '14:30:22', level: 'info', message: 'AI 분석 완료 - RUL 450 사이클 예측', icon: '🤖' },
    { id: 4, time: '14:28:56', level: 'success', message: '충전 효율 최적화 적용됨 (+3.2%)', icon: '⚡' },
    { id: 5, time: '14:25:11', level: 'warning', message: '유지보수 권장 시기: 30일 후', icon: '🔧' },
  ]);

  useEffect(() => {
    const logMessages = [
      { level: 'info', message: '배터리 온도 안정화 진행 중', icon: '🌡' },
      { level: 'success', message: '에너지 효율 최적화 완료', icon: '⚡' },
      { level: 'warning', message: '셀 밸런싱 필요 감지', icon: '⚠' },
      { level: 'info', message: 'AI 모델 재학습 완료', icon: '🤖' },
    ];

    const interval = setInterval(() => {
      const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('ko-KR'),
        ...randomLog,
      };
      setAiLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #0a1628, #0f1f3a, #0a1628)',
      padding: '24px'
    }}>
      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Cpu size={40} style={{ color: '#00ffcc' }} />
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #00ffcc, #00ff88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px'
              }}>
                B-Nexus AI
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Battery Intelligence Platform</p>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginLeft: '32px',
              padding: '8px 16px',
              background: 'rgba(0, 255, 204, 0.1)',
              borderRadius: '8px'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: '#00ff88',
                animation: 'pulse 2s ease-in-out infinite'
              }}></div>
              <span style={{ color: '#00ff88', fontSize: '14px', fontWeight: '500' }}>
                실시간 데이터 수신 중
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>시스템 가동 시간</p>
            <p style={{ color: '#00ffcc', fontSize: '20px', fontFamily: 'monospace', fontWeight: '600' }}>
              {time.toLocaleTimeString('ko-KR')}
            </p>
          </div>
        </div>
      </header>

      {/* 핵심 지표 카드 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* SOH Card */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>State of Health</p>
              <h3 style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ff88' }}>
                {liveData.soh.toFixed(1)}%
              </h3>
            </div>
            <Battery size={48} style={{ color: '#00ff88' }} />
          </div>
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid #1a2942' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9ca3af' }}>배터리 건강도</span>
              <span style={{ color: '#00ff88' }}>● 정상</span>
            </div>
          </div>
        </div>

        {/* SOC Card */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>State of Charge</p>
              <h3 style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ffcc' }}>
                {liveData.soc.toFixed(1)}%
              </h3>
            </div>
            <Zap size={48} style={{ color: '#00ffcc' }} />
          </div>
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid #1a2942' 
          }}>
            <div style={{ 
              width: '100%', 
              background: '#1a2942', 
              borderRadius: '8px', 
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${liveData.soc}%`,
                height: '100%',
                background: 'linear-gradient(to right, #00ffcc, #00ff88)',
                borderRadius: '8px',
                transition: 'width 1s ease'
              }}></div>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>실시간 충전 상태</p>
          </div>
        </div>

        {/* RUL Card */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>Remaining Useful Life</p>
              <h3 style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ffcc' }}>
                {Math.floor(liveData.rul)}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Cycles</p>
            </div>
            <Clock size={48} style={{ color: '#00ffcc' }} />
          </div>
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid #1a2942' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9ca3af' }}>AI 예측 수명</span>
              <span style={{ color: '#00ffcc' }}>약 {Math.floor(liveData.rul / 30)}개월</span>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 및 로그 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* 실시간 모니터링 차트 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={24} style={{ color: '#00ffcc' }} />
              실시간 배터리 모니터링
            </h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#facc15' }}></div>
                <span style={{ color: '#9ca3af' }}>온도 (°C)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ffcc' }}></div>
                <span style={{ color: '#9ca3af' }}>전압 (V)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#facc15" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#00ffcc" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temperature" 
                stroke="#facc15" 
                strokeWidth={2}
                dot={false}
                name="온도"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="voltage" 
                stroke="#00ffcc" 
                strokeWidth={2}
                dot={false}
                name="전압"
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>현재 온도</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#facc15' }}>
                {liveData.temperature.toFixed(1)}°C
              </p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>현재 전압</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ffcc' }}>
                {liveData.voltage.toFixed(2)}V
              </p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>현재 전류</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ffcc' }}>
                {liveData.current.toFixed(1)}A
              </p>
            </div>
          </div>
        </div>

        {/* AI 진단 로그 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={24} style={{ color: '#00ffcc' }} />
              AI 진단 알림
            </h2>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: '#00ffcc',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
            {aiLogs.map((log) => (
              <div 
                key={log.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderLeft: `4px solid ${
                    log.level === 'warning' ? '#facc15' : 
                    log.level === 'success' ? '#00ff88' : 
                    '#00ffcc'
                  }`,
                  padding: '16px',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{log.icon}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{log.time}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#d1d5db' }}>{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI 예측 수명 곡선 */}
      <div style={{
        background: '#0f1f3a',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(0, 255, 204, 0.3)',
        boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={24} style={{ color: '#00ffcc' }} />
            AI 예측 수명 곡선 (Expected Life Curve)
          </h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ffcc' }}></div>
              <span style={{ color: '#9ca3af' }}>AI 예측</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff88' }}></div>
              <span style={{ color: '#9ca3af' }}>실제 성능</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={lifeCurveData}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: '월', position: 'insideRight', offset: -5, fill: '#9ca3af' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: '성능 (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f1f3a', 
                border: '1px solid #00ffcc',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#00ffcc" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPredicted)"
              name="AI 예측"
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#00ff88" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorActual)"
              name="실제 성능"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default BatteryDashboard;
