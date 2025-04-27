import React, { useContext, useState } from 'react';
import { Box, Typography, Button, TextField, Paper, CircularProgress, Container, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import useImageUploader from '../../hooks/useImageUploader';
import { Context } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBanner = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate();

  const handleUpload = (e) => {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      // Validate size and type before uploading
      if (uploadedImage.size > 5000000) { // 5MB
        alert('The image size exceeds the 5MB limit.');
        setImage(null);
        setPreview(null);
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(uploadedImage.type)) {
        alert('Invalid file type. Please upload a valid image (JPEG, PNG, GIF).');
        setImage(null);
        setPreview(null);
        return;
      }
      
      setImage(uploadedImage);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(uploadedImage);
    }
  };

  const handleSave = async () => {
    if (!image || !altText) {
      alert('Please upload an image and provide alt text.');
      return;
    }

    setIsUploading(true);
    const imagePath = await uploadImage(image);

    if (!imagePath) {
      alert('Failed to upload image.');
      setIsUploading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/dashboard/sliders`,
        {
          sliderPhoto: imagePath,
          sliderAltPhoto: altText,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Banner added:', response.data);
      alert('Banner added successfully!');
      navigate("/banners");
    } catch (err) {
      console.error('Failed to add banner:', err);
      if (err.response) {
        console.error("Error response:", err.response);
        alert(`Failed to add banner: ${err.response.data?.message || 'Unknown error'}`);
      } else if (err.request) {
        alert('No response received from server. Please check your connection.');
      } else {
        alert(`Error occurred: ${err.message}`);
      }
    }
    setIsUploading(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, mt: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={4} color="primary">
          Add New Banner
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f9f9f9',
                mb: 3
              }}
            >
              {preview ? (
                <Box component="img" src={preview} alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <AddPhotoAlternateIcon sx={{ fontSize: 60, color: '#aaa', mb: 2 }} />
                  <Typography color="textSecondary">No image selected</Typography>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Select Image
              <input type="file" hidden accept="image/*" onChange={handleUpload} />
            </Button>

            {image && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Selected: {image.name} ({(image.size / 1024).toFixed(2)} KB)
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={2}>Banner Details</Typography>
            
            <TextField
              label="Alt Text"
              variant="outlined"
              fullWidth
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              sx={{ mb: 3 }}
              helperText="Describe the banner image for accessibility"
              required
            />

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={isUploading || !image || !altText}
                sx={{ 
                  minWidth: 150,
                  height: 48,
                  borderRadius: 2,
                  fontWeight: 'bold'
                }}
              >
                {isUploading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Uploading...
                  </>
                ) : 'Save Banner'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/banners')}
                sx={{ ml: 2, height: 48, borderRadius: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddBanner;