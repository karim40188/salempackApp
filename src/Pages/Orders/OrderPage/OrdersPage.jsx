// src/pages/Orders.jsx
import React, { useState } from 'react';
import {
  Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptIcon from '@mui/icons-material/Receipt';
import './OrderPageStyle.css';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');

const orders = [
  { id: '#123456', company: 'Espresso Lab', total: '31,520 EGP', date: '22 - 4 -2025', status: 'Pending' },
  { id: '#123457', company: 'Juhayna', total: '12,000 EGP', date: '20 - 4 -2025', status: 'Pending' },
  { id: '#123458', company: 'El Sewedy Electric', total: '85,000 EGP', date: '18 - 4 -2025', status: 'Pending' },
  { id: '#123459', company: 'Cleopatra Group', total: '45,000 EGP', date: '15 - 4 -2025', status: 'Pending' },
  { id: '#123460', company: 'Ezz Steel', total: '98,300 EGP', date: '14 - 4 -2025', status: 'Pending' },
  { id: '#123461', company: 'Fresh Electric', total: '21,780 EGP', date: '13 - 4 -2025', status: 'Pending' },
  { id: '#123462', company: 'Edita Food Industries', total: '17,400 EGP', date: '12 - 4 -2025', status: 'Pending' },
  { id: '#123463', company: 'AlexBank', total: '64,000 EGP', date: '10 - 4 -2025', status: 'Pending' },
  { id: '#123464', company: 'Mobinil Egypt', total: '35,750 EGP', date: '8 - 4 -2025', status: 'Pending' },
];


  const filteredOrders = orders.filter(order =>
    order.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="orders-container">
      <Box className="orders-header">
        <Button className="new-order-btn">New Order</Button>
        <Typography variant="h5" fontWeight="bold">Orders</Typography>
      </Box>

      <Box className="orders-toolbar">
        <Typography variant="subtitle1" className="filter-label">Filter By Date</Typography>
        <TextField
          className="search-input"
          placeholder="Search By Company Name"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.company}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Box className="actions-box">
                    <Button variant="contained" size="small" className="edit-btn" startIcon={<EditIcon />}>Edit</Button>
                    <Button variant="contained" size="small" className="reorder-btn" startIcon={<ReplayIcon />}>Re Order</Button>
                    <Button variant="contained" size="small" className="invoice-btn" startIcon={<ReceiptIcon />}>Invoice</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
