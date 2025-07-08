const express = require('express');
const router = express.Router();
const GoogleCalendarService = require('../services/GoogleCalendarService');
const Meeting = require('../models/Meeting');
const User = require('../models/Users');
const { auth } = require('../middleware/auth');
const { body, validationResult, query } = require('express-validator');

// @route    GET /api/google-calendar/auth-url
// @desc     Get Google Calendar authorization URL
// @access   Private
router.get('/auth-url', auth, async (req, res) => {
  try {
    const authUrl = GoogleCalendarService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ message: 'Failed to generate authorization URL' });
  }
});

// @route    GET /api/google-calendar/auth
// @desc     Redirect to Google Calendar authorization  
// @access   Public (but we'll store user ID in state)
router.get('/auth', async (req, res) => {
  try {
    console.log('Starting Google Calendar authentication...');
    console.log('Query params:', req.query);
    
    const { token } = req.query;
    
    if (!token) {
      console.log('No token provided in query');
      return res.redirect(`${process.env.CLIENT_URL}/meet?error=no_token`);
    }
    
    // Verify the token
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      console.log('Verifying JWT token...');
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { id: decoded.id, email: decoded.email });
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.redirect(`${process.env.CLIENT_URL}/meet?error=invalid_token&details=${encodeURIComponent(jwtError.message)}`);
    }
    
    // Store the token in session or encode it in state parameter
    const authUrl = GoogleCalendarService.getAuthUrl();
    const urlWithState = `${authUrl}&state=${encodeURIComponent(token)}`;
    
    console.log('Redirecting to Google Calendar auth URL');
    res.redirect(urlWithState);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.redirect(`${process.env.CLIENT_URL}/meet?error=calendar_auth_failed&details=${encodeURIComponent(error.message)}`);
  }
});

// @route    GET /api/google-calendar/callback
// @desc     Handle Google Calendar OAuth callback
// @access   Public (but validates state)
router.get('/callback', async (req, res) => {
  try {
    console.log('Google Calendar callback received');
    console.log('Query params:', req.query);
    
    const { code, error, state } = req.query;
    
    if (error) {
      console.log('OAuth error:', error);
      return res.redirect(`${process.env.CLIENT_URL}/meet?error=calendar_auth_failed&details=${encodeURIComponent(error)}`);
    }
    
    if (!code) {
      console.log('No authorization code received');
      return res.redirect(`${process.env.CLIENT_URL}/meet?error=no_auth_code`);
    }
    
    if (!state) {
      console.log('No state parameter received');
      return res.redirect(`${process.env.CLIENT_URL}/meet?error=no_state_token`);
    }
    
    // Decode the JWT token from state
    const jwt = require('jsonwebtoken');
    let userId;
    try {
      console.log('Decoding state token...');
      const decoded = jwt.verify(decodeURIComponent(state), process.env.JWT_SECRET);
      userId = decoded.id; // Fixed: use decoded.id instead of decoded.user.id
      console.log('User ID from token:', userId);
    } catch (jwtError) {
      console.error('JWT verification error in callback:', jwtError);
      return res.redirect(`${process.env.CLIENT_URL}/meet?error=invalid_token&details=${encodeURIComponent(jwtError.message)}`);
    }
    
    // Exchange code for tokens and save them
    try {
      console.log('Exchanging code for tokens...');
      const tokens = await GoogleCalendarService.getTokens(code);
      console.log('Tokens received, saving to user...');
      await GoogleCalendarService.saveUserTokens(userId, tokens);
      
      console.log('Google Calendar connected successfully for user:', userId);
      // Redirect back with success
      res.redirect(`${process.env.CLIENT_URL}/meet?calendar_connected=true`);
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      res.redirect(`${process.env.CLIENT_URL}/meet?error=token_exchange_failed&details=${encodeURIComponent(tokenError.message)}`);
    }
  } catch (error) {
    console.error('Error in callback:', error);
    res.redirect(`${process.env.CLIENT_URL}/meet?error=callback_failed&details=${encodeURIComponent(error.message)}`);
  }
});

