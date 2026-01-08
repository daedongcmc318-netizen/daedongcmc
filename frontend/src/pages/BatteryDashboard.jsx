import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp, Battery, Thermometer, Grid as GridIcon, Power, Gauge } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const BatteryDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [liveData, setLiveData] = useState({
    soh: 97.1,
    soc: 99.0,
    sop: 98.7,
    sob: 100.0,
    temperature: 25,
    voltage: 406.7,
    current: 1.5,
    power: 610,
    chargeEnergy: 1018.7,
    dischargeEnergy: 998.8,
    efficiency: 97.3,
    cycleCount: 4955,
    maxTemp: 24,
    minTemp: 23,
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

  // 배터리 정보 데이터
  const batteryDetails = [
    { icon: '🌡️', label: '배터리 온도', value: `${liveData.temperature}`, unit: '℃', color: '#1890ff' },
    { icon: '⚡', label: '셀 전압', value: `${liveData.voltage.toFixed(1)}`, unit: 'V', color: '#52c41a' },
    { icon: '🔌', label: '전류', value: `${liveData.current.toFixed(1)}`, unit: 'A', color: '#faad14' },
    { icon: '💡', label: '출력', value: `${liveData.power}`, unit: 'kW', color: '#f5222d' },
  ];

  // 충방전 정보
  const energyInfo = [
    { icon: '⬆️', label: '충전량', value: `${liveData.chargeEnergy.toFixed(1)}`, unit: 'kWh', color: '#13c2c2' },
    { icon: '⬇️', label: '방전량', value: `${liveData.dischargeEnergy.toFixed(1)}`, unit: 'kWh', color: '#722ed1' },
  ];

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
            ESS 수명 예측
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

        {/* ESS 배터리 상태 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '12px' }}>ESS 충전상태</div>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '160px',
            background: 'linear-gradient(to right, #e6f7ff, #bae7ff)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Battery size={80} style={{ color: '#1890ff' }} />
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1890ff'
            }}>
              {liveData.soc.toFixed(1)}%
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#8c8c8c', marginBottom: '4px' }}>🔥 최고 온도</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f5222d' }}>{liveData.maxTemp}°C</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#8c8c8c', marginBottom: '4px' }}>❄️ 최저 온도</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>{liveData.minTemp}°C</div>
            </div>
          </div>
        </div>

        {/* 배터리 세부 상태 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            배터리 상태
          </h2>
          
          {/* SOP & SOB 작은 게이지 */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>SOP</div>
              <div style={{ fontSize: '11px', color: '#bfbfbf', marginBottom: '8px' }}>출력 전력</div>
              <ResponsiveContainer width={80} height={80}>
                <RadialBarChart 
                  innerRadius="60%" 
                  outerRadius="100%" 
                  data={createGaugeData(liveData.sop, '#13c2c2')}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={5} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#13c2c2', marginTop: '-50px' }}>
                {liveData.sop.toFixed(1)}
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>%</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>SOB</div>
              <div style={{ fontSize: '11px', color: '#bfbfbf', marginBottom: '8px' }}>균형성</div>
              <ResponsiveContainer width={80} height={80}>
                <RadialBarChart 
                  innerRadius="60%" 
                  outerRadius="100%" 
                  data={createGaugeData(liveData.sob, '#722ed1')}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={5} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1', marginTop: '-50px' }}>
                {liveData.sob.toFixed(1)}
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>%</span>
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

        {/* 이상상태 */}
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

        {/* ESS 운영 통계 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            운영 통계
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#e6f7ff', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#1890ff', marginBottom: '8px', fontWeight: '500' }}>
                시스템 효율
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                {liveData.efficiency}
                <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '16px', background: '#f6ffed', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#52c41a', marginBottom: '8px', fontWeight: '500' }}>
                총 사이클
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {liveData.cycleCount.toLocaleString()}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff7e6', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#faad14', marginBottom: '8px', fontWeight: '500' }}>
                저장 용량
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                {liveData.remainingCapacity.toLocaleString()}
                <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>/ {liveData.capacity} kWh</span>
              </div>
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
