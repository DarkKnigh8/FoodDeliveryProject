import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    restaurantAPI.get('/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        🍽️ Explore Restaurants
      </h1>

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Loading restaurants...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map(r => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurants/${r._id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  className="h-48 w-full object-cover rounded-t-2xl"
                />
              )}

              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {r.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {r.location || 'No location'}
                </p>
                <p className={`text-sm mt-2 font-medium ${r.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {r.isAvailable ? 'Open ✅' : 'Closed ❌'}
                </p>

                {r.menu && r.menu.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-semibold text-gray-700 mb-2">Menu Highlights</h3>
                    <ul className="space-y-2">
                      {r.menu.slice(0, 2).map((item, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="text-sm text-gray-700">Rs. {item.price}</span>
                          </div>
                          <p className="text-xs text-gray-500">{item.description}</p>
                          <p className={`text-xs mt-1 ${item.available ? 'text-green-500' : 'text-red-400'}`}>
                            {item.available ? 'Available ✅' : 'Unavailable ❌'}
                          </p>
                        </li>
                      ))}
                      {r.menu.length > 2 && (
                        <li className="text-sm italic text-blue-500 mt-1">...and more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