// @route    POST /api/google-calendar/callback
// @desc     Handle Google Calendar OAuth callback
// @access   Private
router.post('/callback', 
  auth,
  [
    body('code').notEmpty().withMessage('Authorization code is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { code } = req.body;
      
      // Exchange code for tokens
      const tokens = await GoogleCalendarService.getTokens(code);
      
      // Save tokens to user
      await GoogleCalendarService.saveUserTokens(req.user.id, tokens);
      
      res.json({ 
        message: 'Google Calendar connected successfully',
        connected: true 
      });
    } catch (error) {
      console.error('Error in callback:', error);
      res.status(500).json({ message: 'Failed to connect Google Calendar' });
    }
  }
);

// @route    GET /api/google-calendar/status
// @desc     Check Google Calendar connection status
// @access   Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ 
      connected: user.googleCalendarConnected || false,
      hasTokens: !!user.googleCalendarTokens 
    });
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({ message: 'Failed to check connection status' });
  }
});

// @route    DELETE /api/google-calendar/disconnect
// @desc     Disconnect Google Calendar
// @access   Private
router.delete('/disconnect', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      googleCalendarTokens: null,
      googleCalendarConnected: false
    });
    
    res.json({ message: 'Google Calendar disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting:', error);
    res.status(500).json({ message: 'Failed to disconnect Google Calendar' });
  }
});

// @route    GET /api/google-calendar/calendars
// @desc     Get user's Google Calendar list
// @access   Private
router.get('/calendars', auth, async (req, res) => {
  try {
    const calendars = await GoogleCalendarService.getUserCalendars(req.user.id);
    res.json({ calendars });
  } catch (error) {
    console.error('Error getting calendars:', error);
    res.status(500).json({ message: 'Failed to get calendars' });
  }
});

// @route    POST /api/google-calendar/sync-meeting/:id
// @desc     Sync VLink meeting with Google Calendar
// @access   Private
router.post('/sync-meeting/:id', auth, async (req, res) => {
  try {
    const meetingId = req.params.id;
    const googleEventData = await GoogleCalendarService.syncMeetingWithGoogle(req.user.id, meetingId);
    
    res.json({ 
      message: 'Meeting synced with Google Calendar',
      googleEventData 
    });
  } catch (error) {
    console.error('Error syncing meeting:', error);
    res.status(500).json({ message: error.message || 'Failed to sync meeting' });
  }
});

// @route    GET /api/google-calendar/events
// @desc     Get Google Calendar events for date range
// @access   Private
router.get('/events',
  auth,
  [
    query('startDate').isISO8601().withMessage('Valid start date is required'),
    query('endDate').isISO8601().withMessage('Valid end date is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { startDate, endDate } = req.query;
      const events = await GoogleCalendarService.getCalendarEvents(
        req.user.id,
        new Date(startDate),
        new Date(endDate)
      );
      
      res.json({ events });
    } catch (error) {
      console.error('Error getting calendar events:', error);
      res.status(500).json({ message: 'Failed to get calendar events' });
    }
  }
);

// @route    POST /api/google-calendar/import-events
// @desc     Import Google Calendar events as VLink meetings
// @access   Private
router.post('/import-events',
  auth,
  [
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('selectedEvents').isArray().withMessage('Selected events must be an array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { startDate, endDate, selectedEvents } = req.body;
      
      // Get Google Calendar events
      const googleEvents = await GoogleCalendarService.getCalendarEvents(
        req.user.id,
        new Date(startDate),
        new Date(endDate)
      );
      
      // Filter selected events
      const eventsToImport = googleEvents.filter(event => 
        selectedEvents.includes(event.id)
      );
      
      // Create VLink meetings from selected events
      const importedMeetings = [];
      
      for (const event of eventsToImport) {
        const startTime = new Date(event.start);
        const endTime = new Date(event.end);
        const duration = Math.round((endTime - startTime) / (1000 * 60)); // minutes
        
        const meeting = new Meeting({
          title: event.title,
          description: event.description || `Imported from Google Calendar`,
          date: startTime,
          time: startTime.toTimeString().slice(0, 5), // HH:MM format
          duration: duration,
          meetLink: event.hangoutLink || event.htmlLink,
          organizer: req.user.id,
          participants: event.attendees.map(attendee => ({
            name: attendee.displayName || attendee.email,
            email: attendee.email,
            status: 'pending'
          })),
          googleEventId: event.id,
          googleCalendarLink: event.htmlLink,
          syncedWithGoogle: true,
          status: 'scheduled',
          meetingType: event.hangoutLink ? 'video' : 'in-person'
        });
        
        const savedMeeting = await meeting.save();
        importedMeetings.push(savedMeeting);
      }
      
      res.json({ 
        message: `${importedMeetings.length} meetings imported successfully`,
        importedMeetings 
      });
    } catch (error) {
      console.error('Error importing events:', error);
      res.status(500).json({ message: 'Failed to import events' });
    }
  }
);

