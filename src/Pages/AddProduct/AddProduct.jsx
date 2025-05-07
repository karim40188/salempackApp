import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Paper,
  Container,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import axios from 'axios';
import { Context } from "../../context/AuthContext.jsx";
import useImageUploader from '../../hooks/useImageUploader.js';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {

  const [categories, setCategories] = useState([])
  const { baseUrl, token } = useContext(Context);


  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: null,
    title: '',
    description: '',
    price: '',
    category: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (field) => (e) => {
    const value = field === 'image' ? e.target.files[0] : e.target.value;
    setFormData({ ...formData, [field]: value });

    if (field === 'image' && e.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dashboard/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data || []);
      console.log(response?.data)
    } catch (err) {
      setError("Failed to fetch categories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.image || !formData.title || !formData.description ||
      !formData.price || !formData.category
    ) {
      setAlert({
        open: true,
        message: "Please fill all fields and upload an image.",
        severity: "error"
      });
      return;
    }

    try {
      setLoading(true);

      const uploadedImageName = await uploadImage(formData.image);
      if (!uploadedImageName) {
        setAlert({
          open: true,
          message: "Image upload failed. Please try again.",
          severity: "error"
        });
        return;
      }

      const payload = {
        productName: formData.title,
        productPhoto: uploadedImageName,
        productPrice: Number(formData.price),
        productDescription: formData.description,
        productCategory: Number(formData.category)
      };

      await axios.post(`${baseUrl}/dashboard/products`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAlert({
        open: true,
        message: "Product added successfully!",
        severity: "success"
      });

      // Reset form after successful submission
      setFormData({
        image: null,
        title: '',
        description: '',
        price: '',
        category: ''
      });
      setPreviewUrl(null);

      // Navigate after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      setAlert({
        open: true,
        message: "Failed to add product. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories()
    return () => {
      // Clean up URL object when component unmounts
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Paper elevation={3} sx={{ 
        mt: { xs: 2, sm: 4 }, 
        mb: { xs: 2, sm: 4 }, 
        borderRadius: 2, 
        overflow: 'hidden' 
      }}>
        {/* Header */}
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' }
          }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ 
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}>
              Add New Product
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </Box>

        {/* Breadcrumbs */}
        <Box sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: '#f5f5f5',
          display: { xs: 'none', sm: 'block' }
        }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center' }}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center' }}
              onClick={() => navigate('/products')}
              style={{ cursor: 'pointer' }}
            >
              <CategoryIcon sx={{ mr: 0.5 }} fontSize="small" />
              Products
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              Add New Product
            </Typography>
          </Breadcrumbs>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box p={{ xs: 2, sm: 3 }}>
            <Grid container spacing={{ xs: 2, sm: 4 }}>
              {/* Left side - Image upload */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 'medium',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Product Image
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                    p: { xs: 1.5, sm: 2 }
                  }}>
                    {previewUrl ? (
                      <Box sx={{ 
                        position: 'relative', 
                        width: '100%', 
                        mb: 2,
                        height: { xs: 150, sm: 200 }
                      }}>
                        <CardMedia
                          component="img"
                          image={previewUrl}
                          alt="Product Preview"
                          sx={{
                            height: '100%',
                            borderRadius: 1,
                            objectFit: 'contain',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                        <IconButton
                          color="error"
                          size="small"
                          onClick={handleRemoveImage}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'white',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: { xs: 150, sm: 200 },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#eee',
                          borderRadius: 1,
                          mb: 2
                        }}
                      >
                        <CameraAltIcon sx={{ fontSize: { xs: 40, sm: 60 }, 
                          color: '#bdbdbd' 
                        }} />
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1 }}
                    >
                      {previewUrl ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleChange('image')}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                      Upload a high-quality image for best appearance
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right side - Form fields */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 'medium',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Product Details
                </Typography>
                <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

                <Grid container spacing={{ xs: 2, sm: 4 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Product Title"
                      fullWidth
                      variant="outlined"
                      required
                      value={formData.title}
                      onChange={handleChange('title')}
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Product Description"
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      value={formData.description}
                      onChange={handleChange('description')}
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Product Price"
                      fullWidth
                      type="number"
                      variant="outlined"
                      required
                      value={formData.price}
                      onChange={handleChange('price')}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>EGP</Typography>,
                        sx: { borderRadius: 1 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} sx={{ width: '300px' }} >
                    <TextField
                      select
                      label="Select Category"
                      fullWidth
                      variant="outlined"
                      required
                      value={formData.category}
                      onChange={handleChange('category')}
                      InputProps={{
                        sx: { borderRadius: 1 }
                      }}
                    >
                      {categories?.map((cat) => (
                        <MenuItem sx={{color:'black'}} key={cat.id} value={cat.id}>{cat.categoriesName}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: { xs: 3, sm: 4 }, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              justifyContent: 'space-between'
            }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/products')}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProduct;