// src/Pages/HomePage/TopStats.jsx
import React, { useContext, useEffect, useState } from 'react';
import './TopStatsSection.css';
import axios from 'axios';
import { Context } from '../../../context/AuthContext';

const TopStats = ({ selectedMonth}) => {
  const { baseUrl, token } = useContext(Context)
  const [stats, setStats] = useState({})
  const getStats = async () => {
    try {
      const url = selectedMonth
        ? `${baseUrl}/dashboard/statistics/${selectedMonth}`
        : `${baseUrl}/dashboard/statistics`; // أو المسار الافتراضي عند عدم وجود شهر
  
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setStats(res?.data);
      console.log(res?.data)
    } catch (err) {
      console.log(err);
    }
  };
  


  useEffect(() => {
    getStats();
  }, [selectedMonth]);
  
  return (
    <div className="top-stats-container">

      <div className="top-row">
        <div className="stat-card income">
          <h2>{stats.currentOrdersIncome} EGP</h2>
          <p>Current Orders Income</p>
        </div>
        <div className="stat-card clients">
          <h2>{stats.clientCount}</h2>
          <p>Total Clients</p>
        </div>
      </div>
      <div className="bottom-row">
        <div className="stat-card orders">
          <h2>{stats.lastMonthOrdersNumber}</h2>
          <p>Last Month Order Number</p>
        </div>
        <div className="stat-card last-income">
          <h2>{stats.lastMonthOrdersIncome} EGP</h2>
          <p>Last Month Order Income</p>
        </div>
        <div className="stat-card cups">
          <h2>{stats.cupOrders}</h2>
          <p>Cup Orders</p>
        </div>
        <div className="stat-card boxes">
          <h2>{stats.corrugatedBoxOrders}</h2>
          <p>Corrugated Box Orders</p>
        </div>
      </div>
    </div>
  );
};

export default TopStats;
