import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { oauthService } from '../services/oauthService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return false;
    
    // Check if OAuth user needs reauthentication
    if (oauthService.isOAuthUser() && oauthService.needsReauth()) {
      // Clear expired session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    
    return true;
  };

  if (!isAuthenticated()) {
    // Store the attempted location for redirect after login
    sessionStorage.setItem('preAuthUrl', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
