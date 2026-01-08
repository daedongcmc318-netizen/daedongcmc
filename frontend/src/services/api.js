import axios from 'axios';

// Use Vite proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Power Plants API
export const getPowerPlants = async () => {
  const response = await api.get('/powerplants');
  return response.data;
};

export const getPowerPlantById = async (id) => {
  const response = await api.get(`/powerplants/${id}`);
  return response.data;
};

export const getPowerPlantAlerts = async (id) => {
  const response = await api.get(`/powerplants/${id}/alerts`);
  return response.data;
};

// Statistics API
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Chart Data API
export const getHourlyData = async () => {
  const response = await api.get('/chart/hourly');
  return response.data;
};

export const getDailyData = async () => {
  const response = await api.get('/chart/daily');
  return response.data;
};

export default api;
