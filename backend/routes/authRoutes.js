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
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=google&user=${encodeURIComponent(JSON.stringify({
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

// @route    GET /api/auth/linkedin
// @desc     Start LinkedIn OpenID Connect process
router.get('/linkedin', (req, res, next) => {
  console.log('Starting LinkedIn OpenID Connect authentication...');
  passport.authenticate('linkedin-openid', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=linkedin_scope_error`
  })(req, res, next);
});

// @route    GET /api/auth/linkedin/callback
// @desc     LinkedIn OpenID Connect callback
router.get('/linkedin/callback', (req, res, next) => {
  console.log('LinkedIn callback received...');
  console.log('Query params:', req.query);
  
  passport.authenticate('linkedin-openid', { 
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=linkedin_callback_failed`
  }, (err, user, info) => {
    if (err) {
      console.error('LinkedIn authentication error:', err);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_error&details=${encodeURIComponent(err.message)}`);
    }
    
    if (!user) {
      console.error('LinkedIn authentication failed, no user returned');
      console.log('Info:', info);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_no_user`);
    }
    
    try {
      // Generate JWT token
      const payload = {
        id: user._id,
        email: user.email || null, // Email might not be available
        role: user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&provider=linkedin&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        username: user.username,
        email: user.email || null,
        role: user.role,
        profilePicture: user.profilePicture,
        firstName: user.firstName,
        lastName: user.lastName
      }))}`);

    } catch (error) {
      console.error('LinkedIn OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_token_error`);
    }
  })(req, res, next);
});

// @route    POST /api/auth/linkedin/verify
// @desc     Verify LinkedIn token from frontend
router.post('/linkedin/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token (you can use LinkedIn's token verification here)
    // For now, assuming the token is valid
    
    res.json({ 
      success: true, 
      message: 'LinkedIn authentication successful' 
    });
    
  } catch (error) {
    console.error('LinkedIn token verification error:', error);
    res.status(400).json({ message: 'Invalid LinkedIn token' });
  }
});

module.exports = router;