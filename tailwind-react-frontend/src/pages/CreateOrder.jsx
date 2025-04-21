import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { placeOrder } from '../services/api';
import MenuCard from '../components/MenuCard';
import { mockMenu } from '../mock/mockMenu';



export default function CreateOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const menu = state?.menu || [];
  const restaurantId = state?.restaurantId;
//   const menu = mockMenu;

  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (item, qty) => {
    setQuantities((prev) => ({ ...prev, [item.name]: qty }));
  };

  const selectedItems = menu
    .filter((item) => quantities[item.name] > 0)
    .map((item) => ({
      name: item.name,
      price: item.price,
      quantity: quantities[item.name],
    }));

  const total = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleOrder = async () => {
    setLoading(true);
    const res = await placeOrder({ restaurantId, items: selectedItems, totalPrice: total });
    setLoading(false);
    if (res._id) {
      navigate('/orders');
    } else {
      alert('Failed to place order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Choose Your Items</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Featured</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {menu.slice(0, 8).map((item, idx) => (
            <MenuCard
              key={idx}
              item={item}
              quantity={quantities[item.name] || 0}
              onChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Menu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item, idx) => (
            <MenuCard
              key={idx}
              item={item}
              quantity={quantities[item.name] || 0}
              onChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-10 p-6 border rounded shadow bg-white max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <ul className="mb-3 text-sm">
            {selectedItems.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>LKR {item.quantity * item.price}</span>
              </li>
            ))}
          </ul>
          <p className="text-right font-bold">Total: LKR {total}</p>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? 'Placing order...' : 'Confirm and Place Order'}
          </button>
        </div>
      )}
    </div>
  );
}