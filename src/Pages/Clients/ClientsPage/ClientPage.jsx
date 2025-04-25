import React, { useState, useEffect, useContext } from 'react';
import './ClientsPageStyle.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../../context/AuthContext';

const ClientsPage = () => {
  const { token ,baseUrl} = useContext(Context);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${baseUrl}/dashboard/clients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, [token]);

  const filteredCompanies = companies.filter(company =>
    company.CompanyName?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCompany = (company) => {
    setActive(company.id);
    localStorage.setItem('selectedClientId', company.id);
  };

  return (
    <div style={{ padding: '40px', background: '#f8f8f8', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Companies</h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '800px',
        margin: '20px auto'
      }}>
        <button
          style={{
            backgroundColor: '#2a9700',
            color: '#fff',
            padding: '8px 15px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => navigate("/add-clients")}
        >
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
        {filteredCompanies.map((company) => {
          const isSelected = active === company.id;
          const imageUrl = `${baseUrl}/public/uploads/${company.Logo}`;

          return (
            <div
              key={company.id}
              className={isSelected ? "active-company" : ""}
              style={{
                backgroundColor: isSelected ? '#d1f5d3' : '#fff',
                border: isSelected ? '2px solid #2a9700' : '1px solid #ddd',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => selectedCompany(company)}
            >
              <img
                src={imageUrl}
                alt={company.CompanyName}
                style={{ width: '100%', height: '100px', objectFit: 'contain', marginBottom: '10px' }}
              />
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{company.CompanyName}</div>
            </div>
          );
        })}
      </div>

      <button
        style={{
          backgroundColor: '#2a9700',
          color: '#fff',
          padding: '8px 15px',
          borderRadius: '10px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px',
          display: 'block',
          marginLeft: 'auto'
        }}
        onClick={() => {
          if (!active) {
            alert('Please select a company first');
            return;
          }
          navigate('/select-product');
        }}
      >
        Select Product
      </button>
    </div>
  );
};

export default ClientsPage;
