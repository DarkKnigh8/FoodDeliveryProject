import React, { useState } from 'react';
import { searchRestaurants } from '../services/api';

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    const data = await searchRestaurants(query, token);
    setResults(data);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search restaurants or menu items..."
        className="border p-2 mr-2 rounded"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>

      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Restaurants Matching Name:</h2>
          {results.restaurantsByName.length > 0 ? (
            results.restaurantsByName.map((res) => (
              <div key={res._id} className="border p-2 mt-2 rounded">
                <h3 className="font-semibold">{res.name}</h3>
                <p>{res.location}</p>
              </div>
            ))
          ) : (
            <p>No restaurants found by name.</p>
          )}

          <h2 className="text-xl font-bold mt-4">Restaurants with Matching Menu Items:</h2>
          {results.restaurantsByMenuItem.length > 0 ? (
            results.restaurantsByMenuItem.map((res) => (
              <div key={res._id} className="border p-2 mt-2 rounded">
                <h3 className="font-semibold">{res.name}</h3>
                <p>{res.location}</p>
                <p className="italic">
                  Menu Match: {res.menu.find((item) => item.name.toLowerCase().includes(query.toLowerCase()))?.name}
                </p>
              </div>
            ))
          ) : (
            <p>No restaurants found by menu items.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
