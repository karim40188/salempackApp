// src/components/SlideMenu/SlideMenu.jsx
import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { slide as Menu } from 'react-burger-menu';
import './SlideMenu.css';
import WhiteLogo from '../../assets/Header/WhiteLogoSalemPack.png';
import { Context } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SlideMenu = ({ isOpen, onClose }) => {
  const { setToken } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("salemPack_token");
    setToken(null);
    navigate("/");
  };

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <Menu
        left
        isOpen={isOpen}
        onClose={onClose}
        customBurgerIcon={false}
        customCrossIcon={false}
        width={280}
        className="menu-container"
      >
        <Box onClick={()=>navigate("/")} className="logo-wrapper">
          <img src={WhiteLogo} alt="Logo" className="logo-img" />
        </Box>

        <a className="menu-item" href="/">Home</a>
        <a className="menu-item" href="/admins">Admins</a>
        <a className="menu-item" href="/banners">Banners</a>
        <a className="menu-item" href="/orders">Orders</a>
        <a className="menu-item" href="/products">Products</a>
        <a className="menu-item" href="/clients">Clients</a>
        <a className="menu-item" href="/categories">Categories</a>
        <a className="menu-item" href="/send-sms">Send SMS</a>

        <a className="menu-item" onClick={handleLogout} style={{ cursor: 'pointer', color: '#f44336' }}>
          Logout
        </a>
      </Menu>
    </>
  );
};

export default SlideMenu;
