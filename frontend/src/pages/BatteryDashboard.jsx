import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp, Battery, Thermometer, Grid as GridIcon, Power, Gauge } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

const BatteryDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [liveData, setLiveData] = useState({
    soh: 97.1,
    soc: 99.0,
    sop: 98.7,
    sob: 100.0,
    temperature: 25.3,
    voltage: 406.7,
    current: 1.5,
    power: 610.2,
    chargeEnergy: 1018.7,
    dischargeEnergy: 998.8,
    efficiency: 97.3,
    cycleCount: 4955,
    maxTemp: 24.5,
    minTemp: 23.2,
    capacity: 2500, // kWh
    remainingCapacity: 2475, // kWh
  });

  // 실시간 데이터 애니메이션
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setLiveData(prev => ({
        ...prev,
        soh: Math.max(95, Math.min(99, prev.soh + (Math.random() - 0.5) * 0.2)),
        soc: Math.max(95, Math.min(100, prev.soc + (Math.random() - 0.5) * 0.5)),
        temperature: Math.max(23, Math.min(27, prev.temperature + (Math.random() - 0.5) * 0.3)),
        voltage: Math.max(400, Math.min(410, prev.voltage + (Math.random() - 0.5) * 2)),
        current: Math.max(1, Math.min(2, prev.current + (Math.random() - 0.5) * 0.1)),
        power: Math.max(600, Math.min(620, prev.power + (Math.random() - 0.5) * 5)),
        maxTemp: Math.max(23, Math.min(28, prev.maxTemp + (Math.random() - 0.5) * 0.2)),
        minTemp: Math.max(22, Math.min(25, prev.minTemp + (Math.random() - 0.5) * 0.2)),
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // ESS 수명 예측 데이터 (7일)
  const healthTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: `${i + 1}일`,
    실제수명: 97 - i * 0.3 + Math.random() * 0.5,
    예측수명: 96.5 - i * 0.25 + Math.random() * 0.5,
  }));

  // 배터리 정보 데이터 (소수점 1자리)
  const batteryDetails = [
    { icon: '🌡️', label: '배터리 온도', value: liveData.temperature.toFixed(1), unit: '℃', color: '#1890ff' },
    { icon: '⚡', label: '셀 전압', value: liveData.voltage.toFixed(1), unit: 'V', color: '#52c41a' },
    { icon: '🔌', label: '전류', value: liveData.current.toFixed(1), unit: 'A', color: '#faad14' },
    { icon: '💡', label: '출력', value: liveData.power.toFixed(1), unit: 'kW', color: '#f5222d' },
  ];

  // 충방전 정보
  const energyInfo = [
    { icon: '⬆️', label: '충전량', value: liveData.chargeEnergy.toFixed(1), unit: 'kWh', color: '#13c2c2' },
    { icon: '⬇️', label: '방전량', value: liveData.dischargeEnergy.toFixed(1), unit: 'kWh', color: '#722ed1' },
  ];

  // 셀 전압 분포 데이터 (16셀)
  const cellVoltageData = Array.from({ length: 16 }, (_, i) => ({
    cell: `C${i + 1}`,
    voltage: 3.7 + Math.random() * 0.15,
  }));

  // 원형 게이지용 데이터 생성
  const createGaugeData = (value, color) => [
    { name: 'value', value: value, fill: color },
    { name: 'empty', value: 100 - value, fill: '#e8e8e8' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f2f5',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* 헤더 */}
      <div style={{
        background: '#fff',
        padding: '16px 24px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', margin: 0 }}>
            ESS 배터리 진단 솔루션
          </h1>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          color: '#595959',
          fontSize: '14px'
        }}>
          <div>
            <Clock size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {time.toLocaleTimeString('ko-KR')}
          </div>
          <div style={{
            background: '#f0f9ff',
            padding: '6px 16px',
            borderRadius: '4px',
            color: '#1890ff',
            fontWeight: '600'
          }}>
            실시간 모니터링
          </div>
        </div>
      </div>

      {/* 메인 대시보드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* 좌측: ESS 수명 예측 차트 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gridColumn: 'span 2'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            ESS 수명 예측
          </h2>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#1890ff', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ color: '#595959' }}>실제 수명</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#52c41a', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ color: '#595959' }}>예측 수명</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#8c8c8c" style={{ fontSize: '12px' }} />
              <YAxis domain={[90, 100]} stroke="#8c8c8c" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="실제수명" 
                stroke="#1890ff" 
                strokeWidth={3}
                dot={{ fill: '#1890ff', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="예측수명" 
                stroke="#52c41a" 
                strokeWidth={3}
                dot={{ fill: '#52c41a', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 우측 상단: 큰 원형 게이지들 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          {/* SOH 게이지 */}
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: '8px', fontWeight: '500' }}>
              SOH
            </div>
            <div style={{ fontSize: '11px', color: '#bfbfbf', marginBottom: '12px' }}>
              배터리 건강도
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart 
                innerRadius="70%" 
                outerRadius="100%" 
                data={createGaugeData(liveData.soh, '#1890ff')}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff', marginTop: '-60px' }}>
              {liveData.soh.toFixed(1)}
              <span style={{ fontSize: '16px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
            </div>
          </div>

          {/* SOC 게이지 */}
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: '8px', fontWeight: '500' }}>
              SOC
            </div>
            <div style={{ fontSize: '11px', color: '#bfbfbf', marginBottom: '12px' }}>
              충전 상태
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart 
                innerRadius="70%" 
                outerRadius="100%" 
                data={createGaugeData(liveData.soc, '#52c41a')}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a', marginTop: '-60px' }}>
              {liveData.soc.toFixed(1)}
              <span style={{ fontSize: '16px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
            </div>
          </div>
        </div>

        {/* 배터리 상세 정보 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gridColumn: 'span 2'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            배터리 정보
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            {batteryDetails.map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '16px',
                background: '#fafafa',
                borderRadius: '6px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>{item.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>
                  {item.value}
                  <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESS 배터리 상태 - 동적 충전 표시 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '12px', fontWeight: '600' }}>ESS 충전상태</div>
          
          {/* 동적 배터리 게이지 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '160px',
            background: '#f0f0f0',
            borderRadius: '8px',
            border: '3px solid #1890ff',
            marginBottom: '16px',
            overflow: 'hidden'
          }}>
            {/* 충전 레벨 (하단에서 상단으로) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${liveData.soc}%`,
              background: `linear-gradient(to top, 
                ${liveData.soc > 80 ? '#52c41a' : liveData.soc > 50 ? '#faad14' : '#f5222d'}, 
                ${liveData.soc > 80 ? '#95de64' : liveData.soc > 50 ? '#ffd666' : '#ff7875'})`,
              transition: 'height 1s ease, background 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Battery size={60} style={{ color: '#fff', opacity: 0.9 }} />
            </div>
            
            {/* 충전 퍼센트 표시 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '32px',
              fontWeight: 'bold',
              color: liveData.soc < 50 ? '#262626' : '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10
            }}>
              {liveData.soc.toFixed(1)}%
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#8c8c8c', marginBottom: '4px' }}>🔥 최고 온도</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f5222d' }}>{liveData.maxTemp.toFixed(1)}°C</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#8c8c8c', marginBottom: '4px' }}>❄️ 최저 온도</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>{liveData.minTemp.toFixed(1)}°C</div>
            </div>
          </div>
        </div>

        {/* 배터리 세부 상태 - SOP/SOB 수정 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            배터리 상태
          </h2>
          
          {/* SOP & SOB 개선된 게이지 */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px', fontWeight: '500' }}>SOP</div>
              <div style={{ fontSize: '10px', color: '#bfbfbf', marginBottom: '8px' }}>출력 전력</div>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <ResponsiveContainer width={90} height={90}>
                  <RadialBarChart 
                    innerRadius="65%" 
                    outerRadius="100%" 
                    data={createGaugeData(liveData.sop, '#13c2c2')}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ 
                  position: 'absolute', 
                  top: '55%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#13c2c2'
                }}>
                  {liveData.sop.toFixed(1)}
                  <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '-2px' }}>%</span>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px', fontWeight: '500' }}>SOB</div>
              <div style={{ fontSize: '10px', color: '#bfbfbf', marginBottom: '8px' }}>균형성</div>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <ResponsiveContainer width={90} height={90}>
                  <RadialBarChart 
                    innerRadius="65%" 
                    outerRadius="100%" 
                    data={createGaugeData(liveData.sob, '#722ed1')}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ 
                  position: 'absolute', 
                  top: '55%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#722ed1'
                }}>
                  {liveData.sob.toFixed(1)}
                  <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '-2px' }}>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 충방전 정보 */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            {energyInfo.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < energyInfo.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', color: '#595959' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: item.color }}>
                  {item.value}
                  <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 시스템 상태 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            시스템 상태
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#f6ffed',
              borderRadius: '6px',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ fontSize: '20px' }}>✅</div>
              <div>
                <div style={{ fontSize: '13px', color: '#52c41a', fontWeight: '600' }}>정상</div>
                <div style={{ fontSize: '11px', color: '#8c8c8c' }}>모든 시스템 정상 작동</div>
              </div>
            </div>
            <div style={{
              padding: '12px',
              background: '#fafafa',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#8c8c8c',
              textAlign: 'center'
            }}>
              마지막 점검: {time.toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>

        {/* 셀 전압 분포 차트 (우측 하단 빈칸) */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            셀 전압 분포
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cellVoltageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="cell" stroke="#8c8c8c" style={{ fontSize: '10px' }} />
              <YAxis domain={[3.5, 4.0]} stroke="#8c8c8c" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                formatter={(value) => `${value.toFixed(3)} V`}
              />
              <Bar dataKey="voltage" radius={[4, 4, 0, 0]}>
                {cellVoltageData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.voltage > 3.8 ? '#52c41a' : entry.voltage > 3.75 ? '#1890ff' : '#faad14'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            marginTop: '12px',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#52c41a', borderRadius: '2px' }}></span>
              <span style={{ color: '#8c8c8c' }}>높음 (&gt;3.8V)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#1890ff', borderRadius: '2px' }}></span>
              <span style={{ color: '#8c8c8c' }}>정상 (3.75-3.8V)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#faad14', borderRadius: '2px' }}></span>
              <span style={{ color: '#8c8c8c' }}>주의 (&lt;3.75V)</span>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          div[style*="background: #fff"] {
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default BatteryDashboard;
