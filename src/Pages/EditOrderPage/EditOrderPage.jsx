import React, { useEffect, useState, useContext } from "react";
import {
  Box, Button, TextField, Typography, CircularProgress, MenuItem,
  Grid, Paper, Container, Alert, Breadcrumbs, Link, Chip,
  TableContainer, Table, TableHead, TableBody, TableRow,
  TableCell, Card, CardHeader, CardContent, Select, FormControl, InputLabel,
  IconButton, Avatar, Divider,
  Snackbar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";


const ORDER_STATUSES = {
  PENDING: { label: 'Pending', color: 'warning' },
  ACCEPTED: { label: 'Accepted', color: 'info' },
  MANUFACTURING: { label: 'Manufacturing', color: 'primary' },
  PRINTING: { label: 'Printing', color: 'primary' },
  PACKAGING: { label: 'Packaging', color: 'info' },
  DELIVERING: { label: 'Delivering', color: 'warning' },
  FINISHED: { label: 'Finished', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'error' },
};

// Order type options
const ORDER_TYPES = ["cup", "corrugated box"];

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { baseUrl, token } = useContext(Context);

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch order details
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/dashboard/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Order data:", data);
      setOrder(data);
      
      // Only fetch products after we have the order data with clientId
      if (data && data.clientId) {
        fetchProducts(data.clientId);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available products - Now with clientId parameter
  const fetchProducts = async (clientId) => {
    try {
      const { data } = await axios.get(`${baseUrl}/dashboard/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Client products:", data.items);
      setProducts(data.items || []);
    } catch (err) {
      console.error("Error fetching client's products:", err);
    }
  };

  useEffect(() => {
    fetchOrder();
    // fetchProducts() will be called inside fetchOrder after we have clientId
  }, [id, baseUrl, token]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    
    if (field === 'product') {
      // Find the selected product by name
      const selectedProduct = products.find(p => p.productName === value);
      if (selectedProduct) {
        // Update the item with product details
        updatedItems[index] = {
          ...updatedItems[index],
          product: value,
          productid: selectedProduct.id, // Store the product ID
          Price: selectedProduct.productPrice,
          productImage: selectedProduct.productImage
        };
      }
    } else {
      // Update other fields
      updatedItems[index][field] = value;
    }
    
    // Recalculate the total line amount
    updatedItems[index].TotalLine = updatedItems[index].Price * updatedItems[index].Quantity;
    
    // Update the order with new items and total
    updateOrderTotal(updatedItems);
  };

  const updateOrderTotal = (items) => {
    const newTotal = items.reduce((sum, item) => sum + item.TotalLine, 0);
    setOrder({ ...order, items: items, total: newTotal });
  };

  const handleDeleteItem = (index) => {
    if (order.items.length === 1) {
      setAlert({
        open: true,
        message: "Order must have at least one item",
        severity: "error"
      });
      return;
    }

    const updatedItems = order.items.filter((_, i) => i !== index);
    updateOrderTotal(updatedItems);
  };

  const handleAddItem = () => {
    if (products.length === 0) {
      setAlert({
        open: true,
        message: "No products available to add",
        severity: "warning"
      });
      return;
    }

    const defaultProduct = products[0];
    const newItem = {
      productid: defaultProduct.id,
      product: defaultProduct.productName,
      productImage: defaultProduct.productImage,
      Price: defaultProduct.productPrice,
      Quantity: 1,
      TotalLine: defaultProduct.productPrice
    };

    const updatedItems = [...order.items, newItem];
    updateOrderTotal(updatedItems);
  };
  
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const updatedOrder = {
        clientId: order.clientId,
        total: order.total,
        type: order.type || "cup",
        status: order.status,
        items: order.items.map(item => ({
          productid: item.productid, // Use the stored productid
          product: item.product,
          Price: item.Price,
          Quantity: item.Quantity,
          TotalLine: item.TotalLine,
        })),
      };
      
      console.log("Updating order with:", updatedOrder);
      
      await axios.patch(`${baseUrl}/dashboard/orders/${id}`, updatedOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAlert({
        open: true,
        message: "Order updated successfully",
        severity: "success"
      });
   
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to edit order",
        severity: "error"
      });
      console.error("Error updating order:", err);
      setError("Failed to update order. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusChip = (status) => {
    // Convert status string to match our status keys
    const statusKey = status.toUpperCase();
    const statusInfo = ORDER_STATUSES[statusKey] || { label: status, color: 'default' };

    return (
      <Chip
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        sx={{ fontWeight: 'medium', minWidth: '90px', borderRadius: '4px' }}
      />
    );
  };

  if (loading || !order) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link
          color="inherit"
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => navigate("/orders")}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
          Orders
        </Link>
        <Typography color="text.primary">Edit Order #{order.code}</Typography>
      </Breadcrumbs>

      {/* Order Details */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Edit Order
          </Typography>
          {getStatusChip(order.status)}
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Side: Order Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <CardHeader title="Order Details" sx={{ backgroundColor: '#f5f5f5', p: 2 }} />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField label="Order ID" fullWidth value={order.id} InputProps={{ readOnly: true }} size="small" sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Order Code" fullWidth value={order.code} InputProps={{ readOnly: true }} size="small" sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Client ID" fullWidth value={order.clientId} InputProps={{ readOnly: true }} size="small" sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={order.status}
                          label="Status"
                          onChange={(e) => setOrder({ ...order, status: e.target.value })}
                        >
                          {Object.keys(ORDER_STATUSES).map((key) => (
                            <MenuItem key={key} value={ORDER_STATUSES[key].label.toLowerCase()}>
                              {ORDER_STATUSES[key].label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={order.type || "cup"}
                          label="Type"
                          onChange={(e) => setOrder({ ...order, type: e.target.value })}
                        >
                          {ORDER_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Side: Client Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <CardHeader title="Client Information" sx={{ backgroundColor: '#f5f5f5', p: 2 }} />
                <CardContent>
                  {order.client ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField label="Company Name" fullWidth value={order.client.CompanyName || '—'} InputProps={{ readOnly: true }} size="small" sx={{ mb: 2 }} />
                      </Grid>
                      {order.client.Email && (
                        <Grid item xs={12}>
                          <TextField label="Email" fullWidth value={order.client.Email} InputProps={{ readOnly: true }} size="small" sx={{ mb: 2 }} />
                        </Grid>
                      )}
                      {order.client.Phone && (
                        <Grid item xs={12}>
                          <TextField label="Phone" fullWidth value={order.client.Phone} InputProps={{ readOnly: true }} size="small" sx={{ mb: 2 }} />
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">Client information not available</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Items Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 3, backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Order Items</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order?.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: '200px' }}>
                    <Select
                      value={item.product || ""}
                      fullWidth
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      size="small"
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.productName}>
{console.log(product)}

                          {product.productName}
                        
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={item.productImage || "/placeholder.png"}
                      alt={item.product}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.Price}
                      type="number"
                      fullWidth
                      onChange={(e) => handleItemChange(index, 'Price', +e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: <Box sx={{ mr: 1 }}>EGP</Box>,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.Quantity}
                      type="number"
                      InputProps={{ inputProps: { min: 1 } }}
                      fullWidth
                      onChange={(e) => handleItemChange(index, 'Quantity', +e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>EGP {item.TotalLine.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteItem(index)}
                      disabled={order.items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total:
                  </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    EGP {order.total.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate("/orders")}
          startIcon={<ArrowBackIcon />}
        >
          Back to Orders
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleUpdate}
          disabled={updating}
          startIcon={updating ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
        >
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditOrderPage;