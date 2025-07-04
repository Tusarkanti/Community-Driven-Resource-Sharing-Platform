import React, { useState } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: ''
  });

  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/products', formData, {
        withCredentials: true,
      });
      setMessage('✅ Product added successfully!');
      setProducts(prev => [...prev, res.data]);
      setFormData({ name: '', description: '', category: '', image: '' });
    } catch (err) {
      console.error('❌ Error adding product:', err);
      setMessage('❌ Failed to add product.');
    }
  };

  return (
    <div className="seller-dashboard" style={{ padding: '20px' }}>
      <h2>Welcome to Seller Dashboard</h2>
      <h3>Add New Product</h3>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          name="image"
          placeholder="Image URL (optional)"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit" style={{ marginTop: '10px' }}>Add Product</button>
      </form>

      <hr style={{ margin: '30px 0' }} />
      <h3>Your Products</h3>
      {products.length > 0 ? (
        <ul>
          {products.map((prod, idx) => (
            <li key={idx}>
              <strong>{prod.name}</strong> – {prod.category}
              <br />
              <em>{prod.description}</em>
              {prod.image && (
                <div>
                  <img src={prod.image} alt={prod.name} width="100" />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products added yet.</p>
      )}
    </div>
  );
};

export default SellerDashboard;
