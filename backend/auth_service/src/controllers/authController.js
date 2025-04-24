export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ['customer', 'restaurant', 'admin', 'delivery'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
