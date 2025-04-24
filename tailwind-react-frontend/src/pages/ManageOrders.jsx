// src/pages/ManageOrders.jsx
import { useParams } from 'react-router-dom';
import RestaurantOrders from '../components/RestaurantOrders';

export default function ManageOrders() {
  const { restaurantId } = useParams();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <RestaurantOrders restaurantId={restaurantId} />
    </div>
  );
}
