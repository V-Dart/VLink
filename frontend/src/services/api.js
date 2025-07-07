import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Google OAuth login
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Verify Google token
  verifyGoogleToken: async (token) => {
    try {
      const response = await api.post('/auth/google/verify', { token });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user (with Google OAuth support)
  logout: async () => {
    try {
      // Call backend logout endpoint
      const response = await api.post('/users/logout');
      
      // Get user data to check if it's a Google user
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // If user logged in with Google, revoke Google access
      if (user && user.isGoogleUser) {
        // Revoke Google OAuth tokens
        try {
          // Option 1: Redirect to Google logout (signs out from Google entirely)
          // window.location.href = 'https://accounts.google.com/logout';
          
          // Option 2: Just revoke our app's access (recommended)
          await fetch('https://accounts.google.com/o/oauth2/revoke?token=' + user.googleAccessToken, {
            method: 'POST'
          });
        } catch (googleError) {
          console.warn('Google logout failed:', googleError);
          // Continue with local logout even if Google logout fails
        }
      }
      
      return response;
    } catch (error) {
      // Always clear local storage even if backend call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.error('Logout error:', error);
      return Promise.resolve();
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;