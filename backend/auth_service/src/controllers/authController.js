import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Register controller
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ['customer', 'restaurant', 'admin', 'delivery'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('[AUTH ERROR] Register:', err.message);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('[AUTH ERROR] Login:', err.message);
    res.status(401).json({ message: err.message });
  }
};

// ✅ Get all Delivery Drivers (For Delivery Service to fetch)
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'delivery' });

    if (!drivers.length) {
      return res.status(404).json({ message: 'No delivery drivers found' });
    }

    res.status(200).json(drivers);
  } catch (err) {
    console.error('[AUTH ERROR] Get Drivers:', err.message);
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
};
