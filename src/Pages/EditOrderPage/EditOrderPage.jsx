import React, { useEffect, useState, useContext } from "react";
import {
  Box, Button, TextField, Typography, CircularProgress, MenuItem, Grid, Paper
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { baseUrl, token } = useContext(Context);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${baseUrl}/dashboard/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    updatedItems[index].TotalLine = updatedItems[index].Price * updatedItems[index].Quantity;
    const newTotal = updatedItems.reduce((acc, item) => acc + item.TotalLine, 0);
    setOrder({ ...order, items: updatedItems, total: newTotal });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const updatedOrder = {
        clientId: order.clientId,
        total: order.total,
        status: order.status,
        items: order.items,
      };
      await axios.patch(`${baseUrl}/dashboard/orders/${id}`, updatedOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order updated successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Order</Typography>

      <TextField
        label="Client ID"
        type="number"
        fullWidth
        value={order.clientId}
        onChange={(e) => setOrder({ ...order, clientId: +e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Status"
        select
        fullWidth
        value={order.status}
        onChange={(e) => setOrder({ ...order, status: e.target.value })}
        sx={{ mb: 2 }}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </TextField>

      <Typography variant="h6" gutterBottom>Items</Typography>
      {order.items.map((item, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Product"
                fullWidth
                value={item.product}
                onChange={(e) => handleItemChange(index, "product", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={item.Price}
                onChange={(e) => handleItemChange(index, "Price", +e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={item.Quantity}
                onChange={(e) => handleItemChange(index, "Quantity", +e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total"
                fullWidth
                value={item.TotalLine}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Typography variant="subtitle1" sx={{ mb: 2 }}>Total: {order.total.toFixed(2)} EGP</Typography>

      <Button variant="contained" color="primary" fullWidth onClick={handleUpdate} disabled={updating}>
        {updating ? "Updating..." : "Update Order"}
      </Button>
    </Box>
  );
};

export default EditOrderPage;
