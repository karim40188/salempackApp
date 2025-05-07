import React, { useContext, useEffect, useState } from 'react';
import './OrdersTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';
import { Context } from '../../../context/AuthContext';
import axios from 'axios';

const OrdersTable = () => {

  const { baseUrl, token } = useContext(Context);
  const [lastFiveOrders, setLastFiveOrders] = useState([])
  // const [rawDate,setrawDate]=useState("")
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseUrl}/dashboard/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLastFiveOrders(res?.data?.slice(-5).reverse());
      } catch (err) {
        console.log(err)
      }
    };

    fetchOrders();
  }, [token, baseUrl]);

  const STATUS_COLORS = {
    PENDING: 'warning',
    ACCEPTED: 'info',
    MANUFACTURING: 'primary',
    PRINTING: 'primary',
    PACKAGING: 'info',
    DELIVERING: 'warning',
    FINISHED: 'success',
    CANCELLED: 'error',
    on_hold: "default",
  };


  return (
    <div className="orders-table-wrapper">
      <TableContainer component={Paper} className="orders-table-container">
        <div style={{ overflowX: 'auto' }}>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lastFiveOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell align="center">#{order.id}</TableCell>
                  <TableCell>{order.client.CompanyName}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <Chip label={order.status} color={STATUS_COLORS[order.status.toUpperCase()]} size="small" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
