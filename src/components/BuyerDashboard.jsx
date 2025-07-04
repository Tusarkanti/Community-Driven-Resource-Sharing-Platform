import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("📡 Fetching products...");
        const res = await axios.get('http://localhost:5000/api/products', {
          withCredentials: true
        });

        console.log("✅ Products:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err.response?.data || err.message);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-700">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Available Products</h2>

      {error ? (
        <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <div key={product._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-700 mb-1">{product.description}</p>
              <p className="text-sm text-gray-500 mb-1"><strong>Category:</strong> {product.category}</p>
              <p className="text-xs text-gray-400"><strong>Owner:</strong> {product.owner?.email || 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
