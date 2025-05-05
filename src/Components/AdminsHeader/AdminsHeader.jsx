// AdminsHeader.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AdminsHeader = ({ onAddAdmin }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        borderRadius: 3,
        bgcolor: "background.default"
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage system administrators and their access
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddAdmin}
        sx={{
          px: 3,
          py: 1,
          fontWeight: "bold",
          borderRadius: 2
        }}
      >
        Add New Admin
      </Button>
    </Paper>
  );
};

export default AdminsHeader;