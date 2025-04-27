import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuManager from '../components/MenuManager';
import { restaurantAPI } from '../services/api';

export default function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', _id: null });
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // for redirecting to manage orders page

  const fetchRestaurants = () => {
    restaurantAPI
      .get('/restaurants/my')
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('location', form.location);
    if (image) formData.append('image', image);

    const method = form._id ? 'PUT' : 'POST';
    const url = form._id ? `/restaurants/${form._id}` : `/restaurants`;

    await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    fetchRestaurants();
    resetForm();
  };

  const handleEdit = (restaurant) => {
    setForm({ name: restaurant.name, location: restaurant.location || '', _id: restaurant._id });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this restaurant?')) {
      restaurantAPI.delete(`/restaurants/${id}`).then(() => fetchRestaurants());
    }
  };

  const toggleRestaurantAvailability = (id, newStatus) => {
    restaurantAPI.put(`/restaurants/${id}`, { isAvailable: newStatus }).then(fetchRestaurants);
  };

  const resetForm = () => {
    setForm({ name: '', location: '', _id: null });
    setImage(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Restaurant Owner Dashboard</h1>

      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
      >
        + Add Restaurant
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">{form._id ? 'Update' : 'Add'} Restaurant</h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  {form._id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6 bg-white p-4 rounded shadow-lg">
        {[...restaurants].reverse().map((r) => (
          <div key={r._id} className="p-4 border rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-600">📍 {r.location || 'Unknown'}</p>
                <p className="mt-1">
                  Status:{' '}
                  <span className={r.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {r.isAvailable ? 'Open ' : 'Closed '}
                  </span>
                </p>
                <p className="mt-1">
                  Verification:{' '}
                  <span className={r.isVerified ? 'text-green-600' : 'text-red-600'}>
                    {r.isVerified ? 'Verified ' : 'Unverified '}
                  </span>
                </p>

                {r.image && (
                  <img
                    src={r.image}
                    alt={r.name}
                    className="mt-2 max-h-32 object-contain border rounded"
                  />
                )}
              </div>
              <div className="space-y-2 text-right">
                <button
                  onClick={() => toggleRestaurantAvailability(r._id, !r.isAvailable)}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Set {r.isAvailable ? 'Closed' : 'Open'}
                </button>
                <div className="flex flex-wrap gap-2 mt-4">
                
                <button onClick={() => handleEdit(r)} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/restaurants/${r._id}/orders`)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Manage Orders
                </button>
              </div>
              </div>
            </div>

            <MenuManager restaurantId={r._id} />
          </div>
        ))}
      </div>
    </div>
  );
}
