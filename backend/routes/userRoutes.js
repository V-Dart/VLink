const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');


const router = express.Router();

// @route    POST /api/users/register
// @desc     Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body); // Debug log
    
    const { username, email, password, phone, role } = req.body;

    // Validation
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: role || 'admin'
    });

    // save user
    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route    POST /api/users/login
// @desc     Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    POST /api/users/logout
// @desc     Logout user (with Google OAuth support)
router.post('/logout', async (req, res) => {
  try {
    // Extract token to identify user
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user && user.isGoogleUser) {
          // For Google users, you could implement additional cleanup here
          console.log('Google user logged out:', user.email);
        }
      } catch (tokenError) {
        // Token might be expired or invalid, but still allow logout
        console.log('Logout with invalid/expired token');
      }
    }
    
    // In a production app, you might want to:
    // 1. Add token to blacklist
    // 2. Clear any server-side sessions
    // 3. Revoke refresh tokens
    
    res.status(200).json({
      message: 'Logout successful',
      success: true
    });

  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    GET /api/users/profile
// @desc     Get user profile (protected route)
router.get('/profile', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    console.error('Profile error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
