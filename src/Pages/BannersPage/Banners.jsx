// src/pages/BannerImages.jsx
import React from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Banners.css';

const BannerImages = () => {
  const banners = [1, 2, 3]; // Dummy banners for layout

  return (
    <Box className="banner-container">
      <Button
        variant="contained"
        className="new-banner-btn"
        startIcon={<AddIcon />}
      >
        New Banner
      </Button>

      <Typography variant="h5" className="banner-title">
        Banner Images
      </Typography>

      <Grid container spacing={3} className="banner-grid">
        {banners.map((banner, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper className="banner-box" elevation={3} />
            <Box className="button-group">
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                className="change-btn"
              >
                Change
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                className="remove-btn"
              >
                Remove
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BannerImages;
