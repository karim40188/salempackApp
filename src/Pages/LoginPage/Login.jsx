// src/Pages/LoginPage/Login.jsx
import React, { useState } from 'react';
import {
  TextField, Button, InputAdornment, IconButton,
  CircularProgress, Paper, Box, Typography
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import './LoginStyle.css';
import AuthLayout from '../../Layout/Authlayout';

// import images

import loginImage from '../../assets/Login/loginImg.png'; // update this path based on your structure
import Logo from '../../assets/Login/SalemPackMainLogo.png'; // update this path based on your structure
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Logged in!');
    }, 2000);
  };

  return (
    <AuthLayout>
      <Paper elevation={3} className="login-paper">
        <Box
          className="login-image"
          style={{ backgroundImage: `url(${loginImage})` }}
        />
        <Box className="login-form">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src={Logo} alt="Salem Pack Logo" style={{ width: '50%' }} />
          </Box>

          <TextField
            fullWidth
            margin="normal"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box className="reset-password">
            <Typography variant="caption" sx={{ cursor: 'pointer' }}>
              Reset Password
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'LOGIN'}
          </Button>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default Login;
