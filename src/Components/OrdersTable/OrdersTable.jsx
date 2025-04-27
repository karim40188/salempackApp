// OrdersTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DeleteIcon from "@mui/icons-material/Delete";

const OrdersTable = ({
  orders,
  totalCount,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  formatDate,
  onEdit,
  onReorder,
  onViewInvoice,
  onDelete,
}) => {
  const STATUS_COLORS = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    completed: "success",
    cancelled: "error",
    on_hold: "default",
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.client?.CompanyName || "—"}</TableCell>
                <TableCell>{order.code}</TableCell>
                <TableCell>{order.total} EGP</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      STATUS_COLORS[order.status.toLowerCase()] || "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(order.id)}
                      aria-label={`Edit order ${order.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<ReplayIcon />}
                      onClick={() => onReorder(order.id)}
                      aria-label={`Reorder ${order.id}`}
                    >
                      Reorder
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      startIcon={<ReceiptIcon />}
                      onClick={() => onViewInvoice(order)}
                      aria-label={`View invoice for order ${order.id}`}
                    >
                      Invoice
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => onDelete(order)}
                      aria-label={`Delete order ${order.id}`}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
};

export default OrdersTable;