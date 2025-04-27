// OrdersHeader.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const OrdersHeader = ({ onCreateNewOrder }) => {
  return (
    <Box
      className="orders-header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 3,
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Orders
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onCreateNewOrder}
      >
        New Order
      </Button>
    </Box>
  );
};

export default OrdersHeader;