// Google Calendar API service
const API_BASE_URL = 'http://localhost:5000/api';

class GoogleCalendarService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Get authorization headers
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Update token
  updateToken(newToken) {
    this.token = newToken;
    localStorage.setItem('token', newToken);
  }

  // Get Google Calendar authorization URL
  async getAuthUrl() {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/auth-url`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }
      
      const data = await response.json();
      return data.authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleCallback(code) {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/callback`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect Google Calendar');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }

  // Check connection status
  async getConnectionStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/status`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to check connection status');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking connection status:', error);
      throw error;
    }
  }

  // Disconnect Google Calendar
  async disconnect() {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/disconnect`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect Google Calendar');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      throw error;
    }
  }

  // Get user's calendars
  async getCalendars() {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/calendars`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to get calendars');
      }
      
      const data = await response.json();
      return data.calendars;
    } catch (error) {
      console.error('Error getting calendars:', error);
      throw error;
    }
  }

  // Sync VLink meeting with Google Calendar
  async syncMeeting(meetingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/sync-meeting/${meetingId}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync meeting');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error syncing meeting:', error);
      throw error;
    }
  }

  // Get Google Calendar events
  async getCalendarEvents(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      const response = await fetch(`${API_BASE_URL}/google-calendar/events?${params}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to get calendar events');
      }
      
      const data = await response.json();
      return data.events;
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  // Import selected Google Calendar events
  async importEvents(startDate, endDate, selectedEventIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/import-events`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          selectedEvents: selectedEventIds
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to import events');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error importing events:', error);
      throw error;
    }
  }

  // Create event in both Google Calendar and VLink
  async createEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/create-event`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update event in both Google Calendar and VLink
  async updateEvent(meetingId, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/update-event/${meetingId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event from both Google Calendar and VLink
  async deleteEvent(meetingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/google-calendar/delete-event/${meetingId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Authenticate with Google Calendar (redirect approach)
  async authenticateWithRedirect() {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in first.');
      }
      
      console.log('Starting Google Calendar authentication with token...');
      
      // Redirect to backend auth endpoint with token
      window.location.href = `${API_BASE_URL}/google-calendar/auth?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error('Error starting authentication:', error);
      throw error;
    }
  }

  // Handle URL parameters on page load (for OAuth callback)
  handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const calendarConnected = urlParams.get('calendar_connected');
    const error = urlParams.get('error');
    const details = urlParams.get('details');
    
    if (calendarConnected === 'true') {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return { type: 'success' };
    }
    
    if (error) {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      const errorMessage = details ? `${error}: ${decodeURIComponent(details)}` : error;
      return { type: 'error', error: errorMessage };
    }
    
    return null;
  }
}

export default new GoogleCalendarService();
