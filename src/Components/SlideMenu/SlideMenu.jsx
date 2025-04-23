// src/components/SlideMenu/SlideMenu.jsx
import React from 'react';
import { Box } from '@mui/material';
import { slide as Menu } from 'react-burger-menu';
import './SlideMenu.css';
import WhiteLogo from '../../assets/Header/WhiteLogoSalemPack.png';

const SlideMenu = ({ isOpen, onClose }) => {
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
        <Box className="logo-wrapper">
          <img src={WhiteLogo} alt="Logo" className="logo-img" />
        </Box>

        <a className="menu-item" href="#home">Home</a>
        <a className="menu-item" href="#transformations">Transformations</a>
        <a className="menu-item" href="#feedbacks">Feedbacks</a>
        <a className="menu-item" href="#pricing">Plans & Pricing</a>
        <a className="menu-item" href="#app">Informa App</a>
        <a className="menu-item" href="#about">About Us</a>
        <a className="menu-item" href="#contact">Contact Us</a>
      </Menu>
    </>
  );
};

export default SlideMenu;
