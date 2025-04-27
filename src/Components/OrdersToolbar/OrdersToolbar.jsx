// OrdersToolbar.jsx
import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";

const OrdersToolbar = ({ setSearchTerm }) => {
  const debouncedSetSearchTerm = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  return (
    <Box
      className="orders-toolbar"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        bgcolor: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium">
        Filter Orders
      </Typography>
      <TextField
        placeholder="Search by Company / Code / ID / Status / Date"
        variant="outlined"
        size="small"
        onChange={(e) => debouncedSetSearchTerm(e.target.value)}
        sx={{ flexGrow: 1, maxWidth: 400 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
          "aria-label": "Search orders",
        }}
      />
    </Box>
  );
};

export default OrdersToolbar;