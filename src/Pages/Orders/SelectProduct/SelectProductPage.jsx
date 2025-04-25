import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from "../../../context/AuthContext";

const SelectProductPage = () => {
  const { baseUrl, token } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [baseUrl, token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/dashboard/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const enriched = (res.data || []).map((p) => ({
        id: p.id,
        name: p.productName,
        specs: p.productDescription,
        image: `${baseUrl}/public/uploads/${p.productPhoto}`,
        quantity: 1,
        price: p.productPrice,
        categoryId: p.productCategory,
        photo: p.productPhoto
      }));
      setProducts(enriched);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("Failed to load products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/dashboard/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || { categoriesName: 'Unknown', color: '#cccccc' };
  };

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuantityChange = (id, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Number(value) } : p))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${baseUrl}/dashboard/products?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product deleted successfully.");
      fetchProducts(); // Refresh list
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`, { state: product });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const totalAmount = products
    .filter((p) => selected[p.id])
    .reduce((acc, p) => acc + p.quantity * p.price, 0);

  const handleCreateOrder = async () => {
    const clientId = localStorage.getItem("selectedClientId");
    if (!clientId) return alert("Client not selected!");

    const items = products
      .filter((p) => selected[p.id])
      .map((p) => ({
        product: p.name,
        Price: p.price,
        Quantity: p.quantity,
        TotalLine: Number((p.quantity * p.price).toFixed(2))
      }));

    if (items.length === 0) {
      return alert("Please select at least one product!");
    }

    const orderData = {
      clientId: Number(clientId),
      total: Number(totalAmount.toFixed(2)),
      status: "Pending",
      items
    };

    try {
      await axios.post(`${baseUrl}/dashboard/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      alert("Order created successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order.");
    }
  };

  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Create Orders</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', gap: '10px', flexWrap: 'wrap' }}>


        <button
          onClick={() => navigate("/add-product")}
          style={{
            backgroundColor: '#2a9700',
            color: '#fff',
            padding: '10px 30px',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}

        >
          Add Product
        </button>
        <div style={{ display: 'flex', gap:'10px'}}>
        <div style={{ display: 'flex' }}>
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

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            minWidth: '150px'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.categoriesName}
            </option>
          ))}
        </select>
        </div>
      
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px'
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const category = getCategoryById(product.categoryId);
            return (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  width: '220px',
                  textAlign: 'center',
                  background: selected[product.id] ? '#e0f4e0' : '#fff',
                  position: 'relative',
                  padding: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: category.color || '#ccc',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}
                >
                  {category.categoriesName}
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ height: '100px', objectFit: 'contain', marginBottom: '10px', marginTop: '10px' }}
                />
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{product.name}</div>
                <div style={{ fontSize: '12px', color: '#777', margin: '5px 0' }}>{product.specs}</div>
                <div style={{ fontSize: '13px', color: '#555', fontWeight: 'bold' }}>
                  ${product.price.toFixed(2)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                  <label style={{ marginRight: '5px', fontSize: '12px' }}>Qty:</label>
                  <input
                    type="number"
                    value={product.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    style={{
                      padding: '5px',
                      width: '60px',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-around' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      fontSize: '12px',
                      color: '#fff',
                      background: '#3498db',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      fontSize: '12px',
                      color: '#fff',
                      background: '#e74c3c',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
            No products found matching your search criteria.
          </div>
        )}
      </div>
      <div>
        <div style={{ textAlign: 'right', marginTop: '30px' }}>
          <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#444', fontSize: '18px' }}>
            Selected Products: {products.filter(p => selected[p.id]).length}
          </div>
          <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#444', fontSize: '18px' }}>
            Total Order Price: ${totalAmount.toFixed(2)}
          </div>
          <button
            style={{
              backgroundColor: '#2a9700',
              color: '#fff',
              padding: '10px 30px',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={handleCreateOrder}
            disabled={products.filter(p => selected[p.id]).length === 0}
          >
            Create Order
          </button>
        </div>
      </div>

    </div>
  );
};

export default SelectProductPage;