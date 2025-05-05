import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Avatar, 
  IconButton,
  Container,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
import useImageUploader from '../../hooks/useImageUploader';

const EditClient = () => {
  const { id } = useParams();
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    username: '',
    CompanyName: '',
    MobileNumber: '',
    Email: '',
    Logo: '',
    Password: '',
    products: [],
  });

  const [newLogo, setNewLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/dashboard/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const client = res.data;
    
        setClientData({
          username: client.username || '',
          CompanyName: client.CompanyName || '',
          MobileNumber: client.MobileNumber || '',
          Email: client.Email || '',
          Logo: client.Logo || '',
          Password: '', // Keep empty
          products: client.products || [],
        });
      } catch (err) {
        console.error('Error fetching client data:', err);
        setMessage({ 
          open: true, 
          text: 'Failed to load client data. Please try again.', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [baseUrl, token, id]);

  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogo(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setNewLogo(null);
    setPreviewLogo(null);
    setClientData({
      ...clientData,
      Logo: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoPath = clientData.Logo;

      if (newLogo) {
        const uploadedPath = await uploadImage(newLogo);
        if (uploadedPath) {
          logoPath = uploadedPath;
        }
      }

      await axios.patch(`${baseUrl}/dashboard/clients/${id}`, {
        ...clientData,
        Logo: logoPath,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({
        open: true,
        text: 'Client updated successfully!',
        severity: 'success'
      });
      
      // Navigate back after successful update and short delay
      setTimeout(() => navigate('/clients'), 1500);
    } catch (err) {
      console.error('Error updating client:', err);
      setMessage({
        open: true,
        text: 'Failed to update client. Please try again.',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={() => navigate('/clients')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              Edit Client
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box p={3}>
            {/* Client Logo Section */}
            <Card sx={{ mb: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Company Logo
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Avatar
                    src={previewLogo || (clientData.Logo ? `${baseUrl}/public/uploads/${clientData.Logo}` : '')}
                    alt={clientData.CompanyName}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '2px solid #e0e0e0',
                      boxShadow: 2
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    component="label"
                  >
                    Change Logo
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                  {(clientData.Logo || previewLogo) && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveLogo}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Client Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Username"
                  name="username"
                  value={clientData.username}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  name="CompanyName"
                  value={clientData.CompanyName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile Number"
                  name="MobileNumber"
                  value={clientData.MobileNumber}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address"
                  name="Email"
                  type="email"
                  value={clientData.Email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="Password"
                  type="password"
                  value={clientData.Password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  helperText="Leave empty to keep current password"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/select-clients')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={() => setMessage({ ...message, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage({ ...message, open: false })} 
          severity={message.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditClient;