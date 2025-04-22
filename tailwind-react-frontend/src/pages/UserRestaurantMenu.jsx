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

<<<<<<< HEAD
  if (!restaurant) {
    return <p className="text-center mt-16 text-gray-500 text-lg">Loading menu...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/home"
          className="text-blue-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Restaurants
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
          <p className="text-sm text-gray-500">📍 {restaurant.location || 'N/A'}</p>
        </div>
=======
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
>>>>>>> 7145824730e72086b6a28ed9fe27a9e0dee121ef

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu</h2>

<<<<<<< HEAD
        {restaurant.menu && restaurant.menu.length > 0 ? (
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

=======
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

>>>>>>> 7145824730e72086b6a28ed9fe27a9e0dee121ef
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
<<<<<<< HEAD
                    className="rounded-md border h-40 w-full object-cover mb-3"
=======
                    className="mt-2 h-40 w-full object-cover rounded border"
>>>>>>> 7145824730e72086b6a28ed9fe27a9e0dee121ef
                  />
                )}

                <p
<<<<<<< HEAD
                  className={`text-sm font-medium mb-3 ${
                    item.available ? 'text-green-600' : 'text-red-500'
=======
                  className={`mt-1 font-semibold ${
                    item.available
                      ? 'text-green-600'
                      : 'text-red-600'
>>>>>>> 7145824730e72086b6a28ed9fe27a9e0dee121ef
                  }`}
                >
                  {item.available ? 'Available ✅' : 'Unavailable ❌'}
                </p>
<<<<<<< HEAD

                <button
                  onClick={() =>
                    navigate('/createorder', {
                      state: { item: { ...item, restaurantId: id } },
                    })
                  }
                  disabled={!item.available}
                  className={`w-full py-2 rounded-lg text-white text-sm font-medium transition ${
                    item.available
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Order
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No menu available.</p>
        )}
      </div>
=======
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
>>>>>>> 7145824730e72086b6a28ed9fe27a9e0dee121ef
    </div>
  );
}
