import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const sessionId = searchParams.get('session_id'); // Extract session_id from URL
    if (sessionId) {
      // Call backend to confirm the payment using session_id
      fetch("http://localhost:5004/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      })
      .then(res => res.json()) // Handle the response from backend
      .then(data => {
        setPayment(data); // Save the payment data
        setLoading(false); // Stop loading once the data is fetched
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
      <p>Amount: ${payment.amount}</p>
      <p>Status: {payment.paymentStatus}</p>
    </div>
  );
}
