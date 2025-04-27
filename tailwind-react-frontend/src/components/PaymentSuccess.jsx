import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const sessionId = searchParams.get('session_id'); // Extract session_id from URL
    if (sessionId) {
      // Call backend to confirm the payment using session_id
      fetch("http://localhost:5004/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }) // Send session_id to backend
      })
      .then(res => res.json()) // Handle the response from backend
      .then(data => {
        setPayment(data); // Save payment data
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error("Error confirming payment:", error);
        setLoading(false); // Stop loading on error
      });
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 py-10 px-4 flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>

        <div className="bg-green-100 p-4 rounded-md mb-6">
          <p className="text-lg text-gray-700">Order ID: <strong>{payment.orderId}</strong></p>
          <p className="text-lg text-gray-700">Amount: <strong>LKR {payment.amount}</strong></p>
          <p className="text-lg text-gray-700">Status: <strong>{payment.paymentStatus}</strong></p>
        </div>

        {/* Add "OK" button to go back to home */}
        <button
          onClick={() => navigate('/home')} // Redirect to Home page
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300"
        >
          OK, Go Back to Home
        </button>
      </div>
    </div>
  );
}
