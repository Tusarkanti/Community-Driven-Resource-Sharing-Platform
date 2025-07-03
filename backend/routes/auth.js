// ✅ backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, 'secret123');
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
   // login route
    const token = jwt.sign(
  { id: user._id, role: user.role }, // ✅ Include role
  'secret123',
  { expiresIn: '1h' }
);

     
    // ✅ Store user info in session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role // make sure 'role' exists in your User model
    };

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


module.exports = router;