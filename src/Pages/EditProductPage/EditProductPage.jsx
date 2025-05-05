import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useImageUploader from '../../hooks/useImageUploader';
import { Context } from '../../context/AuthContext';

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardMedia,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import LabelIcon from '@mui/icons-material/Label';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    photo: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      setLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          axios.get(`${baseUrl}/dashboard/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/dashboard/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProduct({
          name: productRes.data.productName,
          description: productRes.data.productDescription,
          price: productRes.data.productPrice,
          category: productRes.data.productCategory, // هنربطه بعدين بالـ select
          photo: productRes.data.productPhoto,
        });

        setCategories(categoriesRes.data);

        setImagePreview(`${baseUrl}/public/uploads/${productRes.data.productPhoto}`);
      } catch (err) {
        alert('Failed to load product or categories');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [id, baseUrl, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setProduct({ ...product, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let uploadedPhoto = product.photo;
    if (product.photo instanceof File) {
      uploadedPhoto = await uploadImage(product.photo);
      if (!uploadedPhoto) {
        setAlert({
          open: true,
          message: "Image upload failed",
          severity: "error"
        });
        setSubmitting(false);
        return;
      }
    }

    const updatedProduct = {
      productName: product.name,
      productDescription: product.description,
      productPrice: Number(product.price),
      productCategory: product.category,
      productPhoto: uploadedPhoto,
    };

    try {
      await axios.patch(`${baseUrl}/dashboard/products/${id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setAlert({
        open: true,
        message: "Product updated successfully!",
        severity: "success"
      });
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setAlert({
        open: true,
        message: "Failed to update product.",
        severity: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading product data...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/products')}
            sx={{ mr: 2, bgcolor: 'rgba(0,0,0,0.04)' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Edit Product
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column - Image */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                  <CardMedia
                    component="img"
                    image={imagePreview || 'https://via.placeholder.com/300?text=No+Image'}
                    alt="Product Preview"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="photo-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{
                        py: 1.2,
                        bgcolor: '#6366F1',
                        '&:hover': {
                          bgcolor: '#4F46E5'
                        }
                      }}
                    >
                      Upload New Image
                    </Button>
                  </label>
                </Box>
              </Card>
            </Grid>

            {/* Right Column - Form Fields */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                      label="Category"
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.categoriesName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    multiline
                    rows={5}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                  sx={{
                    mr: 2,
                    px: 3,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={submitting}
                  startIcon={<SaveIcon />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
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
    </Box>
  );
};

export default EditProductPage;
