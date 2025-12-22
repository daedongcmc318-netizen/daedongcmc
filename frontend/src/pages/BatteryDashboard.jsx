import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp, Cpu, Battery, Thermometer, Grid, BarChart3, Waves, ArrowUpCircle, ArrowDownCircle, Gauge } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';

const BatteryDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [liveData, setLiveData] = useState({
    soh: 92,
    soc: 75,
    rul: 450,
    temperature: 38.5,
    voltage: 3.85,
    current: 2.4,
    power: 9.24, // kW
    cycleCount: 2450,
    efficiency: 94.5,
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
        power: Math.max(6, Math.min(12, prev.power + (Math.random() - 0.5) * 0.3)),
        cycleCount: prev.cycleCount,
        efficiency: Math.max(90, Math.min(98, prev.efficiency + (Math.random() - 0.5) * 0.5)),
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // 실시간 차트 데이터
  const [realtimeData, setRealtimeData] = useState([]);
  
  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 30 }, (_, i) => ({
        time: `${i}s`,
        temperature: 35 + Math.sin(i * 0.3) * 4 + Math.random() * 2,
        voltage: 3.75 + Math.sin(i * 0.2) * 0.25 + Math.random() * 0.08,
        current: 2.0 + Math.sin(i * 0.4) * 0.8 + Math.random() * 0.3,
        power: 8 + Math.sin(i * 0.25) * 2 + Math.random() * 1,
      }));
      setRealtimeData(newData);
    };
    
    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  // ESS 셀 전압 데이터 (16셀)
  const cellVoltages = Array.from({ length: 16 }, (_, i) => ({
    cell: `셀${i + 1}`,
    voltage: 3.7 + Math.random() * 0.3,
    status: Math.random() > 0.1 ? 'normal' : 'warning'
  }));

  // 온도 분포 데이터 (8개 센서)
  const temperatureDistribution = Array.from({ length: 8 }, (_, i) => ({
    sensor: `T${i + 1}`,
    temp: 36 + Math.random() * 6,
  }));

  // 충방전 사이클 히스토리
  const cycleHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    charge: Math.random() * 100,
    discharge: Math.random() * 80,
  }));

  // 에너지 효율 데이터
  const efficiencyData = [
    { name: '충전 효율', value: 95, fill: '#00ff88' },
    { name: '방전 효율', value: 93, fill: '#00ffcc' },
    { name: '손실', value: 7, fill: '#1a2942' },
  ];

  // 셀 밸런싱 상태 (셀별 전압 편차)
  const cellBalancingData = Array.from({ length: 16 }, (_, i) => {
    const baseVoltage = 3.85;
    const deviation = (Math.random() - 0.5) * 0.15;
    return {
      cell: i + 1,
      voltage: baseVoltage + deviation,
      deviation: deviation * 1000, // mV로 변환
      status: Math.abs(deviation) < 0.05 ? 'excellent' : Math.abs(deviation) < 0.08 ? 'good' : 'warning'
    };
  });

  // SOH/SOC 히스토리 트렌드 (7일)
  const [healthTrend, setHealthTrend] = useState([]);
  
  useEffect(() => {
    const trendData = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      soh: 92 - (i * 0.3) + (Math.random() - 0.5) * 0.5,
      soc_avg: 75 + (Math.random() - 0.5) * 8,
      cycles: 2450 - (7 - i) * 3,
    }));
    setHealthTrend(trendData);
  }, []);

  // 에너지 효율 트렌드 (24시간)
  const efficiencyTrend = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    charge_eff: 92 + Math.sin(i * 0.3) * 3 + Math.random() * 2,
    discharge_eff: 90 + Math.sin(i * 0.25) * 3 + Math.random() * 2,
    roundtrip_eff: 85 + Math.sin(i * 0.2) * 4 + Math.random() * 2,
  }));

  // 셀 온도 히트맵 데이터 (4x4 그리드)
  const cellTempHeatmap = Array.from({ length: 16 }, (_, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const baseTemp = 38;
    // 중앙부가 더 뜨거운 패턴
    const centerDistance = Math.sqrt(Math.pow(row - 1.5, 2) + Math.pow(col - 1.5, 2));
    const temp = baseTemp + (2 - centerDistance) * 2 + Math.random() * 2;
    return {
      row,
      col,
      cell: i + 1,
      temp: temp,
      x: col,
      y: row,
    };
  });

  // 전력 흐름 상태
  const [powerFlow, setPowerFlow] = useState({
    mode: 'charging', // charging, discharging, idle
    rate: 9.2,
    grid_power: 12.5,
    load_power: 3.3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const modes = ['charging', 'discharging', 'idle'];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      setPowerFlow({
        mode: randomMode,
        rate: Math.random() * 10 + 5,
        grid_power: Math.random() * 15 + 5,
        load_power: Math.random() * 8 + 2,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 이상탐지 히트맵 (24시간 x 7일)
  const anomalyHeatmap = Array.from({ length: 7 }, (_, day) => {
    return Array.from({ length: 24 }, (_, hour) => ({
      day: `D${day + 1}`,
      hour: hour,
      anomaly_score: Math.random() * 100,
      level: Math.random() > 0.9 ? 'high' : Math.random() > 0.7 ? 'medium' : 'low'
    }));
  }).flat();

  // AI 예측 수명 데이터
  const lifeCurveData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    predicted: 100 - (i * 8) - Math.random() * 5,
    actual: 100 - (i * 7) - Math.random() * 3,
    threshold: 80,
  }));

  // AI 진단 로그
  const [aiLogs, setAiLogs] = useState([
    { id: 1, time: '14:32:15', level: 'info', message: 'ESS 배터리 팩 상태 정상 - SOH 92%', icon: '✓', category: 'status' },
    { id: 2, time: '14:31:48', level: 'warning', message: '셀 4번 전압 불균형 감지 (-0.05V)', icon: '⚠', category: 'cell' },
    { id: 3, time: '14:30:22', level: 'info', message: 'AI 분석 완료 - RUL 450 사이클 예측', icon: '🤖', category: 'ai' },
    { id: 4, time: '14:28:56', level: 'success', message: '셀 밸런싱 완료 - 효율 +3.2% 향상', icon: '⚡', category: 'balance' },
    { id: 5, time: '14:25:11', level: 'warning', message: 'ESS 유지보수 권장 시기: 30일 후', icon: '🔧', category: 'maintenance' },
    { id: 6, time: '14:20:33', level: 'info', message: '열관리 시스템 작동 중 - 온도 안정화', icon: '🌡', category: 'thermal' },
  ]);

  useEffect(() => {
    const logMessages = [
      { level: 'info', message: 'ESS 배터리 온도 안정화 진행 중', icon: '🌡', category: 'thermal' },
      { level: 'success', message: '에너지 변환 효율 최적화 완료', icon: '⚡', category: 'efficiency' },
      { level: 'warning', message: '셀 밸런싱 필요 - 전압 편차 0.08V', icon: '⚠', category: 'balance' },
      { level: 'info', message: 'AI 모델 재학습 완료 - 정확도 95.2%', icon: '🤖', category: 'ai' },
      { level: 'success', message: 'BMS 시스템 정상 작동 중', icon: '✓', category: 'bms' },
      { level: 'warning', message: '순환 전류 미세 증가 감지', icon: '⚠', category: 'current' },
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

  // SOC 게이지 데이터
  const socGaugeData = [
    { name: 'SOC', value: liveData.soc, fill: '#00ffcc' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #0a1628, #0f1f3a, #0a1628)',
      padding: '12px',
      color: '#fff'
    }}>
      {/* Header - Responsive */}
      <header style={{ marginBottom: '16px' }}>
        <div className="header-container" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Battery className="battery-icon" size={32} style={{ color: '#00ffcc', flexShrink: 0 }} />
            <div style={{ flex: '1', minWidth: '200px' }}>
              <h1 style={{ 
                fontSize: 'clamp(20px, 5vw, 32px)', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #00ffcc, #00ff88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px',
                lineHeight: '1.2'
              }}>
                B-Nexus AI - ESS
              </h1>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(11px, 2.5vw, 14px)' }}>Energy Storage System Battery Monitoring</p>
            </div>
            <div className="status-badge" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 12px',
              background: 'rgba(0, 255, 204, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 204, 0.3)',
              fontSize: 'clamp(11px, 2.5vw, 14px)'
            }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: '#00ff88',
                animation: 'pulse 2s ease-in-out infinite',
                flexShrink: 0
              }}></div>
              <span style={{ color: '#00ff88', fontWeight: '500', whiteSpace: 'nowrap' }}>
                실시간 모니터링
              </span>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>System Time</p>
              <p style={{ color: '#00ffcc', fontSize: 'clamp(14px, 3vw, 18px)', fontFamily: 'monospace', fontWeight: '600' }}>
                {time.toLocaleTimeString('ko-KR')}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>Cycle Count</p>
              <p style={{ color: '#00ffcc', fontSize: 'clamp(14px, 3vw, 18px)', fontFamily: 'monospace', fontWeight: '600' }}>
                {liveData.cycleCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 핵심 지표 카드 - Responsive Grid */}
      <div className="metrics-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* SOH */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>SOH</p>
            <Battery size={20} style={{ color: '#00ff88' }} />
          </div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#00ff88', marginBottom: '4px' }}>
            {liveData.soh.toFixed(1)}%
          </h3>
          <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>건강도 정상</p>
        </div>

        {/* SOC */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>SOC</p>
            <Zap size={20} style={{ color: '#00ffcc' }} />
          </div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#00ffcc', marginBottom: '4px' }}>
            {liveData.soc.toFixed(1)}%
          </h3>
          <div style={{ width: '100%', height: '4px', background: '#1a2942', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
            <div style={{ width: `${liveData.soc}%`, height: '100%', background: 'linear-gradient(to right, #00ffcc, #00ff88)', transition: 'width 1s' }}></div>
          </div>
        </div>

        {/* Power */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>Power</p>
            <Activity size={20} style={{ color: '#00ffcc' }} />
          </div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#00ffcc', marginBottom: '4px' }}>
            {liveData.power.toFixed(2)}
          </h3>
          <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>kW</p>
        </div>

        {/* Efficiency */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          boxShadow: '0 0 20px rgba(250, 204, 21, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>Efficiency</p>
            <TrendingUp size={20} style={{ color: '#facc15' }} />
          </div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#facc15', marginBottom: '4px' }}>
            {liveData.efficiency.toFixed(1)}%
          </h3>
          <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>에너지 효율</p>
        </div>

        {/* RUL */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)' }}>RUL</p>
            <Clock size={20} style={{ color: '#00ffcc' }} />
          </div>
          <h3 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#00ffcc', marginBottom: '4px' }}>
            {Math.floor(liveData.rul)}
          </h3>
          <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>Cycles ({Math.floor(liveData.rul / 30)}개월)</p>
        </div>
      </div>

      {/* 메인 차트 섹션 - Responsive */}
      <div className="main-charts" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
        {/* 실시간 4파라미터 모니터링 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#00ffcc' }} />
            실시간 ESS 파라미터 모니터링
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '10px' }} />
              <YAxis yAxisId="left" stroke="#facc15" style={{ fontSize: '10px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#00ffcc" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#facc15" strokeWidth={2} dot={false} name="온도(°C)" />
              <Line yAxisId="right" type="monotone" dataKey="voltage" stroke="#00ffcc" strokeWidth={2} dot={false} name="전압(V)" />
              <Line yAxisId="right" type="monotone" dataKey="current" stroke="#00ff88" strokeWidth={2} dot={false} name="전류(A)" />
              <Line yAxisId="left" type="monotone" dataKey="power" stroke="#ff6b9d" strokeWidth={2} dot={false} name="전력(kW)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="param-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ color: '#facc15', fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 'bold' }}>{liveData.temperature.toFixed(1)}°C</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 10px)' }}>온도</p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ color: '#00ffcc', fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 'bold' }}>{liveData.voltage.toFixed(2)}V</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 10px)' }}>전압</p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ color: '#00ff88', fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 'bold' }}>{liveData.current.toFixed(1)}A</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 10px)' }}>전류</p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ color: '#ff6b9d', fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 'bold' }}>{liveData.power.toFixed(2)}kW</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 10px)' }}>전력</p>
            </div>
          </div>
        </div>

        {/* AI 진단 로그 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: '#00ffcc' }} />
            ESS AI 진단
          </h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
            {aiLogs.map((log) => (
              <div 
                key={log.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderLeft: `3px solid ${
                    log.level === 'warning' ? '#facc15' : 
                    log.level === 'success' ? '#00ff88' : 
                    '#00ffcc'
                  }`,
                  padding: '10px',
                  borderRadius: '0 6px 6px 0',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{log.icon}</span>
                    <span style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', color: '#64748b', background: '#1a2942', padding: '2px 6px', borderRadius: '4px' }}>
                      {log.category}
                    </span>
                  </div>
                  <span style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', color: '#64748b' }}>{log.time}</span>
                </div>
                <p style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', color: '#d1d5db', lineHeight: '1.4' }}>{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 셀 전압 분포 & 온도 분포 - Responsive */}
      <div className="distribution-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* 셀 전압 분포 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Grid size={18} style={{ color: '#00ffcc' }} />
            ESS 셀 전압 분포 (16 Cells)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cellVoltages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="cell" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px' }} domain={[3.5, 4.1]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Bar dataKey="voltage" radius={[4, 4, 0, 0]}>
                {cellVoltages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.status === 'normal' ? '#00ff88' : '#facc15'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: 'clamp(9px, 1.8vw, 11px)', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>정상</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#facc15', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>경고</span>
            </div>
          </div>
        </div>

        {/* 온도 분포 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer size={18} style={{ color: '#facc15' }} />
            온도 센서 분포 (8 Sensors)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={temperatureDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="sensor" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px' }} domain={[30, 45]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #facc15',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Bar dataKey="temp" radius={[4, 4, 0, 0]}>
                {temperatureDistribution.map((entry, index) => (
                  <Cell 
                    key={`temp-${index}`} 
                    fill={
                      entry.temp < 40 ? '#00ff88' : 
                      entry.temp < 42 ? '#facc15' : 
                      '#ff6b9d'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: 'clamp(9px, 1.8vw, 11px)', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>정상</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#facc15', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>주의</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#ff6b9d', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>경고</span>
            </div>
          </div>
        </div>
      </div>

      {/* 충방전 사이클 & AI 예측 - Responsive */}
      <div className="cycle-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* 충방전 사이클 히스토리 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: '#00ffcc' }} />
            24시간 충방전 사이클
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cycleHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Bar dataKey="charge" fill="#00ffcc" radius={[4, 4, 0, 0]} name="충전(kWh)" />
              <Bar dataKey="discharge" fill="#ff6b9d" radius={[4, 4, 0, 0]} name="방전(kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI 예측 수명 곡선 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#00ffcc' }} />
            AI 기반 수명 예측 곡선
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={lifeCurveData}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Line type="monotone" dataKey="threshold" stroke="#ff6b9d" strokeWidth={2} strokeDasharray="5 5" name="임계값(80%)" dot={false} />
              <Area type="monotone" dataKey="predicted" stroke="#00ffcc" strokeWidth={2} fillOpacity={1} fill="url(#colorPredicted)" name="AI 예측" />
              <Area type="monotone" dataKey="actual" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="실제 성능" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 새로운 디테일 섹션 1: 전력 흐름 & 셀 밸런싱 - Responsive */}
      <div className="power-balance-section" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
        {/* 실시간 전력 흐름 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Waves size={18} style={{ color: '#00ffcc' }} />
            실시간 전력 흐름
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {/* Grid */}
            <div style={{ 
              width: '100%', 
              maxWidth: '300px',
              padding: '12px', 
              background: 'rgba(0, 0, 0, 0.3)', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)', marginBottom: '4px' }}>Grid</p>
              <p style={{ color: '#00ffcc', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold' }}>{powerFlow.grid_power.toFixed(1)} kW</p>
            </div>
            
            {/* 화살표와 ESS */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {powerFlow.mode === 'charging' && (
                <ArrowDownCircle size={28} style={{ color: '#00ff88', animation: 'pulse 1.5s ease-in-out infinite' }} />
              )}
              {powerFlow.mode === 'discharging' && (
                <ArrowUpCircle size={28} style={{ color: '#ff6b9d', animation: 'pulse 1.5s ease-in-out infinite' }} />
              )}
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.2), rgba(0, 255, 136, 0.2))',
                borderRadius: '12px',
                border: '2px solid #00ffcc',
                textAlign: 'center'
              }}>
                <Battery size={32} style={{ color: '#00ffcc', marginBottom: '6px' }} />
                <p style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>ESS Battery</p>
                <p style={{ 
                  color: powerFlow.mode === 'charging' ? '#00ff88' : powerFlow.mode === 'discharging' ? '#ff6b9d' : '#facc15', 
                  fontSize: 'clamp(13px, 2.8vw, 16px)', 
                  fontWeight: 'bold',
                  marginTop: '4px'
                }}>
                  {powerFlow.mode === 'charging' ? '충전 중' : powerFlow.mode === 'discharging' ? '방전 중' : '대기'}
                </p>
                <p style={{ color: '#00ffcc', fontSize: 'clamp(16px, 3.5vw, 20px)', fontWeight: 'bold', marginTop: '4px' }}>
                  {powerFlow.rate.toFixed(1)} kW
                </p>
              </div>
            </div>
            
            {/* Load */}
            <div style={{ 
              width: '100%', 
              maxWidth: '300px',
              padding: '12px', 
              background: 'rgba(0, 0, 0, 0.3)', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)', marginBottom: '4px' }}>Load</p>
              <p style={{ color: '#ff6b9d', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold' }}>{powerFlow.load_power.toFixed(1)} kW</p>
            </div>
          </div>
        </div>

        {/* 셀 밸런싱 상태 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gauge size={18} style={{ color: '#00ffcc' }} />
            셀 밸런싱 상세 분석 (16 Cells)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={cellBalancingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="cell" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#facc15" style={{ fontSize: '9px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Bar yAxisId="left" dataKey="voltage" radius={[4, 4, 0, 0]} name="전압">
                {cellBalancingData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.status === 'excellent' ? '#00ff88' : 
                      entry.status === 'good' ? '#00ffcc' : 
                      '#facc15'
                    } 
                  />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="deviation" stroke="#facc15" strokeWidth={2} dot={{ r: 3, fill: '#facc15' }} name="전압 편차" />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: 'clamp(9px, 1.8vw, 11px)', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>우수</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#00ffcc', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>양호</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#facc15', borderRadius: '2px' }}></div>
              <span style={{ color: '#9ca3af' }}>주의</span>
            </div>
          </div>
        </div>
      </div>

      {/* 새로운 디테일 섹션 2: SOH/SOC 트렌드 & 에너지 효율 - Responsive */}
      <div className="trend-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* SOH/SOC 히스토리 트렌드 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#00ffcc' }} />
            SOH/SOC 7일 트렌드 분석
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={healthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '9px' }} domain={[70, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '9px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Area yAxisId="left" type="monotone" dataKey="soc_avg" fill="#00ffcc" fillOpacity={0.2} stroke="#00ffcc" strokeWidth={2} name="평균 SOC (%)" />
              <Line yAxisId="left" type="monotone" dataKey="soh" stroke="#00ff88" strokeWidth={2} dot={{ r: 4, fill: '#00ff88' }} name="SOH (%)" />
              <Bar yAxisId="right" dataKey="cycles" fill="#1a2942" radius={[4, 4, 0, 0]} name="사이클 수" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 에너지 효율 트렌드 */}
        <div style={{
          background: '#0f1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 255, 204, 0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#facc15' }} />
            24시간 에너지 효율 분석
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '9px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '9px' }} domain={[80, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #00ffcc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Line type="monotone" dataKey="charge_eff" stroke="#00ff88" strokeWidth={2} dot={false} name="충전 효율 (%)" />
              <Line type="monotone" dataKey="discharge_eff" stroke="#00ffcc" strokeWidth={2} dot={false} name="방전 효율 (%)" />
              <Line type="monotone" dataKey="roundtrip_eff" stroke="#facc15" strokeWidth={2} strokeDasharray="5 5" dot={false} name="왕복 효율 (%)" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: 'clamp(9px, 1.8vw, 11px)', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#00ff88', fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold' }}>94.2%</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(8px, 1.6vw, 10px)' }}>평균 충전</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#00ffcc', fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold' }}>92.8%</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(8px, 1.6vw, 10px)' }}>평균 방전</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#facc15', fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold' }}>87.4%</p>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(8px, 1.6vw, 10px)' }}>왕복 효율</p>
            </div>
          </div>
        </div>
      </div>

      {/* 새로운 디테일 섹션 3: 셀 온도 히트맵 - Responsive */}
      <div style={{
        background: '#0f1f3a',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(250, 204, 21, 0.3)',
        marginBottom: '16px'
      }}>
        <h2 style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Thermometer size={18} style={{ color: '#facc15' }} />
          배터리 셀 온도 분포 히트맵 (4x4 Grid)
        </h2>
        <div className="heatmap-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2942" />
              <XAxis type="number" dataKey="x" domain={[-0.5, 3.5]} ticks={[0, 1, 2, 3]} stroke="#64748b" style={{ fontSize: '10px' }} />
              <YAxis type="number" dataKey="y" domain={[-0.5, 3.5]} ticks={[0, 1, 2, 3]} stroke="#64748b" style={{ fontSize: '10px' }} reversed />
              <ZAxis type="number" dataKey="temp" range={[300, 700]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#0f1f3a', 
                  border: '1px solid #facc15',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                formatter={(value, name) => {
                  if (name === 'temp') return [`${value.toFixed(1)}°C`, '온도'];
                  return value;
                }}
              />
              <Scatter data={cellTempHeatmap} shape="square">
                {cellTempHeatmap.map((entry, index) => {
                  let fillColor = '#00ff88'; // 정상 (< 38°C)
                  if (entry.temp >= 42) fillColor = '#ff6b9d'; // 경고
                  else if (entry.temp >= 40) fillColor = '#facc15'; // 주의
                  else if (entry.temp >= 38) fillColor = '#00ffcc'; // 양호
                  
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="legend-stats" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            width: '100%'
          }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)', marginBottom: '10px', fontWeight: '600' }}>온도 범례</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#00ff88', borderRadius: '4px', flexShrink: 0 }}></div>
                  <span style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>정상 (&lt; 38°C)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#00ffcc', borderRadius: '4px', flexShrink: 0 }}></div>
                  <span style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>양호 (38-40°C)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#facc15', borderRadius: '4px', flexShrink: 0 }}></div>
                  <span style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>주의 (40-42°C)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#ff6b9d', borderRadius: '4px', flexShrink: 0 }}></div>
                  <span style={{ color: '#9ca3af', fontSize: 'clamp(9px, 1.8vw, 11px)' }}>경고 (≥ 42°C)</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af', fontSize: 'clamp(10px, 2vw, 12px)', marginBottom: '8px' }}>온도 통계</p>
              <p style={{ color: '#00ffcc', fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 'bold' }}>
                Avg: {(cellTempHeatmap.reduce((sum, cell) => sum + cell.temp, 0) / cellTempHeatmap.length).toFixed(1)}°C
              </p>
              <p style={{ color: '#ff6b9d', fontSize: 'clamp(12px, 2.5vw, 13px)', marginTop: '4px' }}>
                Max: {Math.max(...cellTempHeatmap.map(c => c.temp)).toFixed(1)}°C
              </p>
              <p style={{ color: '#00ff88', fontSize: 'clamp(12px, 2.5vw, 13px)', marginTop: '2px' }}>
                Min: {Math.min(...cellTempHeatmap.map(c => c.temp)).toFixed(1)}°C
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* 스크롤바 스타일링 */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1a2942;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #00ffcc;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #00ff88;
        }
        
        /* 모바일 반응형 */
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column !important;
          }
          .status-badge {
            align-self: flex-start;
          }
          .battery-icon {
            width: 28px !important;
            height: 28px !important;
          }
          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
            gap: 10px !important;
          }
          .main-charts, .distribution-charts, .cycle-charts, .trend-charts {
            grid-template-columns: 1fr !important;
          }
          .power-balance-section {
            grid-template-columns: 1fr !important;
          }
          .param-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .heatmap-container .legend-stats {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .metrics-grid {
            grid-template-columns: 1fr !important;
          }
          .param-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BatteryDashboard;
