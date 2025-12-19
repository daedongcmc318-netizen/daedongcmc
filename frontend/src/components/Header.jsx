import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import './Header.css';

const Header = () => {
  const currentTime = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-text">B-Nexus</span>
          <span className="logo-ai">AI</span>
        </div>
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="발전소 검색하기" />
        </div>
      </div>
      
      <div className="header-right">
        <div className="current-time">{currentTime}</div>
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <button className="icon-btn user-btn">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
