import { useState } from 'react';
import { editOrder } from '../services/api';

export default function EditOrderModal({ order, onClose, onUpdated }) {
  const [items, setItems] = useState(order.items);

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = key === 'quantity' || key === 'price' ? Number(value) : value;
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const res = await editOrder(order._id, { items, totalPrice });
    if (res._id) {
      onUpdated();
      onClose();
    } else {
      alert('Failed to update order');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
        {items.map((item, idx) => (
          <div key={idx} className="mb-2 flex gap-2 items-center">
            <input
              className="border p-1 flex-1"
              value={item.name}
              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
            />
            <input
              className="border p-1 w-16"
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
            />
            <input
              className="border p-1 w-20"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
            />
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-1 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-1 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
