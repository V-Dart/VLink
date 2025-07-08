const { google } = require('googleapis');
const User = require('../models/Users');
const Meeting = require('../models/Meeting');

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // Generate Google OAuth URL
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  // Set credentials for OAuth client
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Save user's Google Calendar tokens
  async saveUserTokens(userId, tokens) {
    try {
      await User.findByIdAndUpdate(userId, {
        googleCalendarTokens: tokens,
        googleCalendarConnected: true
      });
    } catch (error) {
      throw new Error('Failed to save Google Calendar tokens');
    }
  }

  // Get user's Google Calendar tokens
  async getUserTokens(userId) {
    try {
      const user = await User.findById(userId);
      
      // Check if user has specific calendar tokens
      if (user.googleCalendarTokens) {
        return user.googleCalendarTokens;
      }
      
      // If no specific calendar tokens, use regular Google OAuth tokens
      if (user.googleAccessToken) {
        return {
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken
        };
      }
      
      return null;
    } catch (error) {
      throw new Error('Failed to get user tokens');
    }
  }

  // Refresh access token if needed
  async refreshTokenIfNeeded(userId) {
    try {
      const tokens = await this.getUserTokens(userId);
      if (!tokens) throw new Error('No tokens found');

      this.setCredentials(tokens);
      
      // Try to make a simple API call to check if token is valid
      try {
        await this.calendar.calendarList.list();
      } catch (error) {
        // If error is related to authentication, try to refresh token
        if (error.code === 401 && tokens.refresh_token) {
          const { credentials } = await this.oauth2Client.refreshAccessToken();
          
          // Update tokens in database
          if (tokens === this.getUserTokens(userId)) {
            // This was a calendar-specific token, update it
            await this.saveUserTokens(userId, credentials);
          } else {
            // This was a regular Google OAuth token, update user record
            await User.findByIdAndUpdate(userId, {
              googleAccessToken: credentials.access_token,
              googleRefreshToken: credentials.refresh_token
            });
          }
          
          this.setCredentials(credentials);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh token');
    }
  }

  // Get user's calendar list
  async getUserCalendars(userId) {
    try {
      await this.refreshTokenIfNeeded(userId);
      
      const response = await this.calendar.calendarList.list();
      return response.data.items.map(calendar => ({
        id: calendar.id,
        name: calendar.summary,
        primary: calendar.primary || false,
        accessRole: calendar.accessRole
      }));
    } catch (error) {
      throw new Error('Failed to get user calendars');
    }
  }

  // Create event in Google Calendar
  async createCalendarEvent(userId, meetingData) {
    try {
      await this.refreshTokenIfNeeded(userId);

      const startDateTime = new Date(`${meetingData.date}T${meetingData.time}`);
      const endDateTime = new Date(startDateTime.getTime() + meetingData.duration * 60000);

      const event = {
        summary: meetingData.title,
        description: meetingData.description || '',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'UTC'
        },
        attendees: meetingData.participants ? meetingData.participants.map(p => ({
          email: typeof p === 'string' ? p : p.email
        })) : [],
        conferenceData: {
          createRequest: {
            requestId: `vlink-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: meetingData.reminder?.time || 15 },
            { method: 'popup', minutes: 5 }
          ]
        }
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });

      return {
        googleEventId: response.data.id,
        googleMeetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
        htmlLink: response.data.htmlLink
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  // Update event in Google Calendar
  async updateCalendarEvent(userId, googleEventId, meetingData) {
    try {
      await this.refreshTokenIfNeeded(userId);

      const startDateTime = new Date(`${meetingData.date}T${meetingData.time}`);
      const endDateTime = new Date(startDateTime.getTime() + meetingData.duration * 60000);

      const event = {
        summary: meetingData.title,
        description: meetingData.description || '',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'UTC'
        },
        attendees: meetingData.participants ? meetingData.participants.map(p => ({
          email: typeof p === 'string' ? p : p.email
        })) : []
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: googleEventId,
        resource: event
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  // Delete event from Google Calendar
  async deleteCalendarEvent(userId, googleEventId) {
    try {
      await this.refreshTokenIfNeeded(userId);

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: googleEventId
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  // Import events from Google Calendar
  async importCalendarEvents(userId, startDate, endDate) {
    try {
      await this.refreshTokenIfNeeded(userId);

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items.map(event => ({
        googleEventId: event.id,
        title: event.summary || 'No Title',
        description: event.description || '',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        attendees: event.attendees || [],
        creator: event.creator,
        hangoutLink: event.hangoutLink,
        htmlLink: event.htmlLink
      }));
    } catch (error) {
      console.error('Error importing calendar events:', error);
      throw new Error('Failed to import calendar events');
    }
  }

  // Sync VLink meeting with Google Calendar
  async syncMeetingWithGoogle(userId, meetingId) {
    try {
      const meeting = await Meeting.findById(meetingId).populate('organizer');
      
      if (meeting.organizer._id.toString() !== userId) {
        throw new Error('Only meeting organizer can sync with Google Calendar');
      }

      const googleEventData = await this.createCalendarEvent(userId, {
        title: meeting.title,
        description: meeting.description,
        date: meeting.date.toISOString().split('T')[0],
        time: meeting.time,
        duration: meeting.duration,
        participants: meeting.participants.map(p => p.email).filter(Boolean),
        reminder: meeting.reminder
      });

      // Update meeting with Google Calendar data
      await Meeting.findByIdAndUpdate(meetingId, {
        googleEventId: googleEventData.googleEventId,
        googleMeetLink: googleEventData.googleMeetLink,
        googleCalendarLink: googleEventData.htmlLink,
        syncedWithGoogle: true
      });

      return googleEventData;
    } catch (error) {
      console.error('Error syncing meeting with Google:', error);
      throw new Error('Failed to sync meeting with Google Calendar');
    }
  }

  // Get user's calendar events for a specific date range
  async getCalendarEvents(userId, startDate, endDate) {
    try {
      await this.refreshTokenIfNeeded(userId);

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items.map(event => ({
        id: event.id,
        title: event.summary || 'No Title',
        description: event.description || '',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        isAllDay: !event.start.dateTime,
        attendees: event.attendees || [],
        creator: event.creator,
        hangoutLink: event.hangoutLink,
        htmlLink: event.htmlLink,
        location: event.location || '',
        status: event.status
      }));
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw new Error('Failed to get calendar events');
    }
  }
}

module.exports = new GoogleCalendarService();
