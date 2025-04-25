import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography,
  InputAdornment, Chip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './OrderPageStyle.css';
import { Context } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { token } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const invoiceRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://salempack.dashboard-5sm2025.cfd/dashboard/orders/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const filteredOrders = orders.filter(order =>
    order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm) ||
    order.client?.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB');
  };

  const downloadPDF = () => {
    html2pdf(invoiceRef.current, {
      margin: 10,
      filename: `Invoice-${selectedOrder.code || selectedOrder.id}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });
  };

  return (
    <Box className="orders-container">
      <Box className="orders-header">
        <Button onClick={() => navigate("/select-clients")} className="new-order-btn">New Order</Button>
        <Typography variant="h5" fontWeight="bold">Orders</Typography>
      </Box>

      <Box className="orders-toolbar">
        <Typography variant="subtitle1" className="filter-label">Filter Orders</Typography>
        <TextField
          className="search-input"
          placeholder="Search by Company / Code / ID / Status"
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

      {loading ? (
        <Typography>Loading orders...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Order Code</TableCell>
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
                  <TableCell>{order.client?.CompanyName || '—'}</TableCell>
                  <TableCell>{order.code}</TableCell>
                  <TableCell>{order.total} EGP</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Chip label={order.status} color="warning" size="small" />
                  </TableCell>
                  <TableCell>
                    <Box className="actions-box">
                      <Button
                        variant="contained"
                        size="small"
                        className="edit-btn"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/edit-order/${order.id}`)}
                      >
                        Edit
                      </Button>
                      <Button variant="contained" size="small" className="reorder-btn" startIcon={<ReplayIcon />}>
                        Re Order
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        className="invoice-btn"
                        startIcon={<ReceiptIcon />}
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpenInvoice(true);
                        }}
                      >
                        Invoice
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Invoice */}
      <Dialog open={openInvoice} onClose={() => setOpenInvoice(false)} maxWidth="md" fullWidth>
        <DialogTitle>Invoice</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div ref={invoiceRef} style={{ padding: '20px' }}>
              <h2 style={{ marginBottom: '10px' }}>Invoice</h2>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Order Code:</strong> {selectedOrder.code}</p>
              <p><strong>Company:</strong> {selectedOrder.client?.CompanyName}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> {selectedOrder.total} EGP</p>
              <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>

              <hr style={{ margin: '15px 0' }} />

              <h3>Products</h3>
              <ul>
                {selectedOrder.products?.map((product, i) => (
                  <li key={i}>{product.name} - {product.quantity} × {product.price} EGP</li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvoice(false)}>Close</Button>
          <Button variant="contained" color="primary" onClick={downloadPDF}>Download PDF</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
