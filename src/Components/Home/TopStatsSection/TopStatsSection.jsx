// src/Pages/HomePage/TopStats.jsx
import React from 'react';
import './TopStatsSection.css';

const TopStats = () => {
  return (
    <div className="top-stats-container">
      <div className="top-row">
        <div className="stat-card income">
          <h2>300,000 EGP</h2>
          <p>Current Orders Income</p>
        </div>
        <div className="stat-card clients">
          <h2>54</h2>
          <p>Total Clients</p>
        </div>
      </div>
      <div className="bottom-row">
        <div className="stat-card orders">
          <h2>25</h2>
          <p>Last Month Order Number</p>
        </div>
        <div className="stat-card last-income">
          <h2>250,000 EGP</h2>
          <p>Last Month Order Income</p>
        </div>
        <div className="stat-card cups">
          <h2>25</h2>
          <p>Cup Orders</p>
        </div>
        <div className="stat-card boxes">
          <h2>25</h2>
          <p>Corrugated Box Orders</p>
        </div>
      </div>
    </div>
  );
};

export default TopStats;
