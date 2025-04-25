import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, Paper
} from '@mui/material';
import { CheckCircle, Search } from '@mui/icons-material';
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
        console.log(res.data)
        
      } catch (err) {
        console.error("Error fetching clients", err);
      }
    };

    fetchClients();
  }, [baseUrl, token]);

  const filteredClients = clients.filter(client =>
    client.CompanyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="select-client-container">
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
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="right" mt={4}>
        <Button
          onClick={() => {
            localStorage.setItem("selectedClientId", selectedClient); // احفظ ID
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
