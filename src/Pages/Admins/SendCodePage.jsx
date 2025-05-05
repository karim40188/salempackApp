import React, { useState, useContext } from "react";
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
  IconButton
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";

const SendCodePage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useContext(Context);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendCode = async () => {
    // Reset states
    setError("");
    setSuccess("");
    
    // Validate email
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.get(`${baseUrl}/dashboard/admins/sendcodepass/${email}`);
      console.log(response);
      localStorage.setItem("resetEmail", email);
      
      setSuccess("Code sent successfully. Check your email.");
      setTimeout(() => navigate("/check-code"), 1500);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendCode();
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
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
            Password Reset
          </Typography>
          
          <Typography 
            variant="body2" 
            textAlign="center" 
            color="text.secondary" 
            mb={3}
          >
            Enter your email address and we'll send you a verification code to reset your password
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
            >
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            size="large"
            onClick={handleSendCode}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
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
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>

          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToLogin}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SendCodePage;