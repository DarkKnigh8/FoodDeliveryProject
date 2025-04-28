// imports...
import { useEffect, useState } from 'react';
import { restaurantAPI } from '../services/api';

export default function MenuManager({ restaurantId }) {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', _id: null });
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await restaurantAPI.get(`/restaurants/${restaurantId}/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  useEffect(() => {
    if (restaurantId) fetchMenu();
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    if (image) formData.append('image', image);

    const method = form._id ? 'PUT' : 'POST';
    const url = form._id
      ? `/restaurants/${restaurantId}/menu/${form._id}`
      : `/restaurants/${restaurantId}/menu`;

    await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    });

    await fetchMenu();
    resetForm();
  };

  const handleEdit = (item) => {
    if (!item._id) return;
    setForm(item);
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (!itemId) return;
    if (confirm('Delete this item?')) {
      await restaurantAPI.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
      await fetchMenu();
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    const item = menu.find(m => m._id === itemId);
    if (!item) return;

    await restaurantAPI.put(`/restaurants/${restaurantId}/menu/${itemId}`, {
      ...item,
      available: !currentStatus,
    });
    fetchMenu();
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', _id: null });
    setImage(null);
    setShowModal(false);
  };

  return (
    <div className=" min-h-screen bg-gradient-to-r from-white-50 via-white to-blue-50 px-6 py-12">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Menu Manager</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          + Add Menu Item
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-[400px] shadow-lg">
            <button onClick={resetForm} className="float-right text-gray-500 hover:text-red-500">✕</button>
            <h2 className="text-lg font-semibold mb-4">
              {form._id ? 'Update Menu Item' : 'Add New Menu Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <input
                type="text"
                placeholder="Item name"
                className="w-full px-3 py-2 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full px-3 py-2 border rounded"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full px-3 py-2 border rounded"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded hover:"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded hover:"
                >
                  {form._id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {[...menu].filter(item => item._id).reverse().map((item) => (
          <li
            key={item._id}
            className="bg-gray-100 rounded p-4 shadow-sm"
          >
            <div className="text-lg font-medium">{item.name} - Rs. {item.price}</div>
            <p className="text-sm text-gray-600">{item.description}</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="mt-2 h-32 rounded border object-contain"
              />
            )}
            <p className={`mt-1 font-semibold ${item.available ? 'text-green-600' : 'text-red-600'}`}>
              {item.available ? 'Available ' : 'Unavailable '}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleAvailability(item._id, item.available)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded hover:"
              >
                Set {item.available ? 'Unavailable' : 'Available'}
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-600 hover:bg-blue-700  text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
