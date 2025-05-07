// Main component file: Orders.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "./OrderPageStyle.css";
import { Context } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Import smaller components
import DeleteConfirmDialog from "../../../Components/DeleteConfirmDialog/DeleteConfirmDialog";
import InvoiceDialog from "../../../Components/InvoiceDialog/InvoiceDialog";
import OrdersTable from "../../../Components/OrdersTable/OrdersTable";
import OrdersToolbar from "../../../Components/OrdersToolbar/OrdersToolbar";
import OrdersHeader from "../../../Components/OrdersHeader/OrdersHeader";

const Orders = () => {
  const { token, baseUrl } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/dashboard/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setError(null);
      } catch (err) {
        console.log(err)
        setError(
          err.response?.status === 401
            ? "Unauthorized. Please log in again."
            : "Failed to load orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, baseUrl]);

  const handleReorder = async (orderId) => {
    try {
      // إظهار رسالة تحميل أو تعطيل الزر إذا لزم الأمر
      setLoading(true);
      
      // إرسال طلب إعادة الطلب
      const res = await axios.get(
        `${baseUrl}/dashboard/orders/reorder/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // التحقق من الاستجابة
      if (res.data && res.data.id) {
        // إضافة الأوردر الجديد للقائمة المحلية
        setOrders(prevOrders => [res.data, ...prevOrders]);
        
        // الانتقال إلى صفحة تعديل الأوردر الجديد
        // navigate(`/edit-order/${res.data.id}`);
      } else {
        // إذا كانت عملية إعادة الطلب ناجحة ولكن بدون بيانات كاملة
        console.error("Reorder response missing ID:", res.data);
        
        // إعادة تحميل جميع الأوردرات لضمان تحديث القائمة
        const refreshRes = await axios.get(`${baseUrl}/dashboard/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(refreshRes.data);
        
        setError("Successfully created order");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${baseUrl}/dashboard/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: orderToDelete.id },
      });
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      setOpenDeleteConfirm(false);
    } catch (err) {
      setError("Failed to delete order. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Helper function to format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };
  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.client?.CompanyName?.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      formatDate(order.createdAt).includes(searchTerm)
  );

  // Get paginated orders
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );



  return (
    <Box className="orders-container">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <OrdersHeader onCreateNewOrder={() => navigate("/select-clients")} />
      
      <OrdersToolbar setSearchTerm={setSearchTerm} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or create a new order.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/select-clients")}
          >
            Create New Order
          </Button>
        </Box>
      ) : (
        <OrdersTable
          orders={paginatedOrders}
          totalCount={filteredOrders.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          formatDate={formatDate}
          onEdit={(orderId) => navigate(`/edit-order/${orderId}`)}
          onReorder={handleReorder}
          onViewInvoice={(order) => {
            setSelectedOrder(order);
            setOpenInvoice(true);
          }}
          onDelete={(order) => {
            setOrderToDelete(order);
            setOpenDeleteConfirm(true);
          }}
        />
      )}

      <InvoiceDialog
        open={openInvoice}
        order={selectedOrder}
        formatDate={formatDate}
        onClose={() => setOpenInvoice(false)}
      />

      <DeleteConfirmDialog
        open={openDeleteConfirm}
        deleting={deleting}
        onClose={() => setOpenDeleteConfirm(false)}
        onDelete={deleteOrder}
        message={"Are you sure you want to delete this order?"}
      />
    </Box>
  );
};

export default Orders;