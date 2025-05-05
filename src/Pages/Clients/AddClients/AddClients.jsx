import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AddClientsStyle.css';
import { Context } from '../../../context/AuthContext';
import useImageUploader from '../../../hooks/useImageUploader'; // assuming this is your custom hook
import { useNavigate } from 'react-router-dom';

const AddClientPage = () => {
  const { baseUrl, token } = useContext(Context);
  const uploadImage = useImageUploader(baseUrl, token);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    employeeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',  // Added mobile number field
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
      } catch (err) {
        // console.error('Failed to load products:', err);
        console.log(err)
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

  const handleProductSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedProduct = products.find((p) => p.id === selectedId);
    if (
      selectedProduct &&
      !formData.selectedProducts.some((p) => p.id === selectedProduct.id)
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, selectedProduct],
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

    // Validate required fields
    if (!companyName || !employeeName || !email || !password || password !== confirmPassword || !logo || selectedProducts.length === 0) {
      alert('Please fill all fields and select at least one product.');
      return;
    }

    try {
      // Upload logo using the custom hook
      const logoPath = await uploadImage(logo);
      
      if (!logoPath) {
        alert('Failed to upload logo image. Please try again.');
        return;
      }
      
      // Extract just the filename from the path if needed
      // Sometimes the API returns a full path, but we might only need the filename
      const logoFilename = logoPath.split('/').pop();
      
      // Updated payload structure to match new API requirements
      const payload = {
        username: employeeName,
        CompanyName: companyName,
        MobileNumber: mobileNumber || '00000000000', // Use entered mobile number or default
        Logo: logoFilename, // Make sure this is just the filename string
        Email: email,
        Password: password,
        products: selectedProducts.map((product) => ({
          productid: product.id,  // Include productid as required by the updated API
          product: product.productName,
          Price: product.productPrice,
          MinimumQuantity: 1, // default if required by backend
        })),
      };

      const res = await axios.post(`${baseUrl}/dashboard/clients`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Client created successfully!');
      navigate("/clients")
      console.log(res.data);
    } catch (err) {
      // console.error('Failed to create client:', err);
      console.log(err)
      alert('Error creating client.');
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
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input-style"
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="input-style"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="selected-products">
        {formData.selectedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={`${baseUrl}/public/uploads/${product.productPhoto}`} alt={product.productName} style={{ height: '80px', objectFit: 'contain' }} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              {product.productName}<br />Price: ${product.productPrice}
            </div>
            <button onClick={() => handleRemoveProduct(product.id)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="save-button">Save</button>
    </div>
  );
};

export default AddClientPage;