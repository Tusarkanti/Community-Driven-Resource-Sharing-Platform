import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Optional: Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/profile', {
          withCredentials: true
        });
        if (data?.role === 'Seller') navigate('/seller-dashboard');
        else if (data?.role === 'Buyer') navigate('/buyer-dashboard');
      } catch (err) {
        // Not logged in
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Login request
      const response = await axios.post(
        'http://localhost:5000/api/login',
        formData,
        { withCredentials: true }
      );

      console.log('Login successful:', response.data);

      // ✅ Fetch role from session (server)
      const { data } = await axios.get('http://localhost:5000/api/profile', {
        withCredentials: true
      });

      if (data.role === 'Seller') {
        navigate('/seller-dashboard');
      } else if (data.role === 'Buyer') {
        navigate('/buyer-dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-3 text-sm">
        Don't have an account? <a href="/signup" className="text-blue-500 underline">Register</a>
      </p>
    </div>
  );
};

export default Login;
