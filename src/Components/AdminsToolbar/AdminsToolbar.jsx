// AdminsToolbar.jsx
import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const AdminsToolbar = ({ setSearchTerm }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 3
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 500 }}>
        <TextField
          fullWidth
          placeholder="Search by username, email or ID..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 6 }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 6
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default AdminsToolbar;