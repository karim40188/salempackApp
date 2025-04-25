import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import useImageUploader from '../../hooks/useImageUploader';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate()
  const uploadImage = useImageUploader(import.meta.env.VITE_BASE_URL, localStorage.getItem('token'));

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
      console.log(imageName)
      if (!imageName) {
        setError("Image upload failed.");
        return;
      }

      const categoryData = {
        categoriesName: title,
        categoriesPhoto: imageName,
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/dashboard/categories`, categoryData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess("Category added successfully!");
      setTitle('');
      setImage(null);
      navigate("/categories")
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Add New Category</Typography>

      <TextField
        label="Category Title"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        Upload Image
        <input type="file" hidden onChange={handleImageChange} />
      </Button>
      {image && <Typography>{image.name}</Typography>}

      <Box mt={4}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>

      {error && <Typography color="error" mt={2}>{error}</Typography>}
      {success && <Typography color="success" mt={2}>{success}</Typography>}
    </Box>
  );
};

export default AddCategory;
