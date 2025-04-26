const axios = require('axios');
const PAYMENT_SERVICE_URL = 'http://localhost:5004/api/payments';

// View all transactions
const getAllTransactions = async (req, res) => {
  try {
    const response = await axios.get(`${PAYMENT_SERVICE_URL}/admin/transactions`);
    res.json(response.data); // ✅ Will include only transaction details (_id, amount, etc.)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions', error: err.message });
  }
};

// Filter transactions by date only (remove restaurantId and userId)
const getFilteredTransactions = async (req, res) => {
  const { startDate, endDate } = req.query; // ✅ Only use startDate, endDate

  try {
    const response = await axios.get(`${PAYMENT_SERVICE_URL}/admin/transactions/filter`, {
      params: { startDate, endDate } // ✅ Send only these params
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering transactions', error: err.message });
  }
};

module.exports = {
  getAllTransactions,
  getFilteredTransactions
};
