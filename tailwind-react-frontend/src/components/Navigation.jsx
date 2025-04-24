import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="mb-4 space-x-4">
      <Link to="/home" className="text-blue-600">Home</Link>
      <Link to="/createorder" className="text-blue-600">Create Order</Link>
      <Link to="/orders" className="text-blue-600">My Orders</Link>
    </nav>
  );
}
