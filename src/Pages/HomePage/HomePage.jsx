import React, { useContext, useEffect, useState } from 'react';
import theme from '../../Theme/theme';
import LeftSidebar from '../../Components/Home/OrderStatsSidebar/OrderStatsSidebar';
import TopStats from '../../Components/Home/TopStatsSection/TopStatsSection';
import OrdersTable from '../../Components/Home/OrdersTable/OrdersTable';
import NextTasksPanel from '../../Components/Home/NextTasks/NextTasks';
import "./HomeStyle.css"
import axios from 'axios';
import { Context } from '../../context/AuthContext';

const Home = () => {
  const { baseUrl, token} = useContext(Context);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // ✅ جديد
  const getMonths = async () => {
    try {
      const res = await axios.get(`${baseUrl}/dashboard/statistics/getmonth`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMonths(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMonths();
  }, []);

  return (
    <div>
      <div style={{ flex: '1', marginLeft: '10px' }}>
        <select
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-select"
        >

          <option value="">Select Month</option>
          {months?.map((m) => (
            <option key={m.month} value={m.month}>{m.month}</option>
          ))}
        </select>
      </div>

      <div
        className='home-container'
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
          fontFamily: theme.fonts.main,
        }}
      >
        {/* 🟥 Left Sidebar */}
        <LeftSidebar selectedMonth={selectedMonth} /> {/* ✅ تمرير الشهر */}

        {/* 🟧 Center Content (Top Stats + Orders Table) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TopStats selectedMonth={selectedMonth} />
          <OrdersTable />
        </div>

        {/* 🟩 Right Panel */}
        <NextTasksPanel selectedMonth={selectedMonth}  />
      </div>
    </div>
  );
};

export default Home;
