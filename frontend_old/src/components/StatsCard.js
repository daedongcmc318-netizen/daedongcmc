import React from 'react';
import './StatsCard.css';

function StatsCard({ title, value, unit, icon, color }) {
  return (
    <div className="stats-card" style={{ borderTopColor: color }}>
      <div className="stats-card-icon" style={{ backgroundColor: color + '20', color: color }}>
        <span>{icon}</span>
      </div>
      <div className="stats-card-content">
        <div className="stats-card-title">{title}</div>
        <div className="stats-card-value">
          <span className="value">{value}</span>
          <span className="unit">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
