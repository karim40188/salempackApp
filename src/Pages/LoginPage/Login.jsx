// ✅ src/Pages/LoginPage/Login.jsx
import React, { useContext, useState } from 'react';
import {
  TextField, Button, InputAdornment, IconButton,
  CircularProgress, Paper, Box, Typography
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import './LoginStyle.css';
import AuthLayout from '../../Layout/Authlayout';
import axios from "axios";
import loginImage from '../../assets/Login/loginImg.png';
import Logo from '../../assets/Login/SalemPackMainLogo.png';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { baseUrl, setToken } = useContext(Context);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${baseUrl}/dashboard/auth/login`, {
        email,
        password
      });

      const userToken = response.data.access_token;
      console.log(userToken)
      localStorage.setItem("token", userToken);
      setToken(userToken);
      navigate("/");

    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
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
            error={!!error}
            helperText={error}
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
