const express = require('express');
const router = express.Router();
const CalendarService = require('../services/CalendarService');
const { auth } = require('../middleware/auth');
const { body, validationResult, param, query } = require('express-validator');

// @route    GET /api/calendar/availability
// @desc     Get user availability for a specific date
// @access   Private
router.get('/availability',
  auth,
  [
    query('date').isISO8601().withMessage('Valid date is required'),
    query('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, duration = 60 } = req.query;
      
      const availability = await CalendarService.getUserAvailability(
        req.user.id,
        new Date(date),
        parseInt(duration)
      );

      res.json({
        date,
        duration: parseInt(duration),
        availableSlots: availability
      });
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    POST /api/calendar/find-optimal-time
// @desc     Find optimal meeting times for multiple participants
// @access   Private
router.post('/find-optimal-time',
  auth,
  [
    body('participants').isArray().withMessage('Participants must be an array'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
    body('numberOfSlots').optional().isInt({ min: 1, max: 10 }).withMessage('Number of slots must be between 1 and 10')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { 
        participants, 
        date, 
        duration = 60, 
        numberOfSlots = 3 
      } = req.body;

      // Include the requesting user in participants
      const allParticipants = [req.user.id, ...participants].filter((id, index, self) => 
        self.indexOf(id) === index // Remove duplicates
      );

      const optimalTimes = await CalendarService.findOptimalMeetingTimes(
        allParticipants,
        new Date(date),
        parseInt(duration),
        parseInt(numberOfSlots)
      );

      res.json({
        date,
        duration: parseInt(duration),
        participants: allParticipants.length,
        suggestedTimes: optimalTimes
      });
    } catch (error) {
      console.error('Error finding optimal meeting times:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    GET /api/calendar/analytics
// @desc     Get meeting analytics for a user
// @access   Private
router.get('/analytics',
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

      const analytics = await CalendarService.getMeetingAnalytics(
        req.user.id,
        new Date(startDate),
        new Date(endDate)
      );

      res.json({
        period: {
          startDate,
          endDate
        },
        analytics
      });
    } catch (error) {
      console.error('Error fetching meeting analytics:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    POST /api/calendar/check-conflicts
// @desc     Check for meeting conflicts
// @access   Private
router.post('/check-conflicts',
  auth,
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('excludeMeetingId').optional().isMongoId().withMessage('Invalid meeting ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, time, duration, excludeMeetingId } = req.body;

      const conflictCheck = await CalendarService.checkMeetingConflicts(
        req.user.id,
        new Date(date),
        time,
        duration,
        excludeMeetingId
      );

      res.json(conflictCheck);
    } catch (error) {
      console.error('Error checking meeting conflicts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    GET /api/calendar/quick-stats
// @desc     Get quick calendar statistics
// @access   Private
router.get('/quick-stats', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [weeklyStats, monthlyStats] = await Promise.all([
      CalendarService.getMeetingAnalytics(req.user.id, startOfWeek, endOfWeek),
      CalendarService.getMeetingAnalytics(req.user.id, startOfMonth, endOfMonth)
    ]);

    res.json({
      thisWeek: weeklyStats,
      thisMonth: monthlyStats,
      period: {
        week: {
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0]
        },
        month: {
          start: startOfMonth.toISOString().split('T')[0],
          end: endOfMonth.toISOString().split('T')[0]
        }
      }
    });
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
