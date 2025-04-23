import React from 'react';
import Header from '../Components/Header/Header';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: '#f5f5f5',
      boxSizing: 'border-box'
    }}>
      <Header />
      <main style={{
        flex: 1,
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
