// import express from 'express';
// import { register, login, getAllDrivers } from '../controllers/authController.js';
// import User from '../models/User.js';
// import { authenticate, requireRole, allowRoles } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // ✅ Register new user (customer / restaurant / delivery / admin)
// router.post('/register', register);

// // ✅ Login for any user
// router.post('/login', login);

// // ✅ Get all users (admin only)
// router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Delete a user (admin only)
// router.delete('/users/:id', authenticate, requireRole('admin'), async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Get all delivery drivers (accessible by admin and customer for delivery assignment)
// router.get('/drivers', authenticate, allowRoles(['admin', 'customer']), getAllDrivers);

// export default router;

// src/routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  getAllDrivers,
  oauthLogin,
  oauthCallback,
} from '../controllers/authController.js';
import User from '../models/User.js';
import { authenticate, requireRole, allowRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Register new user (customer / restaurant / delivery / admin)
router.post('/register', register);

// ✅ Password login
router.post('/login', login);

// ✅ OAuth login (Google, GitHub, etc.)
router.get('/oauth/login/:provider', oauthLogin);       // e.g., /auth/oauth/login/google
router.get('/oauth/callback/:provider', oauthCallback); // e.g., /auth/oauth/callback/google

// ✅ Get all users (admin only)
router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete a user (admin only)
router.delete('/users/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all delivery drivers (admin & customer)
router.get('/drivers', authenticate, allowRoles(['admin', 'customer']), getAllDrivers);

export default router;
