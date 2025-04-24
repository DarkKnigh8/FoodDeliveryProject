<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
=======
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, role, etc.
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

<<<<<<< HEAD
export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
=======
const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9
  }
  next();
};

// Export the functions
module.exports = { authenticate, requireRole };
