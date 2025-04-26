import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, Paper, IconButton
} from '@mui/material';
import { CheckCircle, Search, Edit, Delete } from '@mui/icons-material';
import './SelectClientPageStyle.css';
import axios from 'axios';
import { Context } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SelectClient = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const navigate = useNavigate()
  const { baseUrl, token } = useContext(Context);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${baseUrl}/dashboard/clients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClients(res.data || []);
      } catch (err) {
        console.error("Error fetching clients", err);
      }
    };

    fetchClients();
  }, [baseUrl, token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`${baseUrl}/dashboard/clients?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // امسح العميل من الليسته بعد الحذف
        setClients(prev => prev.filter(client => client.id !== id));
      } catch (err) {
        console.error("Error deleting client", err);
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.CompanyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="select-client-container">
      <Button onClick={() => navigate("/add-clients")} className='add-client-btn' sx={{ color: "white", mb: '20px' }}>
        Add Client
      </Button>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" className="select-title">Select Client</Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by Company Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <Search style={{ color: '#fff' }} />,
            className: 'search-input',
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {filteredClients.map((client) => (
          <Grid item xs={6} sm={3} md={2} key={client.id}>
            <Paper
              elevation={selectedClient === client.id ? 8 : 1}
              className={`client-card ${selectedClient === client.id ? 'selected' : ''}`}
              onClick={() => setSelectedClient(client.id)}
              sx={{ position: 'relative' }}
            >
              <img
                src={`${baseUrl}/public/uploads/${client.Logo}`}
                alt={client.CompanyName}
                className="client-logo"
              />
              <Typography variant="body2">{client.CompanyName}</Typography>
              {selectedClient === client.id && (
                <CheckCircle className="check-icon" />
              )}

              {/* زرار Edit */}
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 5, right: 30 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-client/${client.id}`);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>

              {/* زرار Delete */}
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 5, right: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(client.id);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>

            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="right" mt={4}>
        <Button
          onClick={() => {
            localStorage.setItem("selectedClientId", selectedClient);
            navigate("/select-product");
          }}
          variant="contained"
          className="select-product-btn"
          disabled={!selectedClient}
        >
          Select Product
        </Button>
      </Box>
    </Box>
  );
};

export default SelectClient;
