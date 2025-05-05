import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  FormControlLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Context } from '../../context/AuthContext';

const ClientsSMSDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { baseUrl, token } = useContext(Context);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${baseUrl}/dashboard/sms`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load clients data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedClients(clients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleClientSelect = (clientId) => {
    setSelectedClients(prevSelected => {
      const isSelected = prevSelected.includes(clientId);
      const newSelected = isSelected
        ? prevSelected.filter(id => id !== clientId)
        : [...prevSelected, clientId];
      setSelectAll(newSelected.length === clients.length);
      return newSelected;
    });
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const normalizePhoneNumber = (number) => {
    if (!number) return null;

    // إزالة كل الرموز غير الأرقام
    let cleaned = number.replace(/\D/g, '');

    // لو الرقم بيبدأ بـ 20 (رمز مصر) نحوله لـ 0
    if (cleaned.startsWith('20') && cleaned.length === 12) {
      cleaned = '0' + cleaned.slice(2);
    }

    // نتحقق إنه فعلاً 11 رقم
    return /^\d{11}$/.test(cleaned) ? cleaned : null;
  };

  const sendSMS = async () => {
    if (selectedClients.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one client',
        severity: 'warning'
      });
      return;
    }

    if (!message.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a message',
        severity: 'warning'
      });
      return;
    }

    try {
      setLoading(true);

      // استخراج الأرقام وتنظيفها
      const phoneNumbers = clients
        .filter(client => selectedClients.includes(client.id))
        .map(client => normalizePhoneNumber(client.MobileNumber))
        .filter(number => number); // remove nulls

      if (phoneNumbers.length === 0) {
        setSnackbar({
          open: true,
          message: 'No valid phone numbers found (must be valid Egyptian 11-digit numbers)',
          severity: 'error'
        });
        return;
      }

      const response = await fetch(`${baseUrl}/dashboard/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: message,
          phoneNumbers: phoneNumbers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send message: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log(result);

      setSnackbar({
        open: true,
        message: `Message sent successfully to ${phoneNumbers.length} client(s)`,
        severity: 'success'
      });

      setMessage('');
      setSelectedClients([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error sending SMS:', error);
      setSnackbar({
        open: true,
        message: `Failed to send message: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getImageUrl = (logo) => {
    return `${baseUrl}/public/uploads/${logo}`;
  };

  const filteredClients = clients.filter(client =>
    (client.username && client.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.CompanyName && client.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.MobileNumber && client.MobileNumber.includes(searchTerm))
  );

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Clients SMS Management
        </Typography>

        {loading && clients.length === 0 ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Search by Name or Phone"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Clients List</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  }
                  label="Select All"
                />
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Select</TableCell>
                      <TableCell>Logo</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleClientSelect(client.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={client.Logo ? getImageUrl(client.Logo) : undefined}
                              alt={client.CompanyName}
                              sx={{ width: 40, height: 40 }}
                            >
                              {client.CompanyName?.charAt(0)}
                            </Avatar>
                          </TableCell>
                          <TableCell>{client.username}</TableCell>
                          <TableCell>{client.CompanyName}</TableCell>
                          <TableCell>{client.MobileNumber}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No clients match the search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Message Content
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Type your message here..."
                value={message}
                onChange={handleMessageChange}
                dir="ltr"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SendIcon />}
                onClick={sendSMS}
                disabled={loading || selectedClients.length === 0 || !message.trim()}
              >
                Send SMS
                {loading && (
                  <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />
                )}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientsSMSDashboard;
