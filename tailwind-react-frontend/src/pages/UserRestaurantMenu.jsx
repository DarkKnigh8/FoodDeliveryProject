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
      state: {
        selectedItems: restaurant.menu.filter((item) => item.available),
        restaurantId: restaurant._id,
        restaurantName: restaurant.name
      },
    });
  };

  if (!restaurant) {
    return <p className="text-center mt-16 text-gray-500 text-lg">Loading menu...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <Link to="/home" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Restaurants
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
          <p className="text-sm text-gray-500">📍 {restaurant.location || 'N/A'}</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu</h2>

        {restaurant.menu && restaurant.menu.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {restaurant.menu.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-sm font-medium text-gray-600">Rs. {item.price}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">{item.description}</p>

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-md border h-40 w-full object-cover mb-3"
                    />
                  )}

                  <p
                    className={`text-sm font-medium mb-3 ${
                      item.available ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {item.available ? 'Available ✅' : 'Unavailable ❌'}
                  </p>

                  <button
                  // onClick={() =>
                  //   navigate('/createorder', {
                  //     state: { item: { ...item, restaurantId: id } },
                  //   })
                  // }
                  disabled
                  className="w-full py-2 rounded-lg text-white text-sm font-medium transition bg-gray-400 cursor-not-allowed"
                >
                  Order
                </button>

                </div>
              ))}
            </div>

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
    </div>
  );
}
