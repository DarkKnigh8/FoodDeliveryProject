import React, { useEffect, useState } from 'react';
import { fetchAllRestaurants, verifyRestaurant } from '../services/api';

const AdminResRegistration = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // Adjust if stored differently
  

  const loadRestaurants = async () => {
    try {
      const data = await fetchAllRestaurants(token);
      setRestaurants(data);
    } catch (err) {
      console.error('Error loading restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyRestaurant(id, token);
      loadRestaurants(); // Refresh list after verifying
    } catch (err) {
      alert('Verification failed');
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">All Restaurants</h1>
      {restaurants.length === 0 && <p>No restaurants found.</p>}
      <ul className="space-y-4">
        {restaurants.map((rest) => (
          <li key={rest._id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold">{rest.name}</p>
              <p className="text-sm text-gray-600">{rest.location}</p>
              <p className={`text-sm ${rest.isVerified ? 'text-green-600' : 'text-red-500'}`}>
                {rest.isVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
            {!rest.isVerified && (
              <button
                onClick={() => handleVerify(rest._id)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Verify
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminResRegistration;
