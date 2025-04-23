import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header style={{ padding: '10px', background: '#333', color: '#fff' }}>
    <nav>
      <Link to="/home" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/banners" style={{ marginRight: 10 }}>Banners</Link>
      <Link to="/orders" style={{ marginRight: 10 }}>Orders</Link>
      <Link to="/clients" style={{ marginRight: 10 }}>Clients</Link>
    </nav>
  </header>
);

export default Header;
