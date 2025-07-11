// OAuth Service for handling Google and LinkedIn authentication
import { authAPI } from './api';

export const oauthService = {
  // Start Google OAuth flow
  startGoogleAuth: () => {
    try {
      authAPI.googleLogin();
    } catch (error) {
      console.error('Failed to start Google OAuth:', error);
      throw new Error('Failed to start Google authentication');
    }
  },

  // Start LinkedIn OAuth flow
  startLinkedInAuth: () => {
    try {
      authAPI.linkedinLogin();
    } catch (error) {
      console.error('Failed to start LinkedIn OAuth:', error);
      throw new Error('Failed to start LinkedIn authentication');
    }
  },

  // Process OAuth callback data
  processOAuthCallback: (token, userData, provider = 'google') => {
    try {
      // Parse user data if it's a string
      const user = typeof userData === 'string' 
        ? JSON.parse(decodeURIComponent(userData)) 
        : userData;

      // Enhanced user data with OAuth provider info
      const enhancedUser = {
        ...user,
        authProvider: provider,
        isOAuthUser: true,
        isGoogleUser: provider === 'google',
        isLinkedInUser: provider === 'linkedin',
        loginTimestamp: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(enhancedUser));

      return enhancedUser;
    } catch (error) {
      console.error('Failed to process OAuth callback:', error);
      throw new Error('Failed to process authentication data');
    }
  },

  // Logout with OAuth provider cleanup
  performLogout: async () => {
    try {
      // Get current user data
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      // Call backend logout
      await authAPI.logout();

      // Additional cleanup for OAuth users
      if (user?.isOAuthUser) {
        console.log(`Logging out ${user.authProvider} user`);
        
        // For Google users, you might want to revoke tokens
        if (user.isGoogleUser && user.googleAccessToken) {
          try {
            await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${user.googleAccessToken}`, {
              method: 'POST'
            });
          } catch (revokeError) {
            console.warn('Failed to revoke Google token:', revokeError);
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check if user is authenticated via OAuth
  isOAuthUser: () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return false;
      
      const user = JSON.parse(userData);
      return user.isOAuthUser || false;
    } catch (error) {
      console.error('Error checking OAuth status:', error);
      return false;
    }
  },

  // Get current user's OAuth provider
  getOAuthProvider: () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return user.authProvider || null;
    } catch (error) {
      console.error('Error getting OAuth provider:', error);
      return null;
    }
  },

  // Check if user needs to reauthenticate
  needsReauth: () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) return true;
      
      const user = JSON.parse(userData);
      const loginTime = new Date(user.loginTimestamp || 0);
      const now = new Date();
      const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
      
      // Require reauth after 24 hours for OAuth users
      return user.isOAuthUser && hoursSinceLogin > 24;
    } catch (error) {
      console.error('Error checking reauth status:', error);
      return true;
    }
  }
};

export default oauthService;
