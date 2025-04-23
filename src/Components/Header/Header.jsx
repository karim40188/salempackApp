import React, { useState } from 'react';
import SlideMenu from '../SlideMenu/SlideMenu';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import './Header.css';
import WhiteLogo from '../../assets/Header/WhiteLogoSalemPack.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppBar position="static" className="header-appbar">
        <Toolbar className="header-toolbar">
          <Box display="flex" alignItems="center" className="logo-box">
            <img src={WhiteLogo} alt="Logo" className="logo-img" />
          </Box>

          <Box className="header-right">
            <IconButton className="icon-btn" aria-label="translate">
              <LanguageIcon sx={{ color: '#fff' }} />
            </IconButton>
            <IconButton
              className="icon-btn"
              aria-label="menu"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
