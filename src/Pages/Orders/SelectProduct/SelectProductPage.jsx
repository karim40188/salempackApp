import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from "../../../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  Divider,
  Paper,
  FormControlLabel,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

const SelectProductPage = () => {
  const { baseUrl, token } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [baseUrl, token]);

  const fetchProducts = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuantityChange = (id, value) => {
    const numValue = Math.max(1, Number(value)); // Ensure minimum value is 1
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: numValue } : p))
    );
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, productId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${baseUrl}/dashboard/products?id=${deleteDialog.productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(); // Refresh list
      setDeleteDialog({ open: false, productId: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, productId: null });
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`, { state: product });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const totalAmount = products
    .filter((p) => selected[p.id])
    .reduce((acc, p) => acc + p.quantity * p.price, 0);

  const selectedProductCount = products.filter(p => selected[p.id]).length;

  const handleCreateOrder = async () => {
    const clientId = localStorage.getItem("selectedClientId");
    if (!clientId) {
      return;
    }

    const items = products
      .filter((p) => selected[p.id])
      .map((p) => ({
        product: p.name,
        Price: p.price,
        Quantity: p.quantity,
        TotalLine: Number((p.quantity * p.price).toFixed(2))
      }));

    if (items.length === 0) {
      return;
    }

    const orderData = {
      clientId: Number(clientId),
      total: Number(totalAmount.toFixed(2)),
      status: "Pending",
      items
    };

    try {
      await axios.post(`${baseUrl}/dashboard/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      navigate("/orders");
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" fontWeight="bold" gutterBottom>
          Create Orders
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => navigate("/add-product")}
            sx={{ borderRadius: 4, px: 3 }}
          >
            Add Product
          </Button>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <OutlinedInput
                placeholder="Search By Product Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              />
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.categoriesName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const category = getCategoryById(product.categoryId);
                return (
                  <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        width:'280px',
                        borderRadius: 2,
                        position: 'relative',
                        bgcolor: selected[product.id] ? 'success.50' : 'background.paper',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: 6
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!selected[product.id]}
                            onChange={() => toggleSelect(product.id)}
                            sx={{ position: 'absolute', top: 4, left: 4 }}
                          />
                        }
                        label=""
                      />
                      <Chip
                        label={category.categoriesName}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: category.color || 'grey.400',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <CardMedia
                        component="img"
                        height="120"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'contain', pt: 2, pb: 1 }}
                      />
                      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                        <Typography variant="subtitle1" component="div" fontWeight="bold" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden', mb: 1 }}>
                          {product.specs}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                          EGP{product.price.toFixed(2)}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Qty:</Typography>
                          <TextField
                            type="number"
                            value={product.quantity}
                            inputProps={{ min: 1 }}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            size="small"
                            variant="outlined"
                            sx={{ width: 60 }}
                          />
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', p: 1, pt: 0 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          variant="contained"
                          onClick={() => handleEdit(product)}
                          sx={{ flex: 1, mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(product.id)}
                          sx={{ flex: 1 }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                <Typography color="text.secondary">
                  No products found matching your search criteria.
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected Products: <strong>{selectedProductCount}</strong>
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Total Order Price: <strong>EGP{totalAmount.toFixed(2)}</strong>
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleCreateOrder}
            disabled={selectedProductCount === 0}
            sx={{ borderRadius: 4, px: 4 }}
          >
            Create Order
          </Button>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SelectProductPage;