import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp, Battery, Thermometer, Grid as GridIcon, Power, Gauge, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

const BatteryDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor', 'safety', 'performance', 'economics', 'operation'
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
    // 심화 진단 데이터
    thermalRunawayIndex: 2.3, // 열폭주 위험 지수 (0-10, 0=안전)
    tempRiseRate: 0.15, // 온도 상승률 (°C/min)
    insulationResistance: 850, // 절연 저항 (kΩ)
    gasLevel: 0, // 가스 감지 레벨 (0=정상)
    internalResistance: 12.5, // 내부 저항 (mΩ)
    roundTripEfficiency: 94.2, // 충방전 효율 (%)
    avgDOD: 45.3, // 평균 방전심도 (%)
    costSavings: 1245000, // 비용 절감액 (원/월)
    co2Reduction: 3.8, // CO2 저감량 (톤/월)
    lcoe: 125.5, // LCOE (원/kWh)
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
        // 심화 진단 데이터 업데이트
        thermalRunawayIndex: Math.max(0, Math.min(10, prev.thermalRunawayIndex + (Math.random() - 0.5) * 0.3)),
        tempRiseRate: Math.max(0, Math.min(1, prev.tempRiseRate + (Math.random() - 0.5) * 0.05)),
        insulationResistance: Math.max(500, Math.min(1000, prev.insulationResistance + (Math.random() - 0.5) * 10)),
        internalResistance: Math.max(10, Math.min(15, prev.internalResistance + (Math.random() - 0.5) * 0.2)),
        roundTripEfficiency: Math.max(90, Math.min(96, prev.roundTripEfficiency + (Math.random() - 0.5) * 0.3)),
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // ESS 전체 남은 수명(RUL) 예측 데이터
  const remainingLifeYears = 8.5; // 남은 년수
  const remainingCycles = 5045; // 남은 사이클 수 (10,000 - 4,955)
  const totalDesignCycles = 10000;
  const usedCycles = liveData.cycleCount;
  const remainingCyclesPercent = ((totalDesignCycles - usedCycles) / totalDesignCycles * 100).toFixed(1);

  // RUL 트렌드 데이터 (12개월 예측)
  const rulTrendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}개월`,
    예측RUL: Math.max(0, remainingLifeYears - (i * 0.7) + (Math.random() - 0.5) * 0.3),
    SOH예측: Math.max(80, liveData.soh - (i * 0.5) + (Math.random() - 0.5) * 0.5),
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
      {/* 헤더 + 탭 */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #f0f0f0'
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
        
        {/* 탭 네비게이션 */}
        <div style={{
          padding: '8px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'monitor', icon: '📊', label: '실시간 모니터링', color: '#1890ff' },
            { id: 'safety', icon: '🔥', label: '안전 및 리스크', color: '#f5222d' },
            { id: 'performance', icon: '⚙️', label: '성능 분석', color: '#13c2c2' },
            { id: 'economics', icon: '💰', label: '경제성/환경', color: '#52c41a' },
            { id: 'operation', icon: '🔧', label: '운영/유지보수', color: '#722ed1' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px 16px',
                background: activeTab === tab.id 
                  ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)` 
                  : '#f5f5f5',
                border: 'none',
                borderRadius: '6px',
                color: activeTab === tab.id ? '#fff' : '#595959',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = '#e8e8e8';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = '#f5f5f5';
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 탭 1: 실시간 모니터링 */}
      {activeTab === 'monitor' && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* 좌측: ESS 전체 남은 수명(RUL) 예측 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gridColumn: 'span 2'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#262626', marginBottom: '20px' }}>
            ESS 전체 남은 수명 예측 (RUL)
          </h2>
          
          {/* 핵심 수명 지표 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '12px', 
            marginBottom: '20px' 
          }}>
            {/* 남은 년수 */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '16px',
              color: '#fff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '6px' }}>남은 년수</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {remainingLifeYears.toFixed(1)}
                <span style={{ fontSize: '14px', opacity: 0.9, marginLeft: '4px' }}>년</span>
              </div>
            </div>

            {/* 남은 사이클 */}
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '8px',
              padding: '16px',
              color: '#fff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '6px' }}>남은 사이클</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {remainingCycles.toLocaleString()}
                <span style={{ fontSize: '14px', opacity: 0.9, marginLeft: '4px' }}>회</span>
              </div>
            </div>

            {/* 사용률 */}
            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '8px',
              padding: '16px',
              color: '#fff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '6px' }}>사이클 사용률</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {((usedCycles / totalDesignCycles) * 100).toFixed(1)}
                <span style={{ fontSize: '14px', opacity: 0.9, marginLeft: '4px' }}>%</span>
              </div>
            </div>

            {/* 잔여 용량 비율 */}
            <div style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '8px',
              padding: '16px',
              color: '#fff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '6px' }}>잔여 용량 비율</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {remainingCyclesPercent}
                <span style={{ fontSize: '14px', opacity: 0.9, marginLeft: '4px' }}>%</span>
              </div>
            </div>
          </div>

          {/* RUL 트렌드 차트 */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#667eea', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ color: '#595959' }}>예측 RUL (년)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#52c41a', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ color: '#595959' }}>SOH 예측 (%)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={rulTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#8c8c8c" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" domain={[0, 10]} stroke="#8c8c8c" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" domain={[80, 100]} stroke="#8c8c8c" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }} 
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="예측RUL" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="SOH예측" 
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
          
          {/* 운영 통계 - 추가 섹션 */}
          <div style={{ 
            marginTop: '20px', 
            paddingTop: '20px', 
            borderTop: '1px solid #f0f0f0',
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '16px' 
          }}>
            {/* 총 사이클 */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              background: 'linear-gradient(135deg, #e0f7ff 0%, #d1f0ff 100%)',
              borderRadius: '6px',
              border: '1px solid #bae7ff'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
              <div style={{ fontSize: '12px', color: '#096dd9', marginBottom: '8px' }}>총 사이클</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0050b3' }}>
                {liveData.cycleCount.toLocaleString()}
                <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>회</span>
              </div>
            </div>

            {/* 시스템 효율 */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
              borderRadius: '6px',
              border: '1px solid #91d5ff'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontSize: '12px', color: '#1890ff', marginBottom: '8px' }}>시스템 효율</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0050b3' }}>
                {liveData.efficiency.toFixed(1)}
                <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
              </div>
            </div>

            {/* 저장 용량 */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              borderRadius: '6px',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
              <div style={{ fontSize: '12px', color: '#52c41a', marginBottom: '8px' }}>저장 용량</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#389e0d' }}>
                {liveData.remainingCapacity.toLocaleString()}
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '2px' }}>/</span>
                {liveData.capacity.toLocaleString()}
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>kWh</span>
              </div>
            </div>

            {/* 온도 범위 */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
              borderRadius: '6px',
              border: '1px solid #ffd591'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌡️</div>
              <div style={{ fontSize: '12px', color: '#fa8c16', marginBottom: '8px' }}>온도 범위</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d46b08' }}>
                {liveData.minTemp.toFixed(1)}°C
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '2px', marginRight: '2px' }}>~</span>
                {liveData.maxTemp.toFixed(1)}°C
              </div>
            </div>
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
              transition: 'height 1s ease, background 0.5s ease'
            }}>
            </div>
            
            {/* 충전 퍼센트 표시 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
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
      )}

      {/* 탭 2: 안전 및 리스크 관리 */}
      {activeTab === 'safety' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* 열폭주 위험 지수 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: liveData.thermalRunawayIndex > 5 ? '2px solid #f5222d' : '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              열폭주 위험 지수
            </h3>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: liveData.thermalRunawayIndex > 5 ? '#f5222d' : liveData.thermalRunawayIndex > 3 ? '#faad14' : '#52c41a' }}>
              {liveData.thermalRunawayIndex.toFixed(1)}
              <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>/10</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
              온도 상승률: {liveData.tempRiseRate.toFixed(2)} °C/min
            </div>
          </div>

          {/* 위험도 바 */}
          <div style={{ 
            height: '8px', 
            background: '#f0f0f0', 
            borderRadius: '4px', 
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{ 
              height: '100%', 
              width: `${liveData.thermalRunawayIndex * 10}%`,
              background: liveData.thermalRunawayIndex > 5 ? 'linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)' : 
                         liveData.thermalRunawayIndex > 3 ? 'linear-gradient(90deg, #faad14 0%, #ffc53d 100%)' : 
                         'linear-gradient(90deg, #52c41a 0%, #95de64 100%)',
              transition: 'all 0.5s ease'
            }}></div>
          </div>

          <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
            {liveData.thermalRunawayIndex > 5 ? '⚠️ 위험: 즉시 점검 필요' : 
             liveData.thermalRunawayIndex > 3 ? '⚡ 주의: 모니터링 강화' : 
             '✅ 안전: 정상 범위'}
          </div>
        </div>

        {/* 절연 저항 모니터링 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: liveData.insulationResistance < 600 ? '2px solid #f5222d' : '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              절연 저항
            </h3>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: liveData.insulationResistance < 600 ? '#f5222d' : liveData.insulationResistance < 700 ? '#faad14' : '#52c41a' }}>
              {liveData.insulationResistance.toFixed(0)}
              <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>kΩ</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
              안전 기준: ≥600 kΩ
            </div>
          </div>

          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={Array.from({ length: 20 }, (_, i) => ({
              time: i,
              value: 850 - i * 2 + Math.random() * 20
            }))}>
              <defs>
                <linearGradient id="insulationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#52c41a" fill="url(#insulationGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
            {liveData.insulationResistance < 600 ? '⚠️ 경고: 누전 위험' : '✅ 정상: 절연 양호'}
          </div>
        </div>

        {/* 가스/연기 감지 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: liveData.gasLevel > 0 ? '2px solid #f5222d' : '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>💨</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              가스 감지 센서
            </h3>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              fontSize: '40px', 
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {liveData.gasLevel > 0 ? '🚨' : '✅'}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: liveData.gasLevel > 0 ? '#f5222d' : '#52c41a',
              textAlign: 'center'
            }}>
              {liveData.gasLevel > 0 ? '가스 감지됨' : '정상'}
            </div>
          </div>

          <div style={{ 
            padding: '12px', 
            background: liveData.gasLevel > 0 ? '#fff1f0' : '#f6ffed',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#595959'
          }}>
            <div style={{ marginBottom: '4px', fontWeight: '600' }}>
              오프가스 레벨: {liveData.gasLevel} ppm
            </div>
            <div style={{ color: '#8c8c8c' }}>
              {liveData.gasLevel > 0 ? '⚠️ 즉시 환기 및 점검 필요' : '✅ 오프가스 미검출'}
            </div>
          </div>
        </div>
      </div>
          </div>
        )}

        {/* 탭 3: 정밀 노화 및 성능 진단 */}
        {activeTab === 'performance' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>

      {/* 성능 진단 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* 내부 저항 변화 추이 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gridColumn: 'span 2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>⚙️</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              내부 저항 변화 추이 (IR Trend)
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#8c8c8c' }}>현재 IR</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {liveData.internalResistance.toFixed(1)}
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>mΩ</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8c8c8c' }}>초기 IR</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8c8c8c' }}>
                10.0
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>mΩ</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8c8c8c' }}>증가율</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                +{((liveData.internalResistance - 10) / 10 * 100).toFixed(1)}
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={Array.from({ length: 12 }, (_, i) => ({
              month: `${i}M`,
              ir: 10 + i * 0.2 + Math.random() * 0.3,
              threshold: 15
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#8c8c8c" style={{ fontSize: '11px' }} />
              <YAxis domain={[8, 16]} stroke="#8c8c8c" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  fontSize: '11px'
                }}
              />
              <Line type="monotone" dataKey="ir" stroke="#1890ff" strokeWidth={3} dot={{ fill: '#1890ff', r: 4 }} name="내부 저항" />
              <Line type="monotone" dataKey="threshold" stroke="#f5222d" strokeWidth={2} strokeDasharray="5 5" dot={false} name="임계값" />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
            💡 IR 증가는 배터리 노화의 직접적 지표입니다. 임계값(15mΩ) 도달 시 교체 권장
          </div>
        </div>

        {/* 충·방전 효율 & DOD */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>🔄</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              효율 및 방전심도
            </h3>
          </div>

          {/* Round-Trip Efficiency */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px' }}>
              충·방전 효율 (Round-Trip)
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#13c2c2', marginBottom: '8px' }}>
              {liveData.roundTripEfficiency.toFixed(1)}
              <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
            </div>
            <div style={{ 
              height: '8px', 
              background: '#f0f0f0', 
              borderRadius: '4px', 
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${liveData.roundTripEfficiency}%`,
                background: 'linear-gradient(90deg, #13c2c2 0%, #36cfc9 100%)',
                transition: 'all 0.5s ease'
              }}></div>
            </div>
            <div style={{ fontSize: '10px', color: '#8c8c8c', marginTop: '4px' }}>
              에너지 손실: {(100 - liveData.roundTripEfficiency).toFixed(1)}%
            </div>
          </div>

          {/* Average DOD */}
          <div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '8px' }}>
              평균 방전심도 (Avg DOD)
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1', marginBottom: '8px' }}>
              {liveData.avgDOD.toFixed(1)}
              <span style={{ fontSize: '14px', color: '#8c8c8c', marginLeft: '4px' }}>%</span>
            </div>
            <div style={{ 
              height: '8px', 
              background: '#f0f0f0', 
              borderRadius: '4px', 
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${liveData.avgDOD}%`,
                background: 'linear-gradient(90deg, #722ed1 0%, #9254de 100%)',
                transition: 'all 0.5s ease'
              }}></div>
            </div>
            <div style={{ fontSize: '10px', color: '#8c8c8c', marginTop: '4px' }}>
              {liveData.avgDOD < 50 ? '✅ 적정 사용 (수명 연장에 유리)' : liveData.avgDOD < 80 ? '⚡ 주의 (수명 영향 있음)' : '⚠️ 과방전 (수명 단축 우려)'}
            </div>
          </div>
        </div>
      </div>
          </div>
        )}

        {/* 탭 4: 경제성 및 환경 지표 */}
        {activeTab === 'economics' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>

      {/* 경제성 및 환경 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* 비용 절감액 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>💰</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
              월간 비용 절감액
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            ₩{(liveData.costSavings / 1000).toFixed(0)}K
          </div>
          
          <div style={{ fontSize: '11px', opacity: 0.9 }}>
            📊 연간 예상: ₩{((liveData.costSavings * 12) / 1000000).toFixed(1)}M
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '6px',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>피크/오프피크 차익:</span>
              <span style={{ fontWeight: '600' }}>₩{(liveData.costSavings * 0.6 / 1000).toFixed(0)}K</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>수요관리 인센티브:</span>
              <span style={{ fontWeight: '600' }}>₩{(liveData.costSavings * 0.4 / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>

        {/* 탄소 저감 기여도 */}
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>🌱</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
              월간 CO₂ 저감량
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            {liveData.co2Reduction.toFixed(1)}
            <span style={{ fontSize: '18px', marginLeft: '4px' }}>톤</span>
          </div>
          
          <div style={{ fontSize: '11px', opacity: 0.9 }}>
            🌍 연간 예상: {(liveData.co2Reduction * 12).toFixed(1)} 톤
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '6px',
            fontSize: '11px'
          }}>
            <div style={{ marginBottom: '4px' }}>
              🌳 소나무 {Math.floor(liveData.co2Reduction * 12 * 220)}그루 식재 효과
            </div>
            <div>
              🚗 자동차 {Math.floor(liveData.co2Reduction * 12 / 2.5)}대 연간 배출량 상쇄
            </div>
          </div>
        </div>

        {/* LCOE */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>📈</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
              LCOE (균등화 비용)
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            ₩{liveData.lcoe.toFixed(1)}
            <span style={{ fontSize: '16px', marginLeft: '4px' }}>/kWh</span>
          </div>
          
          <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '16px' }}>
            ⚡ 계통 전력 대비 {((150 - liveData.lcoe) / 150 * 100).toFixed(0)}% 경제적
          </div>
          
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={Array.from({ length: 10 }, (_, i) => ({
              year: i,
              lcoe: 140 - i * 1.5 + Math.random() * 5
            }))}>
              <defs>
                <linearGradient id="lcoeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="lcoe" stroke="#ffffff" fill="url(#lcoeGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
          </div>
        )}

        {/* 탭 5: 운영 및 유지보수 */}
        {activeTab === 'operation' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>

      {/* 운영 및 유지보수 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* 셀 밸런싱 활성화 상태 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>⚖️</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              셀 밸런싱 상태
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {Array.from({ length: 16 }, (_, i) => {
              const isBalancing = Math.random() > 0.7;
              return (
                <div key={i} style={{
                  padding: '12px 8px',
                  background: isBalancing ? '#fff7e6' : '#f6ffed',
                  border: isBalancing ? '1px solid #faad14' : '1px solid #b7eb8f',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '10px', color: '#8c8c8c', marginBottom: '4px' }}>
                    C{i + 1}
                  </div>
                  <div style={{ fontSize: '16px' }}>
                    {isBalancing ? '⚡' : '✅'}
                  </div>
                  <div style={{ fontSize: '9px', color: isBalancing ? '#faad14' : '#52c41a', marginTop: '2px' }}>
                    {isBalancing ? '밸런싱' : '정상'}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ 
            padding: '12px', 
            background: '#f0f5ff', 
            borderRadius: '6px',
            fontSize: '11px',
            color: '#595959'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>📊 밸런싱 통계 (24h)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>총 밸런싱 횟수:</span>
              <span style={{ fontWeight: '600', color: '#1890ff' }}>47회</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>최대 전압 편차:</span>
              <span style={{ fontWeight: '600', color: '#faad14' }}>58mV</span>
            </div>
          </div>
        </div>

        {/* AI 추천 유지보수 스케줄 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              AI 추천 유지보수 스케줄
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { date: '2026. 03. 15', task: '냉각 팬 필터 교체', priority: 'high', icon: '🔴' },
              { date: '2026. 04. 22', task: 'BMS 펌웨어 업데이트', priority: 'medium', icon: '🟡' },
              { date: '2026. 05. 10', task: '절연 저항 정밀 측정', priority: 'medium', icon: '🟡' },
              { date: '2026. 06. 01', task: '셀 밸런싱 회로 점검', priority: 'low', icon: '🟢' },
            ].map((item, index) => (
              <div key={index} style={{
                padding: '12px',
                background: item.priority === 'high' ? '#fff1f0' : item.priority === 'medium' ? '#fffbe6' : '#f6ffed',
                border: `1px solid ${item.priority === 'high' ? '#ffa39e' : item.priority === 'medium' ? '#ffe58f' : '#b7eb8f'}`,
                borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>{item.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#262626' }}>
                    {item.task}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#8c8c8c', marginLeft: '24px' }}>
                  📅 예정일: {item.date}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '16px',
            padding: '12px', 
            background: '#e6f7ff', 
            borderRadius: '6px',
            fontSize: '11px',
            color: '#0050b3'
          }}>
            💡 AI가 운영 데이터 기반으로 최적 점검 시기를 자동 제안합니다
          </div>
        </div>

        {/* 주변 환경 상관관계 분석 */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gridColumn: 'span 2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🌡️</span>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#262626', margin: 0 }}>
              주변 환경 상관관계 분석
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            {/* 환경 지표 */}
            <div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px' }}>외부 온도</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                  28.5°C
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px' }}>외부 습도</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>
                  62%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px' }}>랙 내부 온도</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                  {liveData.temperature.toFixed(1)}°C
                </div>
              </div>
              
              <div style={{ 
                marginTop: '16px',
                padding: '12px', 
                background: '#f6ffed', 
                borderRadius: '6px',
                fontSize: '10px',
                color: '#52c41a'
              }}>
                ✅ HVAC 시스템 적정 가동 중
              </div>
            </div>

            {/* 상관관계 차트 */}
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={Array.from({ length: 24 }, (_, i) => ({
                  hour: `${i}h`,
                  외부온도: 20 + Math.sin(i * Math.PI / 12) * 8 + Math.random() * 2,
                  랙온도: 23 + Math.sin(i * Math.PI / 12) * 3 + Math.random() * 1.5,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#8c8c8c" style={{ fontSize: '10px' }} />
                  <YAxis domain={[15, 35]} stroke="#8c8c8c" style={{ fontSize: '10px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #d9d9d9', 
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                  />
                  <Line type="monotone" dataKey="외부온도" stroke="#fa8c16" strokeWidth={2} dot={false} name="외부 온도" />
                  <Line type="monotone" dataKey="랙온도" stroke="#f5222d" strokeWidth={2} dot={false} name="랙 내부 온도" />
                </LineChart>
              </ResponsiveContainer>
              
              <div style={{ fontSize: '10px', color: '#8c8c8c', marginTop: '8px' }}>
                📊 외부 온도와 랙 온도의 상관계수: 0.87 (강한 양의 상관관계)
              </div>
            </div>
          </div>
        </div>
      </div>
          </div>
        )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideDown {
            from { 
              opacity: 0; 
              transform: translateY(-20px);
              max-height: 0;
            }
            to { 
              opacity: 1; 
              transform: translateY(0);
              max-height: 5000px;
            }
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
