import React, { useContext, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useImageUploader from '../../hooks/useImageUploader';
import { Context } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBanner = () => {
  const [image, setImage] = useState(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate()
  const handleUpload = (e) => {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      // التحقق من الحجم والنوع قبل رفع الصورة
      if (uploadedImage.size > 5000000) { // 5MB
        alert('The image size exceeds the 5MB limit.');
        setImage(null); // إعادة تعيين الصورة
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(uploadedImage.type)) {
        alert('Invalid file type. Please upload a valid image (JPEG, PNG, GIF).');
        setImage(null); // إعادة تعيين الصورة
        return;
      }
      setImage(uploadedImage);
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
            'Authorization': `Bearer ${token}`, // التأكد من التنسيق الصحيح
          },
        }
      );
      console.log('Banner added:', response.data);
      alert('Banner added successfully!');
      navigate("/banners")
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
    <Box sx={{ padding: 4, backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Add New Banner</Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        Upload Image
        <input type="file" hidden onChange={handleUpload} />
      </Button>
      {image && <Typography>{image.name}</Typography>}
      <TextField
        label="Alt Text"
        variant="outlined"
        fullWidth
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Box mt={4}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddBanner;
