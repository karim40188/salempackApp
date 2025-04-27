import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import useImageUploader from '../../hooks/useImageUploader';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/AuthContext';

const AddCategory = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title || !image) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const imageName = await uploadImage(image);
      
      if (!imageName) {
        setError("Image upload failed.");
        setLoading(false);
        return;
      }

      const categoryData = {
        categoriesName: title,
        categoriesPhoto: imageName,
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/dashboard/categories`, categoryData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('salemPack_token')}`,
        },
      });

      setSuccess("Category added successfully!");
      setTitle('');
      setImage(null);
      setPreviewUrl(null);
      
      // Navigate after a short delay to show success message
      setTimeout(() => navigate("/categories"), 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: '0 auto', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={4} color="primary">
          Add New Category
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Category Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ 
                height: 56, 
                borderStyle: 'dashed', 
                borderWidth: 2, 
                textTransform: 'none' 
              }}
            >
              Upload Category Image
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={handleImageChange} 
              />
            </Button>
            {image && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                Selected: {image.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {previewUrl ? (
                <CardMedia
                  component="img"
                  image={previewUrl}
                  alt="Category preview"
                  sx={{ 
                    objectFit: 'contain', 
                    height: '100%', 
                    width: '100%',
                    padding: 1
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Image preview will appear here
                </Typography>
              )}
            </Card>
          </Grid>

          <Grid item xs={12}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={loading}
              sx={{ 
                minWidth: 150, 
                height: 50, 
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Category"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddCategory;