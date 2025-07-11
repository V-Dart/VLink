const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/Users');
const { auth } = require('../middleware/auth');
const { body, validationResult, param } = require('express-validator');

// @route    GET /api/meetings
// @desc     Get all meetings for the authd user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      type = 'all',
      page = 1, 
      limit = 50,
      search
    } = req.query;

    let query = {
      $or: [
        { organizer: req.user.id },
        { 'participants.user': req.user.id }
      ]
    };

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by type (upcoming, past, all)
    const now = new Date();
    if (type === 'upcoming') {
      query.date = { $gte: now };
    } else if (type === 'past') {
      query.date = { $lt: now };
    }

    // Search functionality
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'participants.name': { $regex: search, $options: 'i' } }
        ]
      });
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'username email firstName lastName profilePicture')
      .populate('participants.user', 'username email firstName lastName profilePicture')
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meeting.countDocuments(query);

    res.json({
      meetings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route    GET /api/meetings/:id
// @desc     Get a specific meeting
// @access   Private
router.get('/:id', 
  auth,
  param('id').isMongoId().withMessage('Invalid meeting ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meeting = await Meeting.findById(req.params.id)
        .populate('organizer', 'username email firstName lastName profilePicture')
        .populate('participants.user', 'username email firstName lastName profilePicture');

      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      // Check if user has access to this meeting
      const hasAccess = meeting.organizer._id.toString() === req.user.id ||
                       meeting.participants.some(p => p.user && p.user._id.toString() === req.user.id);

      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(meeting);
    } catch (error) {
      console.error('Error fetching meeting:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    POST /api/meetings
// @desc     Create a new meeting
// @access   Private
router.post('/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('participants').isArray().withMessage('Participants must be an array'),
    body('meetLink').optional().isURL().withMessage('Meeting link must be a valid URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        date,
        time,
        duration,
        participants,
        recurring,
        recurringUntil,
        meetLink,
        reminder,
        meetingType,
        tags,
        notes
      } = req.body;

      // Process participants
      const processedParticipants = [];
      for (const participant of participants) {
        if (typeof participant === 'string') {
          // If it's just a name/email string
          processedParticipants.push({
            name: participant.trim(),
            email: participant.includes('@') ? participant.trim() : null,
            status: 'pending'
          });
        } else if (participant.user) {
          // If it's a user object
          processedParticipants.push({
            user: participant.user,
            name: participant.name,
            email: participant.email,
            status: 'pending'
          });
        }
      }

      const meetingData = {
        title,
        description,
        date: new Date(date),
        time,
        duration,
        organizer: req.user.id,
        participants: processedParticipants,
        recurring: recurring || 'One-time',
        recurringUntil: recurringUntil ? new Date(recurringUntil) : null,
        meetLink: meetLink || `${process.env.CLIENT_URL}/meeting/${new Date().getTime()}`,
        reminder: reminder || { enabled: true, time: 15 },
        meetingType: meetingType || 'video',
        tags: tags || [],
        notes
      };

      const meeting = new Meeting(meetingData);
      await meeting.save();

      // Populate the created meeting
      const populatedMeeting = await Meeting.findById(meeting._id)
        .populate('organizer', 'username email firstName lastName profilePicture')
        .populate('participants.user', 'username email firstName lastName profilePicture');

      res.status(201).json(populatedMeeting);
    } catch (error) {
      console.error('Error creating meeting:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    PUT /api/meetings/:id
// @desc     Update a meeting
// @access   Private
router.put('/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid meeting ID'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('participants').optional().isArray().withMessage('Participants must be an array'),
    body('meetLink').optional().isURL().withMessage('Meeting link must be a valid URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meeting = await Meeting.findById(req.params.id);

      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      // Check if user is the organizer
      if (meeting.organizer.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only the organizer can update this meeting' });
      }

      const updateData = { ...req.body };

      // Process participants if provided
      if (req.body.participants) {
        const processedParticipants = [];
        for (const participant of req.body.participants) {
          if (typeof participant === 'string') {
            processedParticipants.push({
              name: participant.trim(),
              email: participant.includes('@') ? participant.trim() : null,
              status: 'pending'
            });
          } else {
            processedParticipants.push(participant);
          }
        }
        updateData.participants = processedParticipants;
      }

      // Update date if provided
      if (req.body.date) {
        updateData.date = new Date(req.body.date);
      }

      const updatedMeeting = await Meeting.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('organizer', 'username email firstName lastName profilePicture')
       .populate('participants.user', 'username email firstName lastName profilePicture');

      res.json(updatedMeeting);
    } catch (error) {
      console.error('Error updating meeting:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    DELETE /api/meetings/:id
// @desc     Delete a meeting
// @access   Private
router.delete('/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid meeting ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meeting = await Meeting.findById(req.params.id);

      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      // Check if user is the organizer
      if (meeting.organizer.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only the organizer can delete this meeting' });
      }

      await Meeting.findByIdAndDelete(req.params.id);

      res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    GET /api/meetings/calendar/:year/:month
// @desc     Get meetings for a specific month (calendar view)
// @access   Private
router.get('/calendar/:year/:month',
  auth,
  param('year').isInt({ min: 2020, max: 2050 }).withMessage('Invalid year'),
  param('month').isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { year, month } = req.params;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const meetings = await Meeting.getMeetingsInDateRange(
        startDate,
        endDate,
        req.user.id
      );

      // Group meetings by date
      const groupedMeetings = meetings.reduce((acc, meeting) => {
        const dateKey = meeting.date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(meeting);
        return acc;
      }, {});

      res.json(groupedMeetings);
    } catch (error) {
      console.error('Error fetching calendar meetings:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    GET /api/meetings/today
// @desc     Get today's meetings
// @access   Private
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const meetings = await Meeting.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      $or: [
        { organizer: req.user.id },
        { 'participants.user': req.user.id }
      ]
    }).populate('organizer', 'username email firstName lastName profilePicture')
      .populate('participants.user', 'username email firstName lastName profilePicture')
      .sort({ time: 1 });

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching today\'s meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route    GET /api/meetings/upcoming
// @desc     Get upcoming meetings
// @access   Private
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const { limit = 5 } = req.query;

    const meetings = await Meeting.find({
      date: { $gte: now },
      status: 'scheduled',
      $or: [
        { organizer: req.user.id },
        { 'participants.user': req.user.id }
      ]
    }).populate('organizer', 'username email firstName lastName profilePicture')
      .populate('participants.user', 'username email firstName lastName profilePicture')
      .sort({ date: 1, time: 1 })
      .limit(parseInt(limit));

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route    POST /api/meetings/:id/join
// @desc     Join a meeting (update participant status)
// @access   Private
router.post('/:id/join',
  auth,
  param('id').isMongoId().withMessage('Invalid meeting ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meeting = await Meeting.findById(req.params.id);

      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      // Update participant status to accepted
      const participantIndex = meeting.participants.findIndex(
        p => p.user && p.user.toString() === req.user.id
      );

      if (participantIndex !== -1) {
        meeting.participants[participantIndex].status = 'accepted';
        await meeting.save();
      }

      res.json({ message: 'Successfully joined meeting', meetLink: meeting.meetLink });
    } catch (error) {
      console.error('Error joining meeting:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route    GET /api/meetings/search
// @desc     Search meetings
// @access   Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, startDate, endDate, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let query = {
      $or: [
        { organizer: req.user.id },
        { 'participants.user': req.user.id }
      ],
      $and: [{
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { 'participants.name': { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ]
      }]
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'username email firstName lastName profilePicture')
      .populate('participants.user', 'username email firstName lastName profilePicture')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(meetings);
  } catch (error) {
    console.error('Error searching meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
