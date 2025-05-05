import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { baseUrl } = useContext(Context);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");
  const code = localStorage.getItem("resetCode");

  useEffect(() => {
    // Check if email and code exist in localStorage, if not redirect to send code page
    if (!email || !code) {
      navigate("/send-code");
    }
  }, [email, code, navigate]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 20; // Has uppercase
    if (/[a-z]/.test(password)) strength += 20; // Has lowercase
    if (/[0-9]/.test(password)) strength += 20; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Has special char
    
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "error";
    if (passwordStrength < 80) return "warning";
    return "success";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 80) return "Medium";
    return "Strong";
  };

  const handleResetPassword = async () => {
    // Reset states
    setError("");
    setSuccess("");
    
    // Validate inputs
    if (!password || password.trim() === "") {
      setError("Please enter a new password");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (passwordStrength < 60) {
      setError("Please create a stronger password with a mix of letters, numbers, and special characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post(`${baseUrl}/dashboard/admins/updatepass`, {
        email,
        code:Number(code),
        password,
      });
      
      setSuccess("Password updated successfully! Redirecting to login...");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleResetPassword();
    }
  };

  const handleBackToCheckCode = () => {
    navigate("/check-code");
  };

  return (
    <Container 
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(120deg, #f0f2f5 0%, #e6e9f0 100%)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: '90%', sm: '450px' },
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h5" 
            fontWeight="600" 
            mb={3}
            color="primary"
          >
            Set New Password
          </Typography>
          
          <Typography 
            variant="body2" 
            textAlign="center" 
            color="text.secondary" 
            mb={3}
          >
            Create a strong password for your account
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2 }}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ width: '100%', mb: 2 }}
              icon={<CheckCircleIcon fontSize="inherit" />}
            >
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockResetIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {password && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Password Strength
                </Typography>
                <Typography 
                  variant="caption" 
                  color={getPasswordStrengthColor()}
                >
                  {getPasswordStrengthLabel()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={passwordStrength} 
                color={getPasswordStrengthColor()} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockResetIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            size="large"
            onClick={handleResetPassword}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            sx={{ 
              mb: 2,
              py: 1.5,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? 'Updating...' : 'Set New Password'}
          </Button>

          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToCheckCode}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            Back to Verification
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;