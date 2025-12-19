import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BatteryDashboard from './pages/BatteryDashboard';
import Dashboard from './pages/Dashboard';
import PowerPlantDetail from './pages/PowerPlantDetail';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* AI Battery Dashboard - 새로운 메인 대시보드 */}
          <Route path="/" element={<BatteryDashboard />} />
          <Route path="/battery" element={<BatteryDashboard />} />
          
          {/* Solar Power Plant Dashboard - 기존 대시보드 */}
          <Route path="/solar" element={
            <>
              <Header />
              <div className="main-layout">
                <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                  <Dashboard />
                </main>
              </div>
            </>
          } />
          <Route path="/powerplant/:id" element={
            <>
              <Header />
              <div className="main-layout">
                <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                  <PowerPlantDetail />
                </main>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
