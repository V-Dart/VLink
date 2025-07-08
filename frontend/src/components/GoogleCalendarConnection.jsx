import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheck, FiX, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import GoogleCalendarService from '../services/googleCalendarService';

const GoogleCalendarConnection = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnectionStatus();
    
    // Handle OAuth callback parameters
    const urlResult = GoogleCalendarService.handleUrlParams();
    if (urlResult) {
      if (urlResult.type === 'success') {
        // Connection was successful, just refresh status
        setIsConnected(true);
        setError(null);
        if (onConnectionChange) {
          onConnectionChange(true);
        }
      } else if (urlResult.type === 'error') {
        console.error('OAuth callback error:', urlResult.error);
        setError(`Authentication failed: ${urlResult.error}`);
        setIsConnecting(false);
      }
    }
  }, []);

  const handleOAuthCallback = async (code) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      await GoogleCalendarService.handleCallback(code);
      
      setIsConnected(true);
      if (onConnectionChange) {
        onConnectionChange(true);
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      setError(error.message || 'Failed to connect to Google Calendar');
    } finally {
      setIsConnecting(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const status = await GoogleCalendarService.getConnectionStatus();
      setIsConnected(status.connected);
      
      // Clear error if connection is successful
      if (status.connected) {
        setError(null);
      }
      
      if (onConnectionChange) {
        onConnectionChange(status.connected);
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setError('Failed to check connection status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null); // Clear any previous errors
      
      // Use redirect approach instead of popup
      await GoogleCalendarService.authenticateWithRedirect();
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setError(error.message || 'Failed to connect to Google Calendar');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await GoogleCalendarService.disconnect();
      
      setIsConnected(false);
      if (onConnectionChange) {
        onConnectionChange(false);
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      setError('Failed to disconnect Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
            <FiCalendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-xl p-4 mb-6 ${
      isConnected 
        ? 'bg-green-50 border-green-200' 
        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isConnected 
            ? 'bg-green-100' 
            : 'bg-blue-100'
        }`}>
          {isConnected ? (
            <FiCheck className="w-5 h-5 text-green-600" />
          ) : (
            <FaGoogle className="w-5 h-5 text-blue-600" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className={`text-sm font-semibold mb-1 ${
            isConnected ? 'text-green-800' : 'text-blue-800'
          }`}>
            {isConnected ? 'Google Calendar Connected' : 'Connect Google Calendar'}
          </h4>
          
          <p className={`text-xs mb-3 ${
            isConnected ? 'text-green-600' : 'text-blue-600'
          }`}>
            {isConnected 
              ? 'Your meetings will sync automatically with Google Calendar'
              : 'Sync with Google Calendar for automatic meeting creation and management'
            }
          </p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700">
                  <FiX className="w-4 h-4" />
                  <span className="text-xs">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Dismiss error"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                >
                  {isLoading ? (
                    <>
                      <FiRefreshCw className="w-3 h-3 animate-spin inline mr-1" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </button>
                <button
                  onClick={checkConnectionStatus}
                  disabled={isLoading}
                  className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                >
                  <FiRefreshCw className={`w-3 h-3 inline mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FaGoogle className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarConnection;
