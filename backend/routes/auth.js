const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUser } = require('../middleware/validate');
const router = express.Router();

// Signup Route
router.post('/signup', validateUser, async (req, res) => {
  const { email, password, role } = req.body;
  console.log('Signup attempt:', { email, password, role }); // Log request data
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10); // Explicit salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    console.log('User created:', { email, role }); // Log success
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error); // Log error details
    res.status(500).json({ message: 'Server error during signup: ' + error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // Log request data
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Log if user doesn't exist
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email); // Log password failure
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token generated for:', email); // Log success
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error); // Log error details
    res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
});

module.exports = router;