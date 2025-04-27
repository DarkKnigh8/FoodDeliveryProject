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
  const [orderConfirmed, setOrderConfirmed] = useState(false); // Track order confirmation status

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
      setConfirmedOrderId(res._id); // Store real orderId here
      setOrderConfirmed(true); // Set order as confirmed
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
    navigate('/checkout', { state: { orderId: confirmedOrderId } }); // Pass the confirmed orderId
  };

  if (!restaurantId || menu.length === 0) {
    return <p className="text-center mt-10 text-red-600">Menu not loaded.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-24 space-y-8">
      {/* 🍕 Your Cart Title */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Cart</h2>

      {/* 🏪 Restaurant Info Card */}
      <div className="bg-gradient-to-r from-gray-800 to-black p-6 rounded-lg shadow-md text-white mb-10">
        <h2 className="text-4xl font-semibold">{restaurantName}</h2>
        <p className="mt-2">📍 {restaurantLocation}</p>
        <p className="text-sm mt-1">🕓 Estimated Time: 25-35 mins</p>
      </div>

      {/* 🍕 Menu Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cart Items</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
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
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Selected Items</h3>
          <ul className="text-sm space-y-2 mb-6">
            {selectedItems.map((item, idx) => (
              <li key={idx} className="flex justify-between text-gray-700">
                <span>{item.name} × {item.quantity}</span>
                <span>LKR {item.quantity * item.price}</span>
              </li>
            ))}
          </ul>

          <div className="text-right text-lg font-bold text-blue-700 mb-6">
            <p>Total: LKR {total}</p>
          </div>

          {/* 🚀 Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Show Confirm Order Button only */}
            {!orderConfirmed ? (
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold focus:outline-none"
              >
                {loading ? 'Confirming...' : 'Confirm Order'}
              </button>
            ) : (
              <button
                onClick={handleGoToCheckout}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold focus:outline-none"
              >
                Go to Checkout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
