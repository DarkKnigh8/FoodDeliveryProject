import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { placeOrder } from '../services/api';

export default function CreateOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialItem = state?.item
    ? [{ name: state.item.name, quantity: 1, price: state.item.price }]
    : [{ name: '', quantity: 1, price: 0 }];

  const [items, setItems] = useState(initialItem);
  const [restaurantId, setRestaurantId] = useState(state?.item?.restaurantId || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const order = { restaurantId, items, totalPrice };

    try {
      setLoading(true);
      const res = await placeOrder(order);
      setLoading(false);

      if (res._id) {
        alert('✅ Order placed successfully!');
        navigate('/orders');
      } else {
        alert('❌ Failed to place order: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Error placing order: ' + err.message);
    }
  };

  const updateItem = (index, key, value) => {
    const copy = [...items];
    copy[index][key] = key === 'quantity' || key === 'price' ? Number(value) : value;
    setItems(copy);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Restaurant ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
      />

      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className="border p-2 flex-1"
            placeholder="Item Name"
            value={item.name}
            onChange={(e) => updateItem(i, 'name', e.target.value)}
          />
          <input
            className="border p-2 w-16"
            type="number"
            value={item.quantity}
            onChange={(e) => updateItem(i, 'quantity', e.target.value)}
          />
          <input
            className="border p-2 w-24"
            type="number"
            value={item.price}
            onChange={(e) => updateItem(i, 'price', e.target.value)}
          />
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        onClick={() => setItems([...items, { name: '', quantity: 1, price: 0 }])}
      >
        + Add Item
      </button>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mt-2 ml-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
