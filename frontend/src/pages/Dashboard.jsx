import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, AlertTriangle, Power, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPowerPlants, getStats, getHourlyData, getDailyData } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [powerPlants, setPowerPlants] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    warning: 0,
    offline: 0
  });
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plantsRes, statsRes, hourlyRes, dailyRes] = await Promise.all([
        getPowerPlants(),
        getStats(),
        getHourlyData(),
        getDailyData()
      ]);
      
      setPowerPlants(plantsRes.data || []);
      setStats(statsRes.data || {});
      setHourlyData(hourlyRes.data || []);
      setDailyData(dailyRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to mock data
      const mockPlants = [
      {
        id: 1,
        name: '대동씨엠씨 1호 태양광발전소',
        status: 'ON-OFF',
        address: '울산 울주구 서생면 에너지산업6로 23',
        capacity: '99.54kW',
        currentPower: '169.10kWh',
        efficiency: '26%',
        dailyGeneration: '1510.10kWh',
        monthlyGeneration: '1.70시간'
      },
      {
        id: 2,
        name: '대동씨엠씨 2호 태양광발전소',
        status: 'ON-OFF',
        address: '울산 울주구 서생면 에너지산업6로 25',
        capacity: '77.48kW',
        currentPower: '30.32kWh',
        efficiency: '39%',
        dailyGeneration: '1568.00kWh',
        monthlyGeneration: '2.01시간'
      },
      {
        id: 3,
        name: '대동씨엠씨 3호 태양광발전소',
        status: 'ON-OFF',
        address: '부산 강서구 호로고루길 27',
        capacity: '30kW',
        currentPower: '12.30kWh',
        efficiency: '41%',
        dailyGeneration: '500.00kWh',
        monthlyGeneration: '3.67시간'
      }
    ];
    
      setPowerPlants(mockPlants);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>전체 발전 현황</h1>
        <div className="date-display">
          {new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e6f2ff' }}>
            <Zap size={32} color="#0066ff" />
          </div>
          <div className="stat-content">
            <div className="stat-label">운영중 발전소</div>
            <div className="stat-value">{stats.online} <span className="stat-unit">개소</span></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e6ffe6' }}>
            <Activity size={32} color="#00cc66" />
          </div>
          <div className="stat-content">
            <div className="stat-label">정상</div>
            <div className="stat-value">{stats.online} <span className="stat-unit">개소</span></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff4e6' }}>
            <AlertTriangle size={32} color="#ff9933" />
          </div>
          <div className="stat-content">
            <div className="stat-label">경고</div>
            <div className="stat-value">{stats.warning} <span className="stat-unit">개소</span></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ffe6e6' }}>
            <Power size={32} color="#ff3333" />
          </div>
          <div className="stat-content">
            <div className="stat-label">발전 오류</div>
            <div className="stat-value">{stats.offline} <span className="stat-unit">개소</span></div>
          </div>
        </div>
      </div>

      {/* 발전소 목록 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">발전소 목록</h2>
          <div className="filter-buttons">
            <button className="filter-btn active">전체</button>
            <button className="filter-btn">정상 운영</button>
            <button className="filter-btn">경고</button>
          </div>
        </div>

        <div className="power-plant-table">
          <table>
            <thead>
              <tr>
                <th>상태</th>
                <th>발전소명</th>
                <th>ON/OFF</th>
                <th>발전소</th>
                <th>PV 설비</th>
                <th>이효율</th>
                <th>발전량</th>
                <th>발전 시간</th>
              </tr>
            </thead>
            <tbody>
              {powerPlants.map((plant) => (
                <tr 
                  key={plant.id} 
                  onClick={() => navigate(`/powerplant/${plant.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span className="status-badge status-online">정상</span>
                  </td>
                  <td>
                    <div className="plant-name-cell">
                      <div className="plant-name">{plant.name}</div>
                      <div className="plant-address">{plant.address}</div>
                    </div>
                  </td>
                  <td>
                    <button className="onoff-btn">ON-OFF연계</button>
                  </td>
                  <td>{plant.capacity}</td>
                  <td>{plant.currentPower}</td>
                  <td>
                    <div className="efficiency-bar">
                      <div 
                        className="efficiency-fill" 
                        style={{ width: plant.efficiency }}
                      ></div>
                    </div>
                    <span className="efficiency-text">{plant.efficiency}</span>
                  </td>
                  <td className="generation-value">{plant.dailyGeneration}</td>
                  <td>{plant.monthlyGeneration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="charts-grid">
        <div className="card chart-card">
          <h3 className="card-title">시간대별 발전량</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0066ff" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">일일 발전량 추이</h3>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color" style={{ background: '#ff9933' }}></span>
              발전량
            </span>
            <span className="legend-item">
              <span className="legend-color" style={{ background: '#0066ff' }}></span>
              소비량
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="generation" fill="#ff9933" />
              <Bar dataKey="usage" fill="#0066ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
