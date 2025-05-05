import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AddClientsStyle.css';
import { Context } from '../../../context/AuthContext';
import useImageUploader from '../../../hooks/useImageUploader';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

const AddClientPage = () => {
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    employeeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    logo: null,
    selectedProducts: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/dashboard/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        console.log(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleProductSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedProduct = products.find((p) => p.id === selectedId);
    if (
      selectedProduct &&
      !formData.selectedProducts.some((p) => p.id === selectedProduct.id)
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: [
          ...prev.selectedProducts,
          {
            ...selectedProduct,
            MinimumQuantity: 1,
          },
        ],
      }));
    }
  };

  const handleRemoveProduct = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((p) => p.id !== id),
    }));
  };

  const handleSave = async () => {
    const {
      companyName,
      employeeName,
      email,
      password,
      confirmPassword,
      mobileNumber,
      logo,
      selectedProducts,
    } = formData;

    if (!companyName || !employeeName || !email || !password || password !== confirmPassword || !logo || selectedProducts.length === 0) {

      setSnackbar({
        open: true,
        message: 'Please fill all fields and select at least one product.',
        severity: 'error'
      });
      return;
    }
    console.log(formData)

    if (mobileNumber.length !== 11 || !/^\d+$/.test(mobileNumber)) {
      setSnackbar({
        open: true,
        message: 'Mobile number must be exactly 11 digits.',
        severity: 'error'
      });
      return;
    }


    try {
      const logoPath = await uploadImage(logo);
      if (!logoPath) {

        setSnackbar({
          open: true,
          message: 'Failed to upload logo image. Please try again.',
          severity: 'error'
        });
        return;
      }

      const logoFilename = logoPath.split('/').pop();

      const payload = {
        username: employeeName,
        CompanyName: companyName,
        MobileNumber: mobileNumber || '00000000000',
        Logo: logoFilename,
        Email: email,
        Password: password,
        products: selectedProducts.map((product) => ({
          productid: product.id,
          product: product.productName,
          Price: product.productPrice,
          MinimumQuantity: product.MinimumQuantity,
        })),
      };

      const res = await axios.post(`${baseUrl}/dashboard/clients`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        message: 'Client created successfully!',
        severity: 'success'
      });
      navigate("/clients");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: 'Error creating client.',
        severity: 'error'
      });
    }
  };

  return (
    <div className="add-client-container">
      <h2 className="add-client-title">Add Client</h2>

      <div className="form-sections">
        <div style={{ flex: '1' }}>
          <input
            name="companyName"
            type="text"
            placeholder="Company Name"
            className="input-style"
            value={formData.companyName}
            onChange={handleInputChange}
          />
          <input
            name="employeeName"
            type="text"
            placeholder="Employee Name"
            className="input-style"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
          <input
            name="mobileNumber"
            type="text"
            placeholder="Mobile Number"
            className="input-style"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="input-style"
          />
        </div>

        <div style={{ flex: '1', marginLeft: '10px' }}>
          <select onChange={handleProductSelect} className="input-style" style={{ fontWeight: 'bold' }}>
            <option value="">Select Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.productName}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1' }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input-style"
            value={formData.email}
            onChange={handleInputChange}
          />
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-style"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="input-style"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password-btn"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

        </div>
      </div>

      <div className="selected-products">
        {formData.selectedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={`${baseUrl}/public/uploads/${product.productPhoto}`} alt={product.productName} style={{ height: '80px', objectFit: 'contain' }} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              {product.productName}<br />Price: ${product.productPrice}
            </div>
            <input
              type="number"
              min="1"
              value={product.MinimumQuantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  selectedProducts: prev.selectedProducts.map((p) =>
                    p.id === product.id ? { ...p, MinimumQuantity: newQuantity } : p
                  ),
                }));
              }}
              style={{ width: '60px', marginTop: '5px' }}
            />
            <button onClick={() => handleRemoveProduct(product.id)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="save-button">Save</button>

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
    </div>
  );
};

export default AddClientPage;
