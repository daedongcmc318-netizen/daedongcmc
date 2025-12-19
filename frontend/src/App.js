import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import { batteryService } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 초기 데이터 로드
    const initializeApp = async () => {
      try {
        setLoading(true);
        await batteryService.getStatus();
        setLoading(false);
      } catch (err) {
        console.error('앱 초기화 실패:', err);
        setError('시스템 초기화에 실패했습니다.');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>시스템 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>오류 발생</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
