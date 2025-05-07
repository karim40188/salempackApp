import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Avatar, 
  IconButton,
  Container,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputAdornment
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
import useImageUploader from '../../hooks/useImageUploader';

const EditClient = () => {
  const { id } = useParams();
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    username: '',
    CompanyName: '',
    MobileNumber: '',
    Email: '',
    Logo: '',
    Password: '',
    products: [],
  });

  const [newLogo, setNewLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });
  
  // New state for products management
  const [availableProducts, setAvailableProducts] = useState([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/dashboard/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const client = res.data;
        
        // Transform ClientProducts data to match the expected format for the API
        const transformedProducts = client.ClientProducts?.map(item => ({
          product: item.Products.productName,
          Price: item.Price,
          MinimumQuantity: item.MinimumQuantity,
          productid: Number(item.Products.id)// Adding the required productid field
        })) || [];
    
        setClientData({
          username: client.username || '',
          CompanyName: client.CompanyName || '',
          MobileNumber: client.MobileNumber || '',
          Email: client.Email || '',
          Logo: client.Logo || '',
          Password: '', // Keep empty
          products: transformedProducts,
        });
        console.log("Client products loaded:", transformedProducts);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setMessage({ 
          open: true, 
          text: 'Failed to load client data. Please try again.', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
    fetchProducts();
  }, [baseUrl, token, id]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${baseUrl}/dashboard/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableProducts(res?.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setMessage({
        open: true,
        text: 'Failed to load products. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...clientData.products];
    updatedProducts[index][field] = field === 'product' ? value : Number(value);
    
    setClientData({
      ...clientData,
      products: updatedProducts,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogo(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setNewLogo(null);
    setPreviewLogo(null);
    setClientData({
      ...clientData,
      Logo: '',
    });
  };

  const handleAddProduct = (product) => {
    // Check if product already exists in client products
    const isAlreadyAdded = clientData.products.some(
      item => item.product === product.productName
    );

    if (isAlreadyAdded) {
      setMessage({
        open: true,
        text: 'This product is already added for the client.',
        severity: 'warning'
      });
      return;
    }

    // Add new product to client products
    const newProduct = {
      product: product.productName,
      Price: product.productPrice,
      MinimumQuantity: 1,
      productid: product.id // Adding the required productid field
    };

    setClientData({
      ...clientData,
      products: [...clientData.products, newProduct]
    });

    setProductDialogOpen(false);
    setSearchTerm('');
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...clientData.products];
    updatedProducts.splice(index, 1);
    
    setClientData({
      ...clientData,
      products: updatedProducts
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoPath = clientData.Logo;

      if (newLogo) {
        const uploadedPath = await uploadImage(newLogo);
        if (uploadedPath) {
          logoPath = uploadedPath;
        }
      }

      await axios.patch(`${baseUrl}/dashboard/clients/${id}`, {
        ...clientData,
        Logo: logoPath,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({
        open: true,
        text: 'Client updated successfully!',
        severity: 'success'
      });
      
      // Navigate back after successful update and short delay
      setTimeout(() => navigate('/clients'), 1500);
    } catch (err) {
      console.error('Error updating client:', err);
      setMessage({
        open: true,
        text: 'Failed to update client. Please try again.',
        severity: 'error'
      });
      setSaving(false);
    }
  };

  const filteredProducts = availableProducts.filter(product => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ 
        mt: { xs: 2, sm: 4 }, 
        mb: { xs: 2, sm: 4 }, 
        borderRadius: 2, 
        overflow: 'hidden' 
      }}>
        {/* Header */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: { xs: 1, sm: 2 }, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={() => navigate('/clients')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              Edit Client
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box p={{ xs: 2, sm: 3 }}>
            {/* Client Logo Section */}
            <Card sx={{ 
              mb: { xs: 2, sm: 4 }, 
              bgcolor: '#f5f5f5', 
              borderRadius: 2 
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Company Logo
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Avatar
                    src={previewLogo || (clientData.Logo ? `${baseUrl}/public/uploads/${clientData.Logo}` : '')}
                    alt={clientData.CompanyName}
                    sx={{ 
                      width: { xs: 80, sm: 120 }, 
                      height: { xs: 80, sm: 120 }, 
                      border: '2px solid #e0e0e0',
                      boxShadow: 2
                    }}
                  />
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  '& > button': { width: { xs: '100%', sm: 'auto' } }
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    component="label"
                  >
                    Change Logo
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                  {(clientData.Logo || previewLogo) && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveLogo}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 'medium',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              Client Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Username"
                  name="username"
                  value={clientData.username}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  name="CompanyName"
                  value={clientData.CompanyName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile Number"
                  name="MobileNumber"
                  value={clientData.MobileNumber}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address"
                  name="Email"
                  type="email"
                  value={clientData.Email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="Password"
                  type="password"
                  value={clientData.Password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  helperText="Leave empty to keep current password"
                />
              </Grid>
            </Grid>

            {/* Products Section */}
            <Box sx={{ mt: { xs: 3, sm: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'medium',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  Client Products
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => setProductDialogOpen(true)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Add Product
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {clientData.products.length > 0 ? (
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    mb: 3, 
                    boxShadow: 2, 
                    borderRadius: 2,
                    overflowX: 'auto'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'primary.light' }}>
                        <TableCell sx={{ 
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}>Product</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}>Price</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}>Minimum Quantity</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientData.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {product.product} 
                            {product.productid && <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                              ID: {product.productid}
                            </Typography>}
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              variant="outlined"
                              size="small"
                              value={product.Price}
                              onChange={(e) => handleProductChange(index, 'Price', e.target.value)}
                              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              variant="outlined"
                              size="small"
                              value={product.MinimumQuantity}
                              onChange={(e) => handleProductChange(index, 'MinimumQuantity', e.target.value)}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduct(index)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No products assigned to this client. Click "Add Product" to assign products.
                </Alert>
              )}
            </Box>

            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              '& > button': { width: { xs: '100%', sm: 'auto' } }
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/clients')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Product Selection Dialog */}
      <Dialog 
        open={productDialogOpen} 
        onClose={() => setProductDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Add Product</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          {loadingProducts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredProducts.length > 0 ? (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredProducts.map((product) => (
                <ListItem 
                  button 
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  divider
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={product.productName}
                      src={`${baseUrl}/public/uploads/${product.productPhoto}`}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={product.productName} 
                    secondary={`Price: ${product.productPrice} • ${product.productDescription || 'No description'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No products found matching your search
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={() => setMessage({ ...message, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage({ ...message, open: false })} 
          severity={message.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditClient;