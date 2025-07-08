const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/Users');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
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
      role: 'admin' // Use one of your enum values: 'productowner', 'admin', 'teamleader', 'salesrep'
    });

    await user.save();
    done(null, user);

  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, null);
  }
}));

// LinkedIn OAuth Strategy
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK_URL,
  scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('LinkedIn Profile:', profile);
    
    // Check if user already exists with this LinkedIn ID
    let user = await User.findOne({ linkedinId: profile.id });

    if (user) {
      return done(null, user);
    }

    // Get email from profile
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    
    // Check if user exists with same email
    if (email) {
      user = await User.findOne({ email: email });
      if (user) {
        // Link LinkedIn account to existing user
        user.linkedinId = profile.id;
        user.isLinkedInUser = true;
        user.profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : user.profilePicture;
        user.firstName = profile.name?.givenName || user.firstName;
        user.lastName = profile.name?.familyName || user.lastName;
        await user.save();
        return done(null, user);
      }
    }

    // Create new user
    user = new User({
      linkedinId: profile.id,
      username: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
      email: email,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      isLinkedInUser: true,
      role: 'admin'
    });

    await user.save();
    done(null, user);

  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
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