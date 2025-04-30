// PaymentSuccess.jsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  const confirmedDeliveryId = searchParams.get('session_id'); // Get the deliveryId from URL

  useEffect(() => {
    if (confirmedDeliveryId) {
      fetch("http://localhost:5004/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: confirmedDeliveryId }) 
      })
      .then(res => res.json()) 
      .then(data => {
        setPayment(data); 
        setLoading(false); 
      })
      .catch(error => {
        console.error("Error confirming payment:", error);
        setLoading(false);
      });
    }
  }, [confirmedDeliveryId]);

  // While loading payment details, show loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold text-gray-700">Loading payment details...</div>
      </div>
    );
  }

  // If no payment data, show an error message
  if (!payment) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-lg font-semibold text-red-600">Error: No payment data found!</div>
      </div>
    );
  }

  const handleTrackOrder = () => {
    navigate(`/track/${confirmedDeliveryId}`); // Navigate to the Track Order page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 py-10 px-4 flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>

        <div className="bg-green-100 p-4 rounded-md mb-6">
          <p className="text-lg text-gray-700">Order ID: <strong>{payment.orderId}</strong></p>
          <p className="text-lg text-gray-700">Amount: <strong>LKR {payment.amount}</strong></p>
          <p className="text-lg text-gray-700">Status: <strong>{payment.paymentStatus}</strong></p>
        </div>

        {/* Add "Track Your Order" button */}
        <button
          onClick={handleTrackOrder} 
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300"
        >
          🚚 Track Your Order
        </button>
      </div>
    </div>
  );
}