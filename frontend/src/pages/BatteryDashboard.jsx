import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp, Cpu, Battery } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // 실시간 차트 데이터 생성
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
    month: `${i + 1}월`,
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

  const getStatusColor = (value, min, max) => {
    if (value < min) return 'text-red-400';
    if (value > max) return 'text-yellow-400';
    return 'text-neon-green';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-10 h-10 text-cyan-400 animate-pulse-slow" />
              <div>
                <h1 className="text-3xl font-bold neon-text">B-Nexus AI</h1>
                <p className="text-gray-400 text-sm">Battery Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-8">
              <div className="status-indicator bg-neon-green"></div>
              <span className="text-neon-green text-sm font-medium">실시간 데이터 수신 중</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">시스템 가동 시간</p>
            <p className="text-xl font-mono text-cyan-400">{time.toLocaleTimeString('ko-KR')}</p>
          </div>
        </div>
      </header>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* SOH Card */}
        <div className="metric-card animate-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">State of Health</p>
              <h3 className="text-5xl font-bold text-neon-green">{liveData.soh.toFixed(1)}%</h3>
            </div>
            <Battery className="w-12 h-12 text-neon-green" />
          </div>
          <div className="mt-4 pt-4 border-t border-navy-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">배터리 건강도</span>
              <span className="text-neon-green">● 정상</span>
            </div>
          </div>
        </div>

        {/* SOC Card */}
        <div className="metric-card animate-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">State of Charge</p>
              <h3 className="text-5xl font-bold text-cyan-400">{liveData.soc.toFixed(1)}%</h3>
            </div>
            <Zap className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="mt-4 pt-4 border-t border-navy-700">
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-neon-green h-2 rounded-full transition-all duration-1000"
                style={{ width: `${liveData.soc}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs mt-2">실시간 충전 상태</p>
          </div>
        </div>

        {/* RUL Card */}
        <div className="metric-card animate-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Remaining Useful Life</p>
              <h3 className="text-5xl font-bold text-neon-cyan">{Math.floor(liveData.rul)}</h3>
              <p className="text-gray-400 text-sm">Cycles</p>
            </div>
            <Clock className="w-12 h-12 text-neon-cyan" />
          </div>
          <div className="mt-4 pt-4 border-t border-navy-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">AI 예측 수명</span>
              <span className="text-cyan-400">약 {Math.floor(liveData.rul / 30)}개월</span>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 실시간 모니터링 차트 */}
        <div className="lg:col-span-2 bg-navy-800 rounded-xl p-6 border border-navy-700 glow-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-cyan-400" />
              실시간 배터리 모니터링
            </h2>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-gray-400">온도 (°C)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
                <span className="text-gray-400">전압 (V)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-navy-900/50 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">현재 온도</p>
              <p className={`text-2xl font-bold ${getStatusColor(liveData.temperature, 30, 40)}`}>
                {liveData.temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="bg-navy-900/50 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">현재 전압</p>
              <p className={`text-2xl font-bold ${getStatusColor(liveData.voltage, 3.6, 4.2)}`}>
                {liveData.voltage.toFixed(2)}V
              </p>
            </div>
            <div className="bg-navy-900/50 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">현재 전류</p>
              <p className="text-2xl font-bold text-neon-cyan">
                {liveData.current.toFixed(1)}A
              </p>
            </div>
          </div>
        </div>

        {/* AI 진단 로그 */}
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 glow-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-cyan-400" />
              AI 진단 알림
            </h2>
            <div className="status-indicator bg-cyan-400"></div>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {aiLogs.map((log, index) => (
              <div 
                key={log.id}
                className={`ai-log-item ${
                  log.level === 'warning' ? 'border-yellow-400' : 
                  log.level === 'success' ? 'border-neon-green' : 
                  'border-cyan-400'
                } ${index === 0 ? 'animate-pulse-slow' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{log.icon}</span>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
                <p className="text-sm text-gray-300">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI 예측 수명 곡선 */}
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 glow-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-cyan-400" />
            AI 예측 수명 곡선 (Expected Life Curve)
          </h2>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
              <span className="text-gray-400">AI 예측</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-neon-green rounded-full mr-2"></div>
              <span className="text-gray-400">실제 성능</span>
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
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
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
    </div>
  );
};

export default BatteryDashboard;
