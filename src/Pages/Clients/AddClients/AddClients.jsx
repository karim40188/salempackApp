import React, { useState } from 'react';

const AddClientPage = () => {
  const products = [
    {
      id: 1,
      name: '10oz Paper Cup (Single Wall)',
      size: 'Ø 90 mm, White',
      image: 'https://i.imgur.com/mugFIvQ.png',
    },
    {
      id: 2,
      name: '12oz Paper Cup (Single Wall)',
      size: 'Ø 90 mm, White',
      image: 'https://i.imgur.com/mugFIvQ.png',
    },
    {
      id: 3,
      name: '16oz Paper Cup (Single Wall)',
      size: 'Ø 90 mm, White',
      image: 'https://i.imgur.com/mugFIvQ.png',
    },
  ];

  const [formData, setFormData] = useState({
    companyName: '',
    employeeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    logo: '',
    selectedProducts: [],
  });

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

  return (
    <div style={{ padding: '40px', background: '#f8f8f8', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Add Client</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '30px', flexWrap: 'wrap' }}>
        {/* Company Data */}
        <div style={{ flex: '1' }}>
          <input type="text" placeholder="Company Name" style={inputStyle} />
          <input type="text" placeholder="Employee Name" style={inputStyle} />
          <div style={{ ...inputStyle, textAlign: 'center', lineHeight: '40px', cursor: 'pointer' }}>
            Company Logo
          </div>
        </div>

        {/* Product Dropdown */}
        <div style={{ flex: '1' }}>
          <select onChange={handleProductSelect} style={{ ...inputStyle, fontWeight: 'bold' }}>
            <option value="">Select Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Credentials */}
        <div style={{ flex: '1' }}>
          <input type="email" placeholder="Email" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          <input type="password" placeholder="Confirm Password" style={inputStyle} />
        </div>
      </div>

      {/* Product Cart Section */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
        {formData.selectedProducts.map((product) => (
          <div key={product.id} style={productCardStyle}>
            <img src={product.image} alt={product.name} style={{ height: '80px', objectFit: 'contain' }} />
            <div style={{ fontSize: '12px', marginTop: '5px', textAlign: 'center' }}>
              {product.name}<br />{product.size}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'right', marginTop: '30px' }}>
        <button style={saveButtonStyle}>Save</button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const productCardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '10px',
  width: '120px',
  textAlign: 'center',
  backgroundColor: '#fff',
};

const saveButtonStyle = {
  backgroundColor: '#2a9700',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 30px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default AddClientPage;
