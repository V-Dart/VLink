const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  meetLink: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    }
  }],
  recurring: {
    type: String,
    enum: ['One-time', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly'],
    default: 'One-time'
  },
  recurringUntil: {
    type: Date
  },
  parentMeetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: true
    },
    time: {
      type: Number,
      default: 15 // minutes before meeting
    }
  },
  meetingType: {
    type: String,
    enum: ['video', 'audio', 'in-person'],
    default: 'video'
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  recording: {
    enabled: {
      type: Boolean,
      default: false
    },
    url: String,
    duration: Number
  },
  googleEventId: {
    type: String,
    unique: true,
    sparse: true
  },
  googleMeetLink: {
    type: String
  },
  googleCalendarLink: {
    type: String
  },
  syncedWithGoogle: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
meetingSchema.index({ date: 1, organizer: 1 });
meetingSchema.index({ participants: 1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ recurring: 1 });

// Virtual for formatted date
meetingSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for meeting end time
meetingSchema.virtual('endTime').get(function() {
  const [hours, minutes] = this.time.split(':');
  const startTime = new Date(this.date);
  startTime.setHours(parseInt(hours), parseInt(minutes));
  const endTime = new Date(startTime.getTime() + this.duration * 60000);
  return endTime.toTimeString().slice(0, 5);
});

// Method to check if meeting is upcoming
meetingSchema.methods.isUpcoming = function() {
  const now = new Date();
  const [hours, minutes] = this.time.split(':');
  const meetingDateTime = new Date(this.date);
  meetingDateTime.setHours(parseInt(hours), parseInt(minutes));
  return meetingDateTime > now;
};

// Method to check if meeting is in progress
meetingSchema.methods.isInProgress = function() {
  const now = new Date();
  const [hours, minutes] = this.time.split(':');
  const meetingDateTime = new Date(this.date);
  meetingDateTime.setHours(parseInt(hours), parseInt(minutes));
  const endTime = new Date(meetingDateTime.getTime() + this.duration * 60000);
  return now >= meetingDateTime && now <= endTime;
};

// Static method to get meetings for a specific date range
meetingSchema.statics.getMeetingsInDateRange = function(startDate, endDate, userId) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    $or: [
      { organizer: userId },
      { 'participants.user': userId }
    ]
  }).populate('organizer', 'username email firstName lastName profilePicture')
    .populate('participants.user', 'username email firstName lastName profilePicture');
};

// Pre-save middleware to generate meeting link if not provided
meetingSchema.pre('save', function(next) {
  if (!this.meetLink) {
    // Generate a unique meeting link
    const meetingId = this._id || new mongoose.Types.ObjectId();
    this.meetLink = `${process.env.CLIENT_URL}/meeting/${meetingId}`;
  }
  next();
});

module.exports = mongoose.model('Meeting', meetingSchema);
