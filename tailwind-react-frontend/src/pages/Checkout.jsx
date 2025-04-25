import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { confirmCheckout, fetchOrderDetails } from '../services/api';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId || '';
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderPrice, setOrderPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [confirmedDeliveryId, setConfirmedDeliveryId] = useState(null);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false); // Track delivery confirmation status
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the state for submitting

  // Fetch order price
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      const res = await fetchOrderDetails(orderId); // Fetch totalPrice
      if (res && res.totalPrice) {
        setOrderPrice(res.totalPrice);
      }
    };
    loadOrder();
  }, [orderId]);

  // Update delivery charge based on city
  useEffect(() => {
    if (city.toLowerCase() === 'kandy') {
      setDeliveryCharge(200);
    } else if (city.toLowerCase() === 'colombo') {
      setDeliveryCharge(500);
    } else {
      setDeliveryCharge(0); // default
    }
  }, [city]);

  const totalAmount = orderPrice + deliveryCharge;

  const handleSubmit = async () => {
    if (!orderId) {
      alert('Order ID missing. Please return and confirm your order.');
      return;
    }

    setIsSubmitting(true); // Start submitting

    const res = await confirmCheckout({ orderId, address, phone, paymentMethod });

    setIsSubmitting(false); // Stop submitting

    if (res._id) {
      setConfirmedDeliveryId(res._id); // Save delivery ID for tracking
      setDeliveryConfirmed(true); // Set delivery as confirmed
      alert('✅ Delivery confirmed!');
    } else {
      alert('❌ Failed: ' + (res.message || 'Unknown error'));
    }
  };

  /*const handleTrackOrder = () => {
    if (confirmedDeliveryId) {
      navigate(`/delivery-status/${confirmedDeliveryId}`);
    }
  };*/

  // Placeholder function for the "Pay Now" button (you can later link it to your payment service)
  const handlePayNow = () => {
    alert('Redirecting to payment service...'); // Replace this with the actual redirect to the payment service in the future
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-20">
      <h1 className="text-2xl font-bold mb-4">Checkout for Order #{orderId}</h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="City (Kandy/Colombo)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Contact Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Payment Method:</label>
        <select
          className="border p-2 w-full"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Card">Card</option>
        </select>
      </div>

      {/* 💰 Price Summary */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p>🛒 Order Price: <strong>LKR {orderPrice}</strong></p>
        <p>🚚 Delivery Charge: <strong>LKR {deliveryCharge}</strong></p>
        <p className="mt-2 text-lg font-bold text-blue-700">
          Total Amount: LKR {totalAmount}
        </p>
      </div>

      {/* 🔘 Action Buttons */}
      {!deliveryConfirmed ? (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting} // Disabled when submitting
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Delivery'}
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-green-600 font-semibold">
            Delivery confirmed!
          </p>
          {<button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Track Your Order
          </button> }
          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
