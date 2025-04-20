export default function OrderItem({ order, onStatusChange }) {
    return (
      <div className="border rounded p-4 mb-4 shadow">
        <h2 className="text-lg font-bold">Order ID: {order._id}</h2>
        <p className="text-sm text-gray-600">Status: {order.status}</p>
        <ul className="mt-2">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name} x {item.quantity} - Rs.{item.price}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-semibold">Total: Rs.{order.totalPrice}</p>
  
        {onStatusChange && (
          <select
            className="mt-2 p-2 border rounded"
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
          >
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Preparing</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        )}
      </div>
    );
  }
  