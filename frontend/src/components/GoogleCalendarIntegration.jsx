import React, { useState } from 'react';
import { FiCalendar, FiExternalLink, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import GoogleCalendarService from '../services/googleCalendarService';

const GoogleCalendarIntegration = ({ meeting, isConnected, onMeetingUpdated }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleSyncToGoogle = async () => {
    if (!isConnected) return;
    
    try {
      setIsSyncing(true);
      setError(null);
      
      const result = await GoogleCalendarService.syncMeeting(meeting._id);
      
      if (onMeetingUpdated) {
        onMeetingUpdated({
          ...meeting,
          syncedWithGoogle: true,
          googleEventId: result.googleEventData.googleEventId,
          googleMeetLink: result.googleEventData.googleMeetLink,
          googleCalendarLink: result.googleEventData.htmlLink
        });
      }
      
      // Show success message
      alert('Meeting synced with Google Calendar successfully!');
    } catch (error) {
      console.error('Error syncing meeting:', error);
      setError('Failed to sync with Google Calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaGoogle className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Google Calendar</span>
        </div>
        
        {meeting.syncedWithGoogle ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-green-600">
              <FiCheck className="w-4 h-4" />
              <span className="text-xs font-medium">Synced</span>
            </div>
            
            {meeting.googleCalendarLink && (
              <a
                href={meeting.googleCalendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="View in Google Calendar"
              >
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ) : (
          <button
            onClick={handleSyncToGoogle}
            disabled={isSyncing}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium flex items-center gap-1"
          >
            {isSyncing ? (
              <>
                <FiRefreshCw className="w-3 h-3 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <FiCalendar className="w-3 h-3" />
                Sync to Google
              </>
            )}
          </button>
        )}
      </div>
      
      {meeting.googleMeetLink && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <a
            href={meeting.googleMeetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors text-sm flex items-center gap-1"
          >
            <FiExternalLink className="w-3 h-3" />
            Join Google Meet
          </a>
        </div>
      )}
      
      {error && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1 text-red-600">
            <FiX className="w-3 h-3" />
            <span className="text-xs">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarIntegration;
