import React from 'react';
import theme from '../../Theme/theme';
import LeftSidebar from '../../Components/Home/OrderStatsSidebar/OrderStatsSidebar';
import TopStats from '../../Components/Home/TopStatsSection/TopStatsSection';
import OrdersTable from '../../Components/Home/OrdersTable/OrdersTable';
import NextTasksPanel from '../../Components/Home/NextTasks/NextTasks';

const Home = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr 380px',
        gap: '20px',
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        fontFamily: theme.fonts.main,
        borderRadius: '8px',
        minHeight: '100vh',
      }}
    >
      {/* 🟥 Left Sidebar */}
      <LeftSidebar />

      {/* 🟧 Center Content (Top Stats + Orders Table) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TopStats />
        <OrdersTable />
      </div>

      {/* 🟩 Right Panel */}
      <NextTasksPanel />
    </div>
  );
};

export default Home;
