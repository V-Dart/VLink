import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { oauthService } from '../services/oauthService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');
    const provider = searchParams.get('provider') || 'google'; // Default to google

    if (error) {
      console.error('OAuth error:', error);
      setStatus('Authentication failed. Redirecting to login...');
      setTimeout(() => {
        navigate('/login?error=oauth_failed');
      }, 2000);
      return;
    }

    if (token && user) {
      try {
        // Use the OAuth service to process the callback
        const userData = oauthService.processOAuthCallback(token, user, provider);
        
        setStatus('Authentication successful! Redirecting...');
        console.log('OAuth successful:', userData);
        
        // Check if there was a pre-auth URL to redirect back to
        const preAuthUrl = sessionStorage.getItem('preAuthUrl');
        sessionStorage.removeItem('preAuthUrl'); // Clean up
        
        setTimeout(() => {
          // Redirect to the original page or dashboard
          navigate(preAuthUrl && preAuthUrl !== '/login' ? preAuthUrl : '/dashboard');
        }, 1000);
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        setStatus('Error processing authentication. Redirecting to login...');
        setTimeout(() => {
          navigate('/login?error=processing_failed');
        }, 2000);
      }
    } else {
      setStatus('Missing authentication data. Redirecting to login...');
      setTimeout(() => {
        navigate('/login?error=missing_data');
      }, 2000);
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-white text-center max-w-md px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg mb-2">{status}</p>
        <p className="text-sm text-gray-400">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
