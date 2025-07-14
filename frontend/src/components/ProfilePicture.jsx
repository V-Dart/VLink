import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfilePicture = ({ 
  src, 
  alt = "Profile Picture", 
  size = "medium", 
  className = "",
  fallbackIcon = FaUserCircle,
  showFallback = true 
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10", 
    large: "w-16 h-16",
    xlarge: "w-24 h-24"
  };

  const iconSizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl", 
    xlarge: "text-6xl"
  };

  const FallbackIcon = fallbackIcon;

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            if (showFallback) {
              e.target.style.display = 'none';
              const fallback = e.target.nextSibling;
              if (fallback) fallback.style.display = 'flex';
            }
          }}
        />
      ) : null}
      {(showFallback || !src) && (
        <FallbackIcon 
          className={`${iconSizeClasses[size]} text-white ${src ? 'hidden' : 'flex'} items-center justify-center`} 
        />
      )}
    </div>
  );
};

export default ProfilePicture;
