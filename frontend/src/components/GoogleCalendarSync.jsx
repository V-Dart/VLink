import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheck, FiX, FiRefreshCw, FiDownload, FiUpload, FiExternalLink } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import GoogleCalendarService from '../services/googleCalendarService';
import { format, startOfMonth, endOfMonth, addDays, subDays } from 'date-fns';

const GoogleCalendarSync = ({ isConnected, onEventsImported }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  const fetchGoogleCalendarEvents = async () => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      const events = await GoogleCalendarService.getCalendarEvents(startDate, endDate);
      setEvents(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setError('Failed to fetch Google Calendar events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportEvents = async () => {
    if (selectedEvents.length === 0) return;
    
    try {
      setIsImporting(true);
      setError(null);
      
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      const result = await GoogleCalendarService.importEvents(startDate, endDate, selectedEvents);
      
      if (onEventsImported) {
        onEventsImported(result.importedMeetings);
      }
      
      setSelectedEvents([]);
      setShowImportModal(false);
      
      // Show success message
      alert(`${result.importedMeetings.length} meetings imported successfully!`);
    } catch (error) {
      console.error('Error importing events:', error);
      setError('Failed to import events');
    } finally {
      setIsImporting(false);
    }
  };

  const handleEventSelect = (eventId) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(event => event.id));
    }
  };

  const formatEventTime = (event) => {
    if (event.isAllDay) {
      return 'All day';
    }
    
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  const formatEventDate = (event) => {
    const start = new Date(event.start);
    return format(start, 'MMM dd, yyyy');
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="text-center py-8">
          <FaGoogle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Connect Google Calendar</h3>
          <p className="text-sm text-gray-500">
            Connect your Google Calendar to sync events with VLink meetings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaGoogle className="w-5 h-5 text-blue-600" />
          Google Calendar Sync
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Import Events
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <FiX className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Import Google Calendar Events</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">From:</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">To:</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={fetchGoogleCalendarEvents}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="w-4 h-4" />
                      Fetch Events
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No events found in the selected date range</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectedEvents.length === events.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
                        Select All ({events.length} events)
                      </label>
                    </div>
                    
                    <span className="text-sm text-gray-500">
                      {selectedEvents.length} selected
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {events.map(event => (
                      <div
                        key={event.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedEvents.includes(event.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleEventSelect(event.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => handleEventSelect(event.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-800 truncate">{event.title}</h4>
                              {event.hangoutLink && (
                                <FiExternalLink className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{formatEventDate(event)}</span>
                              <span>{formatEventTime(event)}</span>
                            </div>
                            
                            {event.description && (
                              <p className="text-sm text-gray-500 mt-1 truncate">{event.description}</p>
                            )}
                            
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-gray-500">
                                  {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleImportEvents}
                  disabled={selectedEvents.length === 0 || isImporting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-4 h-4" />
                      Import Selected
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarSync;
