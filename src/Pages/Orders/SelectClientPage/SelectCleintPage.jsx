import React, { useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, Paper
} from '@mui/material';
import { CheckCircle, Search } from '@mui/icons-material';
import './SelectClientPageStyle.css';

const clients = [
  { id: 1, name: 'Espresso Lab', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Espresso_Lab_logo.png' },
  { id: 2, name: 'Juhayna', logo: 'https://www.juhayna.com/wp-content/uploads/2021/04/logo@2x.png' },
  { id: 3, name: 'El Sewedy', logo: 'https://www.elsewedyelectric.com/sites/default/files/inline-images/logo_0.png' },
  { id: 4, name: 'Ezz Steel', logo: 'https://media.licdn.com/dms/image/C4D0BAQHfx9AF1n41PQ/company-logo_200_200/0/1630627009942?e=2147483647&v=beta&t=WIvJGZkqWABgqvjxms9-H0u6uLTfgpL7BmnOqH70BuA' },
  { id: 5, name: 'Cleopatra Group', logo: 'https://www.cleopatragroup.com/images/logo.png' },
  { id: 6, name: 'Fresh Electric', logo: 'https://fresh.com.eg/pub/media/logo/stores/1/FRESH-EN.png' },
  { id: 7, name: 'Edita Foods', logo: 'https://www.edita.com.eg/assets/images/logo.png' },
  { id: 8, name: 'AlexBank', logo: 'https://www.alexbank.com/etc.clientlibs/settings/wcm/designs/alexbank/clientlibs/resources/img/logo.png' },
  { id: 9, name: 'Mobinil Egypt', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Orange_logo.svg/1920px-Orange_logo.svg.png' },
  { id: 10, name: 'El Araby Group', logo: 'https://www.elarabygroup.com/assets/images/logo/logo-en.svg' },
  { id: 11, name: 'CIB Egypt', logo: 'https://www.cibeg.com/PublishingImages/logo.svg' },
  { id: 12, name: 'Orascom', logo: 'https://www.orascom.com/wp-content/uploads/2021/07/Orascom_Development_Logo.svg' },
];


const SelectClient = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
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
              <img src={client.logo} alt={client.name} className="client-logo" />
              <Typography variant="body2">{client.name}</Typography>
              {selectedClient === client.id && (
                <CheckCircle className="check-icon" />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" className="select-product-btn">
          Select Product
        </Button>
      </Box>
    </Box>
  );
};

export default SelectClient;
