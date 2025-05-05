// InvoiceDialog.jsx
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Box,
  Typography,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import logoImg from "../../assets/Header/WhiteLogoSalemPack.png"
const InvoiceDialog = ({ open, order, formatDate, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef();

  const downloadPDF = () => {
    if (!order) return;
    
    setDownloading(true);
    const invoiceElement = invoiceRef.current;
    const invoiceHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src=${logoImg} alt="Salempack Logo" style="width: 100px;backgroundColor:'black' " />
          <h2 style="margin: 10px 0;">Salempack</h2>
          <h3 style="margin: 0;">Invoice</h3>
        </div>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 15px 0;" />
        ${invoiceElement.innerHTML}
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 15px 0;" />
        <div style="text-align: center; font-size: 12px;">
          <p>Email: support@salempack.com</p>
          <p>Phone: +20 123 456 789</p>
        </div>
      </div>
    `;
    html2pdf()
      .from(invoiceHTML)
      .set({
        margin: 10,
        filename: `Invoice-${order.code || order.id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .finally(() => setDownloading(false));
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Salempack</Typography>
          <img src={logoImg} alt="Salempack Logo" style={{ width: "100px",backgroundColor:'black' }} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Paper
          ref={invoiceRef}
          sx={{ p: 3, border: "1px solid #e0e0e0", boxShadow: 1 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Salempack</Typography>
            <img
              src={logoImg}
              alt="Salempack Logo"
              style={{ width: "100px" ,backgroundColor:"black"}}
            />
          </Box>
          <Typography variant="h5" gutterBottom>
            Invoice
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <strong>Order ID:</strong> {order.id}
              </Typography>
              <Typography>
                <strong>Order Code:</strong> {order.code}
              </Typography>
              <Typography>
                <strong>Company:</strong>{" "}
                {order.client?.CompanyName || "—"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Status:</strong> {order.status}
              </Typography>
              <Typography>
                <strong>Total:</strong> {order.total} EGP
              </Typography>
              <Typography>
                <strong>Date:</strong> {formatDate(order.createdAt)}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Products
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((product, i) => (
                <TableRow key={i}>
                  <TableCell>{product.product}</TableCell>
                  <TableCell>{product.Quantity}</TableCell>
                  <TableCell>{product.Price} EGP</TableCell>
                  <TableCell>{product.Quantity * product.Price} EGP</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" align="center">
            Email: support@salempack.com | Phone: +20 123 456 789
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          disabled={downloading}
          startIcon={downloading && <CircularProgress size={20} />}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDialog;