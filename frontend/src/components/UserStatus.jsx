import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import OAuthIndicator from './OAuthIndicator';

const UserStatus = ({ className = "" }) => {
  const { user, isOAuthUser, oauthProvider } = useAuth();
  
  if (!user) return null;

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white truncate">
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.username || user.email
          }
        </span>
        {isOAuthUser && (
          <OAuthIndicator />
        )}
      </div>
      {user.email && (
        <span className="text-xs text-gray-400 truncate">
          {user.email}
        </span>
      )}
    </div>
  );
};

export default UserStatus;
