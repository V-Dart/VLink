import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCalendarCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (window.opener) {
      if (code) {
        // Send success message to parent window
        window.opener.postMessage({
          type: 'GOOGLE_CALENDAR_AUTH_SUCCESS',
          code: code
        }, window.location.origin);
      } else if (error) {
        // Send error message to parent window
        window.opener.postMessage({
          type: 'GOOGLE_CALENDAR_AUTH_ERROR',
          error: error
        }, window.location.origin);
      }
      
      // Close popup window
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing...</h2>
        <p className="text-gray-600">Connecting your Google Calendar</p>
      </div>
    </div>
  );
};

export default GoogleCalendarCallback;
