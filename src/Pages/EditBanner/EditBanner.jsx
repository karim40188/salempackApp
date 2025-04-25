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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
import  useImageUploader  from '../../hooks/useImageUploader'; // Assuming you have this custom hook for image uploading

const EditBanner = () => {
  const { id } = useParams();
  const { token, baseUrl } = useContext(Context);
  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);
  const [sliderPhoto, setSliderPhoto] = useState(null); // For the new image
  const [sliderAltPhoto, setSliderAltPhoto] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // Use your custom hook for image upload
  const  uploadImage  = useImageUploader(baseUrl,token);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${baseUrl}/dashboard/sliders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBanner(response.data);
        setSliderAltPhoto(response.data.sliderAltPhoto);
      } catch (err) {
        console.error('Failed to fetch banner:', err);
      }
    };

    fetchBanner();
  }, [id, baseUrl, token]);

  const handleImageChange = (e) => {
    setSliderPhoto(e.target.files[0]);
  };

  const handleSave = async () => {
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
      navigate('/banners');
    } catch (err) {
      console.error('Failed to update banner:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/dashboard/sliders?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/banners');
    } catch (err) {
      console.error('Failed to delete banner:', err);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!banner) return <Typography>Loading...</Typography>;

  return (
    <Box className="edit-banner-container" padding={3}>
      <Typography variant="h4" textAlign="center" marginBottom={2}>
        Edit Banner
      </Typography>

      <Box marginBottom={2}>
        <TextField
          label="Image Description (Alt Text)"
          value={sliderAltPhoto}
          onChange={(e) => setSliderAltPhoto(e.target.value)}
          fullWidth
        />
      </Box>

      <Box marginBottom={2}>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
      </Box>

      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>

        <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
          Delete Banner
        </Button>
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this banner?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditBanner;
