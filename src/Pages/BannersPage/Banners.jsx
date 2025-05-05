// src/pages/BannerImages.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
import "./Banners.css"
const BannerImages = () => {
  const [banners, setBanners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const navigate = useNavigate();
  const { token, baseUrl } = useContext(Context);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${baseUrl}/dashboard/sliders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBanners(response.data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };

    fetchBanners();
  }, [baseUrl, token]);

  const handleOpenDialog = (banner) => {
    setBannerToDelete(banner);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBannerToDelete(null);
  };

  

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/dashboard/sliders?id=${bannerToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to delete banner:", err);
    }
  };

  return (
    <Box className="banner-container">
      <Button
        onClick={() => navigate("/add-banner")}
        variant="contained"
        className="new-banner-btn"
        startIcon={<AddIcon />}
      >
        New Banner
      </Button>

      <Typography variant="h5" className="banner-title" sx={{fontWeight:"900"}}>
        Banner Images
      </Typography>

      <Grid container spacing={3} className="banner-grid">
        {banners?.map((banner) => (
          <Grid item xs={12} md={4} key={banner.id}>
            <Paper className="banner-box" elevation={3}>
              <img
                src={`${baseUrl}/public/uploads/${banner.sliderPhoto}`} 
                alt={banner.sliderAltPhoto}
                className="banner-image"
              />
            </Paper>
            <Box className="button-group">
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                className="change-btn"
                onClick={() => navigate(`/edit-banner/${banner.id}`)}
              >
                Change
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                className="remove-btn"
                onClick={() => handleOpenDialog(banner)}
              >
                Remove
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this banner?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerImages;
