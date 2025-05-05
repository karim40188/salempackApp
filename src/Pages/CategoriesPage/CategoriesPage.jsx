import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../context/AuthContext";
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmDialog from '../../Components/DeleteConfirmDialog/DeleteConfirmDialog';
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const navigate = useNavigate();
  const { baseUrl, token } = useContext(Context);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dashboard/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data || []);
    } catch (err) {
      setError("Failed to fetch categories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [baseUrl, token]);

  const handleOpenDeleteDialog = (id) => {
    setSelectedCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedCategoryId(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategoryId) return;
    setDeleting(true);
    try {
      await axios.delete(`${baseUrl}/dashboard/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: selectedCategoryId }
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategoryId));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Something went wrong while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom align="center">Categories</Typography>

      <Grid container spacing={3} justifyContent="center">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                maxWidth: 345,
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <CardContent sx={{ height: 'auto' }}>
                <div style={{ height: '200px' }}>
                  <img
                    src={`${baseUrl}/public/uploads/${category.categoriesPhoto}`}
                    alt={category.categoriesName}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '10px',
                      marginBottom: '15px',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {category.categoriesName}
                </Typography>
             

                {/* Buttons */}
                <Stack direction="row" spacing={1} mt={2} justifyContent="space-between">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/edit-category/${category.id}`)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(category.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#2a9700',
          color: '#fff',
          padding: '8px 15px',
          borderRadius: '10px',
          fontWeight: 'bold',
          marginTop: '20px',
          display: 'block',
          marginLeft: 'auto'
        }}
        onClick={() => navigate('/add-category')}
      >
        Add Category
      </Button>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        deleting={deleting}
        onClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default CategoriesPage;
