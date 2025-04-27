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
} from "@mui/material";
import { CheckCircle, Search, Edit, Delete, Add } from "@mui/icons-material";
import { debounce } from "lodash";
import axios from "axios";
import { Context } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SelectClientPageStyle.css";

const SelectClient = () => {
  const { baseUrl, token } = useContext(Context);
  const [selectedClient, setSelectedClient] = useState(null);
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
      if (selectedClient === clientToDelete.id) {
        setSelectedClient(null);
      }
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (err) {
      setError("Failed to delete client. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.CompanyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="select-client-container">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box className="header">
        <Typography variant="h5" className="select-title">
          Select Client
        </Typography>

        <Box className="header-actions">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Company Name"
            onChange={(e) => debouncedSetSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/add-clients")}
            startIcon={<Add />}
            className="add-client-btn"
          >
            Add Client
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredClients.length === 0 ? (
        <Box className="no-clients">
          <Typography variant="h6" color="text.secondary">
            No clients found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or add a new client.
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => navigate("/add-clients")}
          >
            Add Client
          </Button>
        </Box>
      ) : (
        <Grid container spacing={5}>
          {filteredClients.map((client) => (
            <Grid item xs={12} sm={6} md={4} lg={5} key={client.id}>
              <Box className="client-box">
                <Paper
                  elevation={selectedClient === client.id ? 8 : 2}
                  className={`client-card ${selectedClient === client.id ? "selected" : ""}`}
                  onClick={() => setSelectedClient(client.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select client ${client.CompanyName}`}
                >
                  <img
                    src={
                      client.Logo
                        ? `${baseUrl}/public/uploads/${client.Logo}`
                        : "/default-logo.png"
                    }
                    alt={client.CompanyName}
                    className="client-logo"
                    onError={(e) => (e.target.src = "/default-logo.png")}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: selectedClient === client.id ? "bold" : "normal",
                      textAlign: "center",
                    }}
                  >
                    {client.CompanyName}
                  </Typography>

                  {selectedClient === client.id && (
                    <CheckCircle className="check-icon" />
                  )}
                </Paper>

                <Box className="client-actions">
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/edit-client/${client.id}`)}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => {
                      setClientToDelete(client);
                      setDeleteDialogOpen(true);
                    }}
                    startIcon={<Delete />}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box className="footer">
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            localStorage.setItem("selectedClientId", selectedClient);
            navigate("/select-product");
          }}
          disabled={!selectedClient}
          className="select-product-btn"
        >
          Select Product
        </Button>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {clientToDelete?.CompanyName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={20} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SelectClient;
