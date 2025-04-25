import React, { useState, useContext } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { Context } from "../../context/AuthContext";
import useImageUploader from '../../hooks/useImageUploader.js';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Cups' },
  { id: 2, name: 'Plates' },
  { id: 3, name: 'Boxes' }
];

const AddProduct = () => {
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    image: null,
    title: '',
    description: '',
    price: '',
    category: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === 'image' ? e.target.files[0] : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (
      !formData.image || !formData.title || !formData.description ||
      !formData.price || !formData.category
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const uploadedImageName = await uploadImage(formData.image);
      if (!uploadedImageName) {
        alert("Image upload failed.");
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

      alert("Product added successfully!");
     

      setFormData({
        image: null,
        title: '',
        description: '',
        price: '',
        category: ''
      });

      navigate("/select-product")
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Add New Product</Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        Upload Image
        <input type="file" hidden onChange={handleChange('image')} />
      </Button>
      {formData.image && <Typography>{formData.image.name}</Typography>}

      <TextField
        label="Product Title"
        fullWidth
        sx={{ my: 2 }}
        value={formData.title}
        onChange={handleChange('title')}
      />

      <TextField
        label="Product Description"
        fullWidth
        multiline
        rows={3}
        sx={{ my: 2 }}
        value={formData.description}
        onChange={handleChange('description')}
      />

      <TextField
        label="Product Price"
        fullWidth
        type="number"
        sx={{ my: 2 }}
        value={formData.price}
        onChange={handleChange('price')}
      />

      <TextField
        select
        label="Select Category"
        fullWidth
        sx={{ my: 2 }}
        value={formData.category}
        onChange={handleChange('category')}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
};

export default AddProduct;
