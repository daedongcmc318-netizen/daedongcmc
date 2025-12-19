import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChartPanel.css';
import { dashboardService } from '../services/api';

function ChartPanel({ data }) {
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getEnergyProduction(20);
      if (response.success) {
        setEnergyData(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('차트 데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  // SOC 분포 데이터
  const socData = data?.batteries?.map(b => ({
    name: `배터리 ${b.id}`,
    SOC: b.soc,
    SOH: b.soh
  })) || [];

  // 온도 데이터
  const tempData = data?.batteries?.map(b => ({
    name: `배터리 ${b.id}`,
    temperature: b.temperature
  })) || [];

  return (
    <div className="chart-panel">
      <h2 className="section-title">데이터 분석</h2>
      
      <div className="charts-grid">
        {/* SOC/SOH 차트 */}
        <div className="chart-card">
          <h3 className="chart-title">배터리 충전/수명 상태 (SOC/SOH)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="SOC" fill="#2196f3" name="SOC (%)" />
              <Bar dataKey="SOH" fill="#4caf50" name="SOH (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 온도 차트 */}
        <div className="chart-card">
          <h3 className="chart-title">배터리 온도 현황</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 60]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="temperature" fill="#ff9800" name="온도 (°C)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 에너지 생산량 차트 */}
        {!loading && energyData.length > 0 && (
          <div className="chart-card full-width">
            <h3 className="chart-title">일별 에너지 생산량 (최근 20일)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#2196f3" 
                  strokeWidth={2}
                  name="실제 생산량 (kWh)" 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#4caf50" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="목표 생산량 (kWh)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartPanel;
