import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && user) {
      try {
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        
        console.log('Google OAuth successful');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        navigate('/login?error=processing_failed');
      }
    } else {
      navigate('/login?error=missing_data');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
