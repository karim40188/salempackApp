// src/components/SlideMenu/SlideMenu.jsx
import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { slide as Menu } from 'react-burger-menu';
import './SlideMenu.css';
import WhiteLogo from '../../assets/Header/WhiteLogoSalemPack.png';
import { Context } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import SmsIcon from '@mui/icons-material/Sms';
import LogoutIcon from '@mui/icons-material/Logout';
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

        <a className="menu-item" href="/">
          <HomeIcon className="menu-icon" /> Home
        </a>
        <a className="menu-item" href="/admins">
          <AdminPanelSettingsIcon className="menu-icon" /> Admins
        </a>
        <a className="menu-item" href="/banners">
          <ViewCarouselIcon className="menu-icon" /> Banners
        </a>
        <a className="menu-item" href="/orders">
          <ShoppingCartIcon className="menu-icon" /> Orders
        </a>
        <a className="menu-item" href="/products">
          <InventoryIcon className="menu-icon" /> Products
        </a>
        <a className="menu-item" href="/clients">
          <PeopleIcon className="menu-icon" /> Clients
        </a>
        <a className="menu-item" href="/categories">
          <CategoryIcon className="menu-icon" /> Categories
        </a>
        <a className="menu-item" href="/send-sms">
          <SmsIcon className="menu-icon" /> Send SMS
        </a>
        
        <a className="menu-item" onClick={handleLogout} style={{ cursor: 'pointer', color: '#f44336' }}>
          <LogoutIcon className="menu-icon" /> Logout
        </a>

      
      </Menu>
    </>
  );
};

export default SlideMenu;
