import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Paper,
  Divider,
  Link,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';

// Custom theme for Salem Pack
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f7f7f7',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

const PrivacyPolicy = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h3" component="h1">
              Salem Pack - Privacy Policy
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary" mb={3}>
            Last Updated: May 13, 2025
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Typography variant="body1" paragraph>
            At Salem Pack ("we", "us", or "our company"), we are committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, share, and protect your personal information 
            when you use the Salem Pack mobile application (the "App").
          </Typography>
          
          <Typography variant="body1" paragraph>
            Please read this Privacy Policy carefully to understand our practices regarding your personal information.
            By using the App, you agree to the practices described in this policy.
          </Typography>
          
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h5">Information We Collect</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>Information You Provide to Us</Typography>
              <Typography variant="body1" paragraph>
                When using the Salem Pack application, we may collect the following information:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Account Information:</strong> Your name, email address, phone number, shipping address, and billing address.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Payment Information:</strong> Credit card details or other payment methods used to complete purchases.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Transaction Records:</strong> Products you've purchased, purchase date, amount paid, and order details.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>User Preferences:</strong> Product selections, wishlists, and shopping preferences.
                  </Typography>
                </li>
              </ul>
              
              <Typography variant="h6" gutterBottom>Information We Automatically Collect</Typography>
              <Typography variant="body1" paragraph>
                When you use the App, we may automatically collect:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Device Information:</strong> Device type, operating system, app version, and unique device identifiers.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Usage Data:</strong> How you use the app, pages and products viewed, time and date of access.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Location Information:</strong> Your geographic location (if you grant permission) to provide shipping and customized local services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to enhance your experience and collect data about your app usage.
                  </Typography>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h5">How We Use Your Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                We use your information for the following purposes:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>To Process Transactions:</strong> To complete purchases, deliver products, and process payments.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>To Provide Customer Support:</strong> To respond to your inquiries, resolve issues, and provide technical assistance.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>To Improve Our Services:</strong> To analyze usage patterns, identify trends, and enhance the app's functionality.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>To Personalize Your Experience:</strong> To recommend products, customize content, and provide tailored marketing.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>To Communicate With You:</strong> To send order confirmations, updates, promotional materials, and important notices.
                  </Typography>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography variant="h5">Information Sharing and Disclosure</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                We may share your information with:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Service Providers:</strong> Third parties that help us operate our business, such as payment processors, delivery services, and cloud storage providers.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Business Partners:</strong> Companies we collaborate with to offer products, services, or promotions.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of all or a portion of our assets.
                  </Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph>
                We do not sell your personal information to third parties.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography variant="h5">Data Security</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. 
                Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5a-content"
              id="panel5a-header"
            >
              <Typography variant="h5">Your Rights</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    The right to access and receive a copy of your personal information
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    The right to correct inaccurate information
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    The right to delete your personal information
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    The right to restrict or object to processing
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    The right to data portability
                  </Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph>
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6a-content"
              id="panel6a-header"
            >
              <Typography variant="h5">Changes to This Privacy Policy</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>Contact Us</Typography>
            <Typography variant="body1" paragraph>
              If you have any questions or concerns about our Privacy Policy or data practices, please contact us at:
            </Typography>
            <Typography variant="body1">
              Email: <Link href="mailto:privacy@salempack.com">privacy@salempack.com</Link>
            </Typography>
            <Typography variant="body1">
              Phone: +1-555-SALEM-PACK
            </Typography>
            <Typography variant="body1" mb={3}>
              Address: 123 Packaging Street, Suite 456, Salem City, SC 12345
            </Typography>
            
            <Button variant="contained" color="primary">
              Accept Privacy Policy
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default PrivacyPolicy;