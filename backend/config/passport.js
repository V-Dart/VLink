const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
const User = require('../models/Users');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // Update tokens for calendar access
      user.googleAccessToken = accessToken;
      user.googleRefreshToken = refreshToken;
      user.googleCalendarConnected = true;
      await user.save();
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.isGoogleUser = true;
      user.profilePicture = profile.photos[0].value;
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.googleAccessToken = accessToken;
      user.googleRefreshToken = refreshToken;
      user.googleCalendarConnected = true;
      await user.save();
      return done(null, user);
    }

    // Create new user with your schema's role enum
    user = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profilePicture: profile.photos[0].value,
      isGoogleUser: true,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      googleCalendarConnected: true,
      role: 'admin' // Use one of your enum values: 'productowner', 'admin', 'teamleader', 'salesrep'
    });

    await user.save();
    done(null, user);

  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, null);
  }
}));

// LinkedIn OAuth2 Strategy (Custom implementation)
passport.use('linkedin-openid', new OAuth2Strategy({
  authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK_URL,
  scope: ['openid', 'profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('LinkedIn OAuth2 callback triggered');
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');
    
    // Fetch user profile using LinkedIn's userinfo endpoint
    const axios = require('axios');
    
    let userInfoResponse;
    try {
      userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('LinkedIn userinfo response:', JSON.stringify(userInfoResponse.data, null, 2));
    } catch (apiError) {
      console.error('LinkedIn API error:', apiError.response?.data || apiError.message);
      return done(new Error('Failed to fetch LinkedIn profile'), null);
    }
    
    const linkedinProfile = userInfoResponse.data;
    const linkedinId = linkedinProfile.sub;
    
    if (!linkedinId) {
      console.error('No LinkedIn ID (sub) found in profile');
      return done(new Error('No LinkedIn ID found'), null);
    }
    
    // Check if user already exists with this LinkedIn ID
    let user = await User.findOne({ linkedinId: linkedinId });

    if (user) {
      console.log('Existing LinkedIn user found:', user.email);
      return done(null, user);
    }

    // Get email from profile
    const email = linkedinProfile.email || null;
    console.log('Email found:', email);
    
    // Check if user exists with same email (only if email is available)
    if (email) {
      user = await User.findOne({ email: email });
      if (user) {
        console.log('Linking LinkedIn to existing user:', user.email);
        // Link LinkedIn account to existing user
        user.linkedinId = linkedinId;
        user.isLinkedInUser = true;
        user.profilePicture = linkedinProfile.picture || user.profilePicture;
        user.firstName = linkedinProfile.given_name || user.firstName;
        user.lastName = linkedinProfile.family_name || user.lastName;
        await user.save();
        return done(null, user);
      }
    }

    // Create new user
    const username = linkedinProfile.name || 
                    `${linkedinProfile.given_name || ''} ${linkedinProfile.family_name || ''}`.trim() ||
                    `linkedin_user_${linkedinId}`;

    user = new User({
      linkedinId: linkedinId,
      username: username,
      email: email,
      firstName: linkedinProfile.given_name || '',
      lastName: linkedinProfile.family_name || '',
      profilePicture: linkedinProfile.picture || null,
      isLinkedInUser: true,
      role: 'admin'
    });

    await user.save();
    console.log('New LinkedIn user created:', user.email || 'No email');
    done(null, user);

  } catch (error) {
    console.error('LinkedIn OAuth2 error:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;