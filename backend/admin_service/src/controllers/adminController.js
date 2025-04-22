const axios = require('axios');

const AUTH_SERVICE_URL = 'http://localhost:5001/api/auth'; // adjust to your auth_service port
const RESTAURANT_SERVICE_URL = 'http://localhost:5000/api/restaurants'; // adjust to your restaurant_service port

// ✅ Verify a restaurant via REST call
const verifyRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const token = req.headers.authorization;

    const response = await axios.put(
      `${RESTAURANT_SERVICE_URL}/verify/${restaurantId}`,
      {}, // no body
      {
        headers: {
          Authorization: token // pass admin token to restaurant service
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Verify Restaurant Error:', err.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all users via auth_service
const getAllUsers = async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/users`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete user via auth_service
const deleteUser = async (req, res) => {
  try {
    const response = await axios.delete(`${AUTH_SERVICE_URL}/users/${req.params.userId}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//get all restaunts by admin
const getAllRestaurants = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const response = await axios.get(
      `${RESTAURANT_SERVICE_URL}/admin/all`,
      {
        headers: {
          Authorization: token // ✅ forward the token to restaurant_service
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Get All Restaurants Error:', err.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getAllUsers,
  verifyRestaurant,
  deleteUser,
  getAllRestaurants
};
