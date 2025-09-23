// backend/admin_service/src/controllers/adminController.js

const axios = require('axios');

// ✅ Use environment variables instead of hardcoded localhost
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001/api/auth';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:5000/api/restaurants';

/**
 * Verify a restaurant (admin action).
 * Calls the restaurant service to mark a restaurant as verified.
 */
const verifyRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const token = req.headers.authorization;

    const response = await axios.put(
      `${RESTAURANT_SERVICE_URL}/verify/${restaurantId}`,
      {},
      {
        headers: { Authorization: token }
      }
    );

    res.json(response.data);
  } catch (err) {
    // ✅ Log full details to server logs
    console.error('Verify Restaurant Error:', err.response?.data || err);

    // ✅ Send only a safe generic message to client
    res.status(500).json({ message: 'Failed to verify restaurant' });
  }
};

/**
 * Get all users from auth_service (admin action).
 */
const getAllUsers = async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/users`);
    res.json(response.data);
  } catch (err) {
    console.error('Get All Users Error:', err.response?.data || err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Delete a user from auth_service (admin action).
 */
const deleteUser = async (req, res) => {
  try {
    const response = await axios.delete(`${AUTH_SERVICE_URL}/users/${req.params.userId}`);
    res.json(response.data);
  } catch (err) {
    console.error('Delete User Error:', err.response?.data || err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

/**
 * Get all restaurants (admin action).
 */
const getAllRestaurants = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const response = await axios.get(`${RESTAURANT_SERVICE_URL}/admin/all`, {
      headers: { Authorization: token }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Get All Restaurants Error:', err.response?.data || err);
    res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
};

module.exports = {
  getAllUsers,
  verifyRestaurant,
  deleteUser,
  getAllRestaurants
};






// Great — this is your backend/admin_service/src/controllers/adminController.js (or similar).
// Right now, every catch block still does:

// res.status(500).json({ message: err.message });


// 👉 That’s Server-Side Error Disclosure — leaking internal error details like Axios stack traces or upstream service errors to the client.

// ❌ Example of Leakage

// If axios fails with an upstream error like:

// ECONNREFUSED http://localhost:5001/api/auth


// your client would see:

// { "message": "connect ECONNREFUSED 127.0.0.1:5001" }


// That’s very useful to an attacker.


// Key Fixes in this Version

// Environment variables for URLs → no hardcoded http://localhost, makes HTTPS easy to enforce.

// Safe error responses → clients only see "Failed to <action>", not raw stack traces.

// Server logging preserved → devs can still debug with console.error(err.response?.data || err).

// OWASP A09:2021 compliance → no security-sensitive error disclosure to attackers.

// ✅ You can now apply this pattern across all your other controllers (orders, payments, restaurants, etc.):

// Log error details internally (console.error).

// Return generic safe error messages to clients.