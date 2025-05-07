import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  Tooltip,
} from "@mui/material";
import { Search, Edit, Delete, Add, Business, ErrorOutline } from "@mui/icons-material";
import { debounce } from "lodash";
import axios from "axios";
import { Context } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ClientsPage = () => {
  const { baseUrl, token } = useContext(Context);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/dashboard/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data || []);
        setError(null);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Unauthorized. Please log in again."
            : "Failed to load clients. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [baseUrl, token]);

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 300);

  const handleDelete = async () => {
    if (!clientToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`${baseUrl}/dashboard/clients?id=${clientToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients((prev) => prev.filter((client) => client.id !== clientToDelete.id));
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (err) {
      console.log(err)
      setError("Failed to delete client. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.CompanyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: "#f8f9fa", 
      minHeight: "100vh" 
    }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
        }}
      >
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Business sx={{ fontSize: 28, mr: 1.5, color: "#1976d2" }} />
            <Typography variant="h5" fontWeight="600">
              Clients Management
            </Typography>
          </Box>

          <Box sx={{ 
            display: "flex", 
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" }
          }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search clients..."
              onChange={(e) => debouncedSetSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              fullWidth
              sx={{ 
                minWidth: { sm: 220 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/add-clients")}
              startIcon={<Add />}
              sx={{ 
                borderRadius: 2, 
                py: 1,
                px: { xs: 3, sm: 2 },
                boxShadow: "0 4px 10px rgba(25, 118, 210, 0.2)",
                whiteSpace: "nowrap",
                width:'100%'
              }}
            >
              Add New Client
            </Button>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : filteredClients.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 5, 
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
          }}
        >
          <ErrorOutline sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No clients found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or add a new client.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-clients")}
            startIcon={<Add />}
            sx={{ borderRadius: 2, py: 1, px: 3 }}
          >
            Add New Client
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredClients.map((client) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
              <Card 
                sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: 140, 
                    bgcolor: "#f5f5f5", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    p: 2,
                    position: "relative"
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      client.Logo
                        ? `${baseUrl}/public/uploads/${client.Logo}`
                        : "https://via.placeholder.com/150?text=No+Logo"
                    }
                    alt={client.CompanyName}
                    sx={{ 
                      height: "100%", 
                      objectFit: "contain",
                      width:"250px",
                      maxWidth: "100%"
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Logo";
                    }}
                  />
                </Box>
                
                <CardContent sx={{ p: 2.5, pb: 1, flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      textAlign: "center",
                      mb: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }} 
                    title={client.CompanyName}
                  >
                    {client.CompanyName}
                  </Typography>
                  
                  {client.ContactName && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ textAlign: "center" }}
                    >
                      Contact: {client.ContactName}
                    </Typography>
                  )}
                </CardContent>

                <Divider />
                
                <CardActions sx={{ p: 1.5, pt: 1.5, pb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Tooltip title="Edit Client">
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={() => navigate(`/edit-client/${client.id}`)}
                          startIcon={<Edit />}
                          sx={{ borderRadius: 1.5 }}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Delete Client">
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => {
                            setClientToDelete(client);
                            setDeleteDialogOpen(true);
                          }}
                          startIcon={<Delete />}
                          sx={{ borderRadius: 1.5 }}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" />
            <Typography variant="h6">Confirm Deletion</Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{clientToDelete?.CompanyName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={20} />}
            sx={{ borderRadius: 1.5 }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsPage;