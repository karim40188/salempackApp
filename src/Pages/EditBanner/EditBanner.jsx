import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Container,
  Grid,
  CircularProgress,
  IconButton,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
import useImageUploader from '../../hooks/useImageUploader';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const EditBanner = () => {
  const { id } = useParams();
  const { token, baseUrl } = useContext(Context);
  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);
  const [sliderPhoto, setSliderPhoto] = useState(null);
  const [sliderAltPhoto, setSliderAltPhoto] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadImage = useImageUploader(baseUrl, token);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/dashboard/sliders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBanner(response.data);
        setSliderAltPhoto(response.data.sliderAltPhoto || '');
        setError(null);
      } catch (err) {
        console.error('Failed to fetch banner:', err);
        setError('Failed to load banner data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, baseUrl, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size and type
      if (file.size > 5000000) { // 5MB
        setError('Image size exceeds 5MB limit');
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
        return;
      }
      
      setSliderPhoto(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!sliderAltPhoto.trim()) {
      setError('Please provide alt text for the image');
      return;
    }
    
    setIsSaving(true);
    try {
      const imageUrl = sliderPhoto ? await uploadImage(sliderPhoto) : banner.sliderPhoto;

      await axios.patch(
        `${baseUrl}/dashboard/sliders/${id}`,
        {
          sliderPhoto: imageUrl,
          sliderAltPhoto,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate('/banners'), 1500);
    } catch (err) {
      console.error('Failed to update banner:', err);
      setError('Failed to update banner. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/dashboard/sliders?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => navigate('/banners'), 1500);
    } catch (err) {
      console.error('Failed to delete banner:', err);
      setError('Failed to delete banner. Please try again.');
      handleCloseDialog();
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccess(false);

  const getImagePreview = () => {
    if (sliderPhoto) {
      return URL.createObjectURL(sliderPhoto);
    } else if (banner?.sliderPhoto) {
      return `${baseUrl}/public/uploads/${banner.sliderPhoto}`;
    }
    return null;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, mt: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/banners')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Edit Banner
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Banner Preview
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {getImagePreview() ? (
                  <img
                    src={getImagePreview()}
                    alt="Banner Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Typography color="textSecondary">No image available</Typography>
                )}
              </Box>
            </Box>

            <Button 
              variant="outlined" 
              component="label" 
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload New Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            
            {sliderPhoto && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Selected: {sliderPhoto.name} ({(sliderPhoto.size / 1024).toFixed(2)} KB)
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Banner Details
            </Typography>
            
            <TextField
              label="Image Description (Alt Text)"
              value={sliderAltPhoto}
              onChange={(e) => setSliderAltPhoto(e.target.value)}
              fullWidth
              sx={{ mb: 4 }}
              helperText="Describe the banner image for accessibility"
              required
              error={!sliderAltPhoto.trim()}
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={isSaving || !sliderAltPhoto.trim()}
                  sx={{ 
                    minWidth: 150,
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  {isSaving ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/banners')}
                  sx={{ ml: 2, height: 48, borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </Box>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDialog}
                sx={{ height: 48, borderRadius: 2 }}
              >
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 2, padding: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this banner? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Snackbar */}
      <Snackbar open={success} autoHideDuration={1500} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {openDialog ? "Banner deleted successfully!" : "Banner updated successfully!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditBanner;