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
    return <p>Loading payment details...</p>;
  }

  // If no payment data, show an error message
  if (!payment) {
    return <p>Error: No payment data found!</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>Order ID: {payment.orderId}</p>
      <p>Amount: LKR {payment.amount}</p>
      <p>Status: {payment.paymentStatus}</p>

      {/* Add "OK" button to go back to home */}
      <button
        onClick={() => navigate('/home')} // Redirect to Home page
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        OK, Go Back to Home
      </button>
    </div>
  );
}
