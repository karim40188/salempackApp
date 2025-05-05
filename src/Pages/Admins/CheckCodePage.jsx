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
  IconButton
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";

const CheckCodePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useContext(Context);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    // Check if email exists in localStorage, if not redirect to send code page
    if (!email) {
      navigate("/send-code");
    }
  }, [email, navigate]);

  const handleCheckCode = async () => {
    // Reset states
    setError("");
    setSuccess("");
    
    // Validate code
    if (!code || code.trim() === "") {
      setError("Please enter the verification code");
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post(`${baseUrl}/dashboard/admins/cheackcode`, {
        email,
        code: Number(code),
      });
      
      setSuccess("Code verified successfully!");
      localStorage.setItem("resetCode", code);
      setTimeout(() => navigate("/reset-password/new"), 1500);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheckCode();
    }
  };

  const handleBackToSendCode = () => {
    navigate("/send-code");
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
            Verify Your Code
          </Typography>
          
          <Typography 
            variant="body2" 
            textAlign="center" 
            color="text.secondary" 
            mb={3}
          >
            Enter the verification code we sent to {email || "your email"}
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
            label="Verification Code"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            size="large"
            onClick={handleCheckCode}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
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
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToSendCode}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            Request New Code
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckCodePage;