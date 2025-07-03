import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch logged-in user details from backend
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name || user.email}!</h2>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-4"><strong>Role:</strong> {user.role}</p>

      {/* Optional: role-based dashboard sections */}
      {user.role === 'seller' ? (
        <div>
          <h3 className="text-xl font-semibold mt-6">Seller Dashboard</h3>
          <p>Here you can manage your products and view buyer requests.</p>
          {/* Add seller-specific components here */}
        </div>
      ) : user.role === 'buyer' ? (
        <div>
          <h3 className="text-xl font-semibold mt-6">Buyer Dashboard</h3>
          <p>Here you can browse products and message sellers.</p>
          {/* Add buyer-specific components here */}
        </div>
      ) : (
        <div>
          <p>You are logged in with no specific role. Please contact support.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
