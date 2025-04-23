import React from 'react';
import './OrdersTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const orders = [
  { id: '#001', customer: 'John Doe', date: '2025-04-22', amount: '$120.00', status: 'Delivered' },
  { id: '#002', customer: 'Jane Smith', date: '2025-04-21', amount: '$75.50', status: 'Pending' },
  { id: '#003', customer: 'Michael Lee', date: '2025-04-20', amount: '$200.00', status: 'Shipped' },
  { id: '#004', customer: 'Sara Wilson', date: '2025-04-19', amount: '$90.00', status: 'Cancelled' },
];

const OrdersTable = () => {
  return (
    <div className="orders-table-wrapper">
      <TableContainer component={Paper} className="orders-table">
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
