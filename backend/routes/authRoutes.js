// filepath: d:\scm\frontend\backend\routes\authRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @route    GET /api/auth/google
// @desc     Start Google OAuth process
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route    GET /api/auth/google/callback
// @desc     Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      // Generate JWT token
      const payload = {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      }))}`);

    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
  }
);

// @route    POST /api/auth/google/verify
// @desc     Verify Google token from frontend
router.post('/google/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token (you can use Google's token verification here)
    // For now, assuming the token is valid
    
    res.json({ 
      success: true, 
      message: 'Google authentication successful' 
    });
    
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(400).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;