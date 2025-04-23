// src/Components/LeftSidebar/LeftSidebar.jsx
import React from 'react';
import './OrderStatsSidebar.css';

const orderStats = [
  { count: 25, label: 'Current Orders', bg: '#f97316' },
  { count: 25, label: 'pending Orders', bg: '#ef4444' },
  { count: 25, label: 'accepted Orders', bg: '#3b82f6' },
  { count: 25, label: 'Manufacturing Orders', bg: '#2563eb' },
  { count: 25, label: 'printing Orders', bg: '#facc15' },
  { count: 25, label: 'packaging Orders', bg: '#e879f9' },
  { count: 25, label: 'Delivering Orders', bg: '#ef4444' },
  { count: 25, label: 'finished Orders', bg: '#22c55e' },
];

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      {orderStats.map((stat, index) => (
        <div
          key={index}
          className="order-box"
          style={{ backgroundColor: stat.bg }}
        >
          <div className="order-count">{stat.count}</div>
          <div className="order-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
