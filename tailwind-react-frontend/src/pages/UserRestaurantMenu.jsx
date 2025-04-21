import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

export default function UserRestaurantMenu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    restaurantAPI
      .get('/restaurants')
      .then((res) => {
        const found = res.data.find((r) => r._id === id);
        setRestaurant(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleStartOrder = () => {
    navigate('/createorder', {
      state: { menu: restaurant.menu, restaurantId: restaurant._id },
    });
  };

  if (!restaurant) return <p className="text-center mt-8">Loading menu...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/home"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Restaurants
      </Link>

      <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
      <p className="text-sm text-gray-500 mb-4">
        📍 {restaurant.location || 'N/A'}
      </p>

      <h2 className="text-xl font-semibold mb-4">Menu</h2>

      {restaurant.menu && restaurant.menu.length > 0 ? (
        <>
          <ul className="space-y-4">
            {restaurant.menu.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-white border border-gray-200 rounded shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-lg">{item.name}</strong>
                  <span className="text-sm text-gray-800">
                    Rs. {item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mt-2 h-40 w-full object-cover rounded border"
                  />
                )}

                <p
                  className={`mt-1 font-semibold ${
                    item.available
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {item.available ? 'Available ✅' : 'Unavailable ❌'}
                </p>
              </li>
            ))}
          </ul>

          {/* 🛒 Global Start Order Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleStartOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded shadow"
            >
              Start Order
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No menu available.</p>
      )}
    </div>
  );
}
