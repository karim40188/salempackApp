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
} from '@mui/material';

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
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/dashboard/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct({
          name: res.data.productName,
          description: res.data.productDescription,
          price: res.data.productPrice,
          category: res.data.productCategory,
          photo: res.data.productPhoto,
        });
        setImagePreview(`${baseUrl}/public/uploads/${res.data.productPhoto}`);
      } catch (err) {
        alert('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
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
    let uploadedPhoto = product.photo;
    if (product.photo instanceof File) {
      uploadedPhoto = await uploadImage(product.photo);
      if (!uploadedPhoto) {
        alert('Image upload failed');
        return;
      }
    }
    const updatedProduct = {
      productName: product.name,
      productDescription: product.description,
      productPrice: product.price,
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
      alert('Product updated successfully!');
      navigate('/select-product');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Edit Product
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              margin="normal"
              multiline
              rows={4}
            />

            <TextField
              fullWidth
              label="Price"
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Category"
              type="number"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel shrink htmlFor="photo-upload">
                Product Image
              </InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="photo-upload"
                style={{ marginTop: '8px' }}
              />
              {imagePreview && (
                <Box mt={2}>
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                </Box>
              )}
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 4, py: 1.5, fontWeight: 'bold', borderRadius: 5 }}
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default EditProductPage;