import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThermometerSun, Zap, Battery, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './PowerPlantDetail.css';

const PowerPlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState(null);

  useEffect(() => {
    // Mock data - 실제로는 API에서 가져옴
    const mockData = {
      id: id,
      name: '대동씨엠씨 1호 태양광발전소',
      address: '울산 울주구 서생면 에너지산업6로 23',
      status: '정상 운영',
      temperature: 12.0,
      weather: 'Cloudy',
      realTimePower: {
        current: 99.54,
        voltage: 169.10,
        efficiency: 26,
        frequency: 1.70
      },
      dailyStats: {
        generation: 1510.10,
        usage: 25.63,
        saving: 12.89
      },
      inverters: [
        { id: 1, status: '정상', alerts: [] },
        { id: 2, status: '정상', alerts: [] },
        { id: 3, status: '정상', alerts: [] }
      ],
      alerts: [
        { date: '07:35:25', type: '경고', message: '노외 발광수 수신 중' },
        { date: '07:30:20', type: '정보', message: 'Pre-Detection' },
        { date: '07:10:01', type: '정보', message: 'System Initialization' }
      ]
    };
    
    setPlantData(mockData);
  }, [id]);

  // 시간대별 발전 데이터
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    power: Math.sin((i - 6) * Math.PI / 12) * 80 + 20
  }));

  // 일간 발전 추이
  const dailyTrend = Array.from({ length: 20 }, (_, i) => ({
    day: i + 1,
    generation: Math.random() * 10 + 25,
    target: 30
  }));

  if (!plantData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="power-plant-detail">
      {/* 헤더 */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-info">
          <h1>{plantData.name}</h1>
          <p className="address">{plantData.address}</p>
        </div>
        <div className="weather-info">
          <ThermometerSun size={24} />
          <span>{plantData.temperature}°C</span>
          <span className="weather-status">{plantData.weather}</span>
        </div>
      </div>

      {/* 실시간 현황 */}
      <div className="realtime-section">
        <div className="card">
          <h2 className="section-title">운영중 발전소</h2>
          <div className="realtime-grid">
            <div className="realtime-card">
              <div className="realtime-icon" style={{ background: '#e6f2ff' }}>
                <Zap size={28} color="#0066ff" />
              </div>
              <div className="realtime-content">
                <div className="realtime-label">현재 발전량</div>
                <div className="realtime-value">{plantData.realTimePower.current} <span>kW</span></div>
              </div>
            </div>

            <div className="realtime-card">
              <div className="realtime-icon" style={{ background: '#e6ffe6' }}>
                <Battery size={28} color="#00cc66" />
              </div>
              <div className="realtime-content">
                <div className="realtime-label">전압</div>
                <div className="realtime-value">{plantData.realTimePower.voltage} <span>kWh</span></div>
              </div>
            </div>

            <div className="realtime-card">
              <div className="realtime-icon" style={{ background: '#fff4e6' }}>
                <TrendingUp size={28} color="#ff9933" />
              </div>
              <div className="realtime-content">
                <div className="realtime-label">발전 효율</div>
                <div className="realtime-value">{plantData.realTimePower.efficiency} <span>%</span></div>
              </div>
            </div>

            <div className="realtime-card">
              <div className="realtime-icon" style={{ background: '#f0e6ff' }}>
                <Activity size={28} color="#9933ff" />
              </div>
              <div className="realtime-content">
                <div className="realtime-label">주파수</div>
                <div className="realtime-value">{plantData.realTimePower.frequency} <span>시간</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 실시간 발전 그래프 */}
        <div className="card realtime-chart">
          <h3 className="section-title">실시간 발전</h3>
          <div className="power-gauge">
            <div className="gauge-value">{plantData.realTimePower.current}</div>
            <div className="gauge-unit">kW</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData.slice(0, 12)}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0066ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis hide />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="power" 
                stroke="#0066ff" 
                fillOpacity={1} 
                fill="url(#colorPower)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 인버터 상태 및 알람 */}
      <div className="info-grid">
        <div className="card">
          <h3 className="section-title">일별 발전 추이</h3>
          <div className="trend-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: '#ff9933' }}></span>
              발전량
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: '#0066ff' }}></span>
              목표
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="generation" 
                stroke="#ff9933" 
                fill="#ff9933" 
                fillOpacity={0.6}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#0066ff" 
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title">인버터 경보 이력 조회</h3>
          <div className="alerts-list">
            <div className="alert-filters">
              <select className="alert-filter">
                <option>수신 시각</option>
                <option>발생 시각</option>
              </select>
              <select className="alert-filter">
                <option>인버터</option>
                <option>전체</option>
              </select>
              <select className="alert-filter">
                <option>상태</option>
                <option>정상</option>
                <option>경고</option>
              </select>
            </div>
            
            <div className="alerts-table">
              <table>
                <thead>
                  <tr>
                    <th>수신 시각</th>
                    <th>인버터</th>
                    <th>상태</th>
                    <th>설명 메시지</th>
                  </tr>
                </thead>
                <tbody>
                  {plantData.alerts.map((alert, index) => (
                    <tr key={index}>
                      <td>{alert.date}</td>
                      <td>1</td>
                      <td>
                        <span className={`alert-badge ${alert.type === '경고' ? 'warning' : 'info'}`}>
                          {alert.type}
                        </span>
                      </td>
                      <td>{alert.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 발전 통계 */}
      <div className="card stats-section">
        <h3 className="section-title">발전 통계</h3>
        <div className="stats-boxes">
          <div className="stats-box">
            <div className="stats-label">일일 발전량</div>
            <div className="stats-value">{plantData.dailyStats.generation} <span>kWh</span></div>
            <div className="stats-badge green">가동중</div>
          </div>
          <div className="stats-box">
            <div className="stats-label">당일 발전</div>
            <div className="stats-value">{plantData.dailyStats.usage} <span>kW</span></div>
          </div>
          <div className="stats-box">
            <div className="stats-label">금일 전력</div>
            <div className="stats-value">{plantData.dailyStats.saving} <span>kW</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Activity = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default PowerPlantDetail;
