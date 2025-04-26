import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchRestaurants } from "../services/api"; // Import the search API function

const Header = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleCartClick = () => {
    navigate("/");
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      console.log("Search query is empty");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const results = await searchRestaurants(query, token);
      console.log("Search results:", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 to-black py-6 w-full fixed top-0 left-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 md:px-12">
          {/* Logo */}
          <div className="text-[#FFFFFF] font-bold text-xl">
            LOGO
          </div>

          {/* Navbar (Links) */}
          <nav className="hidden md:flex space-x-6 text-[#FFFFFF] text-lg">
            <Link to="/home" className="hover:text-gray-200">Home</Link>
            <a href="#" className="hover:text-gray-200">Services</a>
            <a href="#" className="hover:text-gray-200">Blog</a>
            <a href="#" className="hover:text-gray-200">Help Center</a>
            <a href="#" className="hover:text-gray-200">About</a>
          </nav>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="px-4 py-2 rounded-full w-72 bg-white text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 p-2 text-blue-600 hover:bg-blue-500 rounded-full"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Right Side - Icons and Dropdown */}
          <div className="flex items-center space-x-4">
            <button className="text-[#FFFFFF] hover:text-gray-200">
              <i className="fas fa-bell"></i>
            </button>
            <button
              className="text-[#FFFFFF] hover:text-gray-200"
              onClick={handleCartClick}
            >
              <i className="fas fa-cart-plus"></i>
            </button>

            <div className="relative">
              <button
                className="text-[#FFFFFF] hover:text-gray-200"
                onClick={toggleDropdown}
              >
                <i className="fas fa-user"></i>
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                  <div className="py-2">
                    <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      My Orders
                    </Link>
                    <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Sign Up
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={toggleDropdown} className="text-[#40fc41]">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Search Results Display */}
      {searchResults && (
        <div className="mt-24 px-6">
          <h2 className="text-xl font-bold mb-2 text-[#40fc41]">Restaurants Matching Name:</h2>
          {searchResults.restaurantsByName.length > 0 ? (
            searchResults.restaurantsByName.map((res) => (
              <div key={res._id} className="border p-2 mt-2 rounded">
                <h3 className="font-semibold text-[#40fc41]">{res.name}</h3>
                <p>{res.location}</p>
              </div>
            ))
          ) : (
            <p>No restaurants found by name.</p>
          )}

          <h2 className="text-xl font-bold mt-4 text-[#40fc41]">Restaurants with Matching Menu Items:</h2>
          {searchResults.restaurantsByMenuItem
            .filter(menuRes => !searchResults.restaurantsByName.some(nameRes => nameRes._id === menuRes._id))
            .map((res) => (
              <div key={res._id} className="border p-2 mt-2 rounded">
                <h3 className="font-semibold text-[#40fc41]">{res.name}</h3>
                <p>{res.location}</p>
                <p className="italic text-[#40fc41]">
                  Menu Match: {res.menu.find((item) => item.name.toLowerCase().includes(query.toLowerCase()))?.name}
                </p>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Header;
