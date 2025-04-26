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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 py-12">
      {/* Recommended Restaurants */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
           Recommended Restaurants
        </h2>

        <div className="flex overflow-x-auto space-x-6 p-2">
          {restaurants.slice(0, 5).map((r) => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurants/${r._id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-200 cursor-pointer group w-64 min-w-[16rem]"
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  className="h-44 w-full object-cover rounded-t-xl"
                />
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {r.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  📍 {r.location || 'No location'}
                </p>
                <span className={`inline-block mt-2 text-xs font-medium ${r.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {r.isAvailable ? 'Open ' : 'Closed '}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Restaurants */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
         Explore Restaurants
      </h1>

      {/* Display All Restaurants */}
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Loading restaurants...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.map(r => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurants/${r._id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-200 cursor-pointer group"
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  className="h-52 w-full object-cover rounded-t-xl"
                />
              )}

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {r.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {r.location || 'No location'}
                </p>
                <span className={`inline-block mt-2 text-sm font-medium ${r.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {r.isAvailable ? 'Open ' : 'Closed '}
                </span>

                {r.menu && r.menu.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Menu Highlights</h4>
                    <ul className="space-y-3">
                      {r.menu.slice(0, 2).map((item, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="text-sm text-gray-700">Rs. {item.price}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          <span className={`text-xs font-medium ${item.available ? 'text-green-500' : 'text-red-400'}`}>
                            {item.available ? 'Available ' : 'Unavailable '}
                          </span>
                        </li>
                      ))}
                      {r.menu.length > 2 && (
                        <li className="text-xs italic text-blue-500 mt-2">...and more</li>
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
