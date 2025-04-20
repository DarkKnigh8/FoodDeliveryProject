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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {restaurants.map(r => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurants/${r._id}`)}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{r.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                📍 {r.location || 'No location'}
              </p>
              <p className={`mt-1 font-semibold ${r.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {r.isAvailable ? 'Open ✅' : 'Closed ❌'}
              </p>

              {/* ✅ Show image if available */}
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  className="mt-3 h-40 w-full object-cover rounded border"
                />
              )}

              {/* Optional: Inline menu preview */}
              {r.menu && r.menu.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Menu (Preview)</h3>
                  <ul className="space-y-2">
                    {r.menu.slice(0, 2).map((item, index) => (
                      <li
                        key={index}
                        className="bg-gray-50 p-3 rounded-md border border-gray-100"
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-base">{item.name}</strong>
                          <span className="text-sm text-gray-700">Rs. {item.price}</span>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className={`text-xs mt-1 ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                          {item.available ? 'Available ✅' : 'Unavailable ❌'}
                        </p>
                      </li>
                    ))}
                    {r.menu.length > 2 && (
                      <li className="text-sm italic text-blue-500 mt-1">
                        ...more items
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
