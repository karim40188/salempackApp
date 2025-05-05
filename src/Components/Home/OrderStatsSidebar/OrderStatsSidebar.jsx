// src/Components/LeftSidebar/LeftSidebar.jsx
import React, { useContext, useEffect, useState } from 'react';
import './OrderStatsSidebar.css';
import { Context } from '../../../context/AuthContext';
import axios from 'axios';
const LeftSidebar = ({ selectedMonth }) => {
  const [orderStats, setOrderStats] = useState([])


  const { baseUrl, token } = useContext(Context)
  const getOrderStats = async () => {
    try {
      const url = selectedMonth
        ? `${baseUrl}/dashboard/statistics/${selectedMonth}`
        : `${baseUrl}/dashboard/statistics`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const currentOrders = res?.data?.currentOrders
      const pendingOrders = res?.data?.pendingOrders
      const acceptedOrders = res?.data?.acceptedOrders
      const manufacturingOrders = res?.data?.manufacturingOrders
      const printingOrders = res?.data?.printingOrders
      const packgingOrders = res?.data.packgingOrders
      const deliveringOrders = res?.data?.deliveringOrders
      const finishedOrders = res?.data?.finishedOrders

      setOrderStats([
        { count: currentOrders, label: 'Current Orders', bg: '#f97316' },
        { count: pendingOrders, label: 'pending Orders', bg: '#ef4444' },
        { count: acceptedOrders, label: 'accepted Orders', bg: '#3b82f6' },
        { count: manufacturingOrders, label: 'Manufacturing Orders', bg: '#2563eb' },
        { count: printingOrders, label: 'printing Orders', bg: '#facc15' },
        { count: packgingOrders, label: 'packaging Orders', bg: '#e879f9' },
        { count: deliveringOrders, label: 'Delivering Orders', bg: '#ef4444' },
        { count: finishedOrders, label: 'finished Orders', bg: '#22c55e' },
      ])


    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {

    getOrderStats();
  }, []);

  return (
    <div>

      <div className="left-sidebar">
        {orderStats?.map((stat, index) => (
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
    </div>

  );
};

export default LeftSidebar;
