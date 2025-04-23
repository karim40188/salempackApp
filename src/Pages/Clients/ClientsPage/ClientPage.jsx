import React, { useState } from 'react';

const companiesData = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  name: 'Espresso Lab',
  logo: 'https://i.imgur.com/VXj0hfN.png' // Replace with actual logo or dynamic URLs
}));

const ClientsPage = () => {
  const [search, setSearch] = useState('');

  const filteredCompanies = companiesData.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', background: '#f8f8f8', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Companies</h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '800px',
        margin: '20px auto'
      }}>
        <button style={{
          backgroundColor: '#2a9700',
          color: '#fff',
          padding: '8px 15px',
          borderRadius: '10px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          New Client
        </button>

        <div style={{ display: 'flex' }}>
          <input
            type="text"
            placeholder="Search By Company Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '10px 0 0 10px',
              border: '1px solid #ccc',
              width: '250px'
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
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '20px',
        maxWidth: '800px',
        margin: 'auto'
      }}>
        {filteredCompanies.map(company => (
          <div
            key={company.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <img
              src={company.logo}
              alt={company.name}
              style={{ width: '100%', height: '100px', objectFit: 'contain', marginBottom: '10px' }}
            />
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{company.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
