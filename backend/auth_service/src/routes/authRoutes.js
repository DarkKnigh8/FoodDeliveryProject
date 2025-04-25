import express from 'express';
import { register, login } from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Get all users (admin use)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user (admin use)
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
