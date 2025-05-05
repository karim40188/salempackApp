import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
// MUI Components
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Chip,
  Container, 
  Grid, 
  IconButton, 
  InputAdornment,
  MenuItem,
  Select,
  TextField, 
  Typography,
  FormControl,
  InputLabel,
  Paper,
  Stack
} from '@mui/material';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DeleteConfirmDialog from '../../Components/DeleteConfirmDialog/DeleteConfirmDialog';

const ProductListPage = () => {
  const { baseUrl, token } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [baseUrl, token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/dashboard/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const enriched = (res.data || []).map((p) => ({
        id: p.id,
        name: p.productName,
        specs: p.productDescription,
        image: `${baseUrl}/public/uploads/${p.productPhoto}`,
        quantity: 1,
        price: p.productPrice,
        categoryId: p.productCategory,
        photo: p.productPhoto
      }));
      setProducts(enriched);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("Failed to load products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/dashboard/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || { categoriesName: 'Unknown', color: '#cccccc' };
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleting(true);
    try {
      await axios.delete(`${baseUrl}/dashboard/products?id=${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setDeleting(false);
      closeDeleteDialog();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      
      // Check for foreign key constraint error
      if (err.response && 
          err.response.data && 
          err.response.data.message && 
          err.response.data.message.includes("foreign key constraint fails")) {
        alert("This product cannot be deleted because it's currently used by one or more clients. You need to remove it from all clients first.");
      } else {
        alert("Failed to delete product.");
      }
    }
  };
  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`, { state: product });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <Box 
      sx={{ 
        py: 5, 
        minHeight: '100vh',
        bgcolor: 'grey.50'
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          fontWeight="bold" 
          sx={{ 
            mb: 4, 
            textTransform: 'uppercase', 
            letterSpacing: 1,
            color: 'text.primary'
          }}
        >
          Product Management
        </Typography>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => navigate("/add-product")}
              sx={{ 
                borderRadius: 6,
                px: 3,
                py: 1,
                fontWeight: 'bold'
              }}
            >
              Add Product
            </Button>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <TextField
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 6 }
                }}
                size="small"
                sx={{ 
                  width: { xs: '100%', sm: 300 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 6
                  }
                }}
              />

              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 180,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 6
                  }
                }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.categoriesName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const category = getCategoryById(product.categoryId);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      position: 'relative',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Chip 
                      label={category.categoriesName}
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10,
                        bgcolor: category.color || '#ccc',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    
                    <Box sx={{ height: 160, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{ 
                          maxHeight: 120, 
                          width: 'auto', 
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                      <Typography 
                        gutterBottom 
                        variant="subtitle1" 
                        component="div"
                        fontWeight="bold"
                        sx={{
                          height: 48,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          height: 60,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          mb: 2
                        }}
                      >
                        {product.specs}
                      </Typography>
                      
                      <Typography 
                        variant="h6" 
                        color="success.main" 
                        fontWeight="bold" 
                        align="center"
                        sx={{ mb: 1 }}
                      >
                        EGP {product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ padding: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(product)}
                        fullWidth
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteDialog(product)}
                        fullWidth
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 5, 
                  borderRadius: 3, 
                  textAlign: 'center' 
                }}
              >
                <FindInPageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search or filter criteria
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        deleting={deleting}
        onClose={closeDeleteDialog}
        onDelete={confirmDelete}
      />
    </Box>
  );
};

export default ProductListPage;