// @route    POST /api/google-calendar/create-event
// @desc     Create event in Google Calendar and VLink
// @access   Private
router.post('/create-event',
  auth,
  [
    body('title').notEmpty().withMessage('Meeting title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time in HH:MM format is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('participants').optional().isArray().withMessage('Participants must be an array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meetingData = {
        ...req.body,
        organizer: req.user.id
      };
      
      // Create Google Calendar event
      const googleEventData = await GoogleCalendarService.createCalendarEvent(req.user.id, meetingData);
      
      // Create VLink meeting
      const meeting = new Meeting({
        title: meetingData.title,
        description: meetingData.description || '',
        date: new Date(meetingData.date),
        time: meetingData.time,
        duration: meetingData.duration,
        meetLink: googleEventData.googleMeetLink || meetingData.meetLink || '',
        organizer: req.user.id,
        participants: meetingData.participants || [],
        googleEventId: googleEventData.googleEventId,
        googleMeetLink: googleEventData.googleMeetLink,
        googleCalendarLink: googleEventData.htmlLink,
        syncedWithGoogle: true,
        status: 'scheduled',
        meetingType: 'video',
        recurring: meetingData.recurring || 'One-time',
        reminder: meetingData.reminder || { enabled: true, time: 15 }
      });
      
      const savedMeeting = await meeting.save();
      const populatedMeeting = await Meeting.findById(savedMeeting._id).populate('organizer');
      
      res.status(201).json({
        message: 'Meeting created and synced with Google Calendar',
        meeting: populatedMeeting,
        googleEventData
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: error.message || 'Failed to create event' });
    }
  }
);

// @route    PUT /api/google-calendar/update-event/:id
// @desc     Update event in both Google Calendar and VLink
// @access   Private
router.put('/update-event/:id',
  auth,
  [
    body('title').optional().notEmpty().withMessage('Meeting title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time in HH:MM format is required'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meetingId = req.params.id;
      const meeting = await Meeting.findById(meetingId);
      
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
      
      if (meeting.organizer.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only meeting organizer can update the meeting' });
      }
      
      // Update Google Calendar event if synced
      if (meeting.syncedWithGoogle && meeting.googleEventId) {
        const updateData = {
          title: req.body.title || meeting.title,
          description: req.body.description || meeting.description,
          date: req.body.date || meeting.date.toISOString().split('T')[0],
          time: req.body.time || meeting.time,
          duration: req.body.duration || meeting.duration,
          participants: req.body.participants || meeting.participants
        };
        
        await GoogleCalendarService.updateCalendarEvent(req.user.id, meeting.googleEventId, updateData);
      }
      
      // Update VLink meeting
      const updatedMeeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { $set: req.body },
        { new: true }
      ).populate('organizer');
      
      res.json({
        message: 'Meeting updated successfully',
        meeting: updatedMeeting
      });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: error.message || 'Failed to update event' });
    }
  }
);

// @route    DELETE /api/google-calendar/delete-event/:id
// @desc     Delete event from both Google Calendar and VLink
// @access   Private
router.delete('/delete-event/:id', auth, async (req, res) => {
  try {
    const meetingId = req.params.id;
    const meeting = await Meeting.findById(meetingId);
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    if (meeting.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only meeting organizer can delete the meeting' });
    }
    
    // Delete from Google Calendar if synced
    if (meeting.syncedWithGoogle && meeting.googleEventId) {
      try {
        await GoogleCalendarService.deleteCalendarEvent(req.user.id, meeting.googleEventId);
      } catch (error) {
        console.warn('Could not delete from Google Calendar:', error.message);
      }
    }
    
    // Delete from VLink
    await Meeting.findByIdAndDelete(meetingId);
    
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message || 'Failed to delete event' });
  }
});

module.exports = router;
