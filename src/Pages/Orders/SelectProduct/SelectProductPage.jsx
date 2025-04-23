import React, { useState } from 'react';

const productsData = [
  {
    id: 1,
    name: '10oz Paper Cup (single Wall)',
    specs: 'Ø90 mm, White',
    image: 'https://i.imgur.com/6Xx1K2s.png', // Replace with real product image
    quantity: 1,
  },
  {
    id: 2,
    name: '10oz Paper Cup (single Wall)',
    specs: 'Ø90 mm, White',
    image: 'https://i.imgur.com/6Xx1K2s.png',
    quantity: 200,
  },
  {
    id: 3,
    name: '10oz Paper Cup (single Wall)',
    specs: 'Ø90 mm, White',
    image: 'https://i.imgur.com/6Xx1K2s.png',
    quantity: 200,
  },
  {
    id: 4,
    name: '10oz Paper Cup (single Wall)',
    specs: 'Ø90 mm, White',
    image: 'https://i.imgur.com/6Xx1K2s.png',
    quantity: 300,
  },
];

const SelectProductPage = () => {
  const [products, setProducts] = useState(productsData);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({});

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuantityChange = (id, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Number(value) } : p))
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Create Orders</h2>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search By Product Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '10px 0 0 10px',
            border: '1px solid #ccc',
          }}
        />
        <button style={{
          background: '#66c7ea',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '0 10px 10px 0',
          cursor: 'pointer'
        }}>
          🔍
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px'
      }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              width: '140px',
              textAlign: 'center',
              background: selected[product.id] ? '#e0f4e0' : '#fff',
              position: 'relative',
              padding: '10px'
            }}
          >
            <input
              type="checkbox"
              checked={!!selected[product.id]}
              onChange={() => toggleSelect(product.id)}
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                width: '20px',
                height: '20px',
              }}
            />
            <img
              src={product.image}
              alt={product.name}
              style={{ height: '80px', objectFit: 'contain', marginBottom: '10px' }}
            />
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{product.name}</div>
            <div style={{ fontSize: '11px', color: '#777' }}>{product.specs}</div>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              style={{
                marginTop: '8px',
                padding: '5px',
                width: '60px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button style={{
          backgroundColor: '#2a9700',
          color: '#fff',
          padding: '10px 30px',
          border: 'none',
          borderRadius: '20px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Create
        </button>
      </div>
    </div>
  );
};

export default SelectProductPage;
