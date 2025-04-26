import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../context/AuthContext';
import useImageUploader from '../../hooks/useImageUploader';

const EditClient = () => {
  const { id } = useParams();
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    username: '',
    CompanyName: '',
    MobileNumber: '',
    Email: '',
    Logo: '',
    Password: '',
    products: [],
  });
  const [newLogo, setNewLogo] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
        try {
          const res = await axios.get(`${baseUrl}/dashboard/clients/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const client = res.data;
      
          setClientData({
            username: client.username,
            CompanyName: client.CompanyName,
            MobileNumber: client.MobileNumber,
            Email: client.Email,
            Logo: client.Logo,
            Password: '', // خليه فاضي
            products: client.products || [],
          });
      
        } catch (err) {
          console.error('Error fetching client data:', err);
        }
      };
      
    fetchClient();
  }, [baseUrl, token, id]);

  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewLogo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let logoPath = clientData.Logo;

      if (newLogo) {
        const uploadedPath = await uploadImage(newLogo);
        if (uploadedPath) {
          logoPath = uploadedPath;
        }
      }

      await axios.patch(`${baseUrl}/dashboard/clients/${id}`, {
        ...clientData,
        Logo: logoPath,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/select-clients');
    } catch (err) {
      console.error('Error updating client:', err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>Edit Client</Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            label="Username"
            name="username"
            value={clientData.username}
            onChange={handleChange}
          />

          <TextField
            label="Company Name"
            name="CompanyName"
            value={clientData.CompanyName}
            onChange={handleChange}
          />

          <TextField
            label="Mobile Number"
            name="MobileNumber"
            value={clientData.MobileNumber}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="Email"
            value={clientData.Email}
            onChange={handleChange}
          />

          <Button variant="contained" component="label">
            Upload New Logo
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          {clientData.Logo && (
            <img
              src={`${baseUrl}/public/uploads/${clientData.Logo}`}
              alt="Current Logo"
              style={{ width: '100px', marginTop: '10px' }}
            />
          )}

          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>

        </Box>
      </form>
    </Box>
  );
};

export default EditClient;
