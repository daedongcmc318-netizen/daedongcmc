const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
const mockPowerPlants = [
  {
    id: 1,
    name: '대동씨엠씨 1호 태양광발전소',
    status: 'online',
    address: '울산 울주구 서생면 에너지산업6로 23',
    capacity: '99.54kW',
    currentPower: '169.10kWh',
    efficiency: 26,
    dailyGeneration: '1510.10kWh',
    monthlyGeneration: '1.70시간',
    temperature: 12.0,
    weather: 'Cloudy',
    voltage: 380,
    current: 150,
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
    alerts: [
      { date: '07:35:25', type: '경고', message: '노외 발광수 수신 중', inverter: 1 },
      { date: '07:30:20', type: '정보', message: 'Pre-Detection', inverter: 1 },
      { date: '07:10:01', type: '정보', message: 'System Initialization', inverter: 1 }
    ]
  },
  {
    id: 2,
    name: '대동씨엠씨 2호 태양광발전소',
    status: 'online',
    address: '울산 울주구 서생면 에너지산업6로 25',
    capacity: '77.48kW',
    currentPower: '30.32kWh',
    efficiency: 39,
    dailyGeneration: '1568.00kWh',
    monthlyGeneration: '2.01시간',
    temperature: 11.5,
    weather: 'Sunny',
    voltage: 380,
    current: 120,
    realTimePower: {
      current: 77.48,
      voltage: 30.32,
      efficiency: 39,
      frequency: 2.01
    },
    dailyStats: {
      generation: 1568.00,
      usage: 22.15,
      saving: 11.23
    },
    alerts: []
  },
  {
    id: 3,
    name: '대동씨엠씨 3호 태양광발전소',
    status: 'online',
    address: '부산 강서구 호로고루길 27',
    capacity: '30kW',
    currentPower: '12.30kWh',
    efficiency: 41,
    dailyGeneration: '500.00kWh',
    monthlyGeneration: '3.67시간',
    temperature: 13.0,
    weather: 'Partly Cloudy',
    voltage: 380,
    current: 80,
    realTimePower: {
      current: 30.0,
      voltage: 12.30,
      efficiency: 41,
      frequency: 3.67
    },
    dailyStats: {
      generation: 500.00,
      usage: 18.45,
      saving: 9.12
    },
    alerts: []
  }
];

// Generate time series data for charts
const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: i,
    value: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 80 + 20 + Math.random() * 10)
  }));
};

const generateDailyData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    day: i + 1,
    generation: Math.random() * 5 + 28,
    usage: Math.random() * 3 + 25
  }));
};

// Routes

// Get all power plants
app.get('/api/powerplants', (req, res) => {
  res.json({
    success: true,
    data: mockPowerPlants.map(plant => ({
      id: plant.id,
      name: plant.name,
      status: plant.status,
      address: plant.address,
      capacity: plant.capacity,
      currentPower: plant.currentPower,
      efficiency: plant.efficiency,
      dailyGeneration: plant.dailyGeneration,
      monthlyGeneration: plant.monthlyGeneration
    }))
  });
});

// Get power plant by ID
app.get('/api/powerplants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const plant = mockPowerPlants.find(p => p.id === id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Power plant not found'
    });
  }
  
  res.json({
    success: true,
    data: plant
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const total = mockPowerPlants.length;
  const online = mockPowerPlants.filter(p => p.status === 'online').length;
  const warning = mockPowerPlants.filter(p => p.status === 'warning').length;
  const offline = mockPowerPlants.filter(p => p.status === 'offline').length;
  
  res.json({
    success: true,
    data: {
      total,
      online,
      warning,
      offline,
      totalCapacity: mockPowerPlants.reduce((sum, p) => sum + parseFloat(p.capacity), 0).toFixed(2),
      totalGeneration: mockPowerPlants.reduce((sum, p) => sum + parseFloat(p.dailyGeneration), 0).toFixed(2)
    }
  });
});

// Get hourly data
app.get('/api/chart/hourly', (req, res) => {
  res.json({
    success: true,
    data: generateHourlyData()
  });
});

// Get daily data
app.get('/api/chart/daily', (req, res) => {
  res.json({
    success: true,
    data: generateDailyData()
  });
});

// Get alerts for a power plant
app.get('/api/powerplants/:id/alerts', (req, res) => {
  const id = parseInt(req.params.id);
  const plant = mockPowerPlants.find(p => p.id === id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Power plant not found'
    });
  }
  
  res.json({
    success: true,
    data: plant.alerts
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Solar@Care Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
