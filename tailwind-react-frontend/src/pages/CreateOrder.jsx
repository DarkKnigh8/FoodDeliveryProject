import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { placeOrder } from '../services/api';
import MenuCard from '../components/MenuCard';

export default function CreateOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const menu = state?.selectedItems || [];
  const restaurantId = state?.restaurantId;
  const restaurantName = state?.restaurantName;
  const restaurantLocation = state?.location;

  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);

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

  const handleConfirmOrder = async () => {
    setLoading(true);
    const res = await placeOrder({ restaurantId, items: selectedItems, totalPrice: total });
    setLoading(false);

    if (res._id) {
      setConfirmedOrderId(res._id); // ✅ Store real orderId here
      alert('✅ Order confirmed! You can now proceed to checkout.');
    } else {
      alert('❌ Failed to confirm order: ' + (res.error || 'Unknown error'));
    }
  };

  const handleGoToCheckout = () => {
    if (!confirmedOrderId) {
      alert('⚠️ Please confirm your order first.');
      return;
    }
    navigate('/checkout', { state: { orderId: confirmedOrderId } }); // ✅ Pass the confirmed orderId
  };

  if (!restaurantId || menu.length === 0) {
    return <p className="text-center mt-10 text-red-600">Menu not loaded.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 🏪 Restaurant Info Card */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-2xl font-bold">{restaurantName}</h2>
        <p className="text-gray-500 mb-1">📍 {restaurantLocation}</p>
        <p className="text-sm text-green-600">🕓 Estimated Time: 25-35 mins</p>
      </div>

      {/* 🍕 Menu Section */}
      <h2 className="text-xl font-semibold mb-3">Cart Items</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {menu.map((item, idx) => (
          <MenuCard
            key={idx}
            item={item}
            quantity={quantities[item.name] || 0}
            onChange={handleQuantityChange}
          />
        ))}
      </div>

      {/* 🛒 Live Selection List */}
      {selectedItems.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Selected Items</h2>
          <ul className="text-sm border p-4 rounded shadow bg-white mb-4 space-y-2">
            {selectedItems.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>LKR {item.quantity * item.price}</span>
              </li>
            ))}
          </ul>

          <div className="text-right text-lg font-bold text-blue-700 mb-4">
            Total: LKR {total}
          </div>

          {/* 🚀 Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 rounded text-base"
            >
              {loading ? 'Confirming...' : 'Confirm Order'}
            </button>

            <button
              onClick={handleGoToCheckout}
              disabled={!confirmedOrderId}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-base"
            >
              Go to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
