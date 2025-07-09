const Meeting = require('../models/Meeting');

class CalendarService {
  // Generate recurring meetings
  static async createRecurringMeetings(baseMeeting, recurringPattern, endDate) {
    const meetings = [];
    const baseDate = new Date(baseMeeting.date);
    let currentDate = new Date(baseDate);
    
    // Limit to prevent infinite loops
    const maxMeetings = 52; // Maximum 1 year of weekly meetings
    let meetingCount = 0;
    
    while (currentDate <= endDate && meetingCount < maxMeetings) {
      if (currentDate > baseDate) { // Skip the original meeting
        const recurringMeeting = new Meeting({
          ...baseMeeting,
          date: new Date(currentDate),
          parentMeetingId: baseMeeting._id
        });
        
        meetings.push(recurringMeeting);
      }
      
      // Calculate next occurrence
      switch (recurringPattern) {
        case 'Daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'Weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'Bi-weekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'Monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          return meetings; // No recurring pattern
      }
      
      meetingCount++;
    }
    
    return meetings;
  }

  // Get availability for a user on a specific date
  static async getUserAvailability(userId, date, duration = 60) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all meetings for the user on this date
    const existingMeetings = await Meeting.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      $or: [
        { organizer: userId },
        { 'participants.user': userId }
      ],
      status: { $ne: 'cancelled' }
    }).sort({ time: 1 });

    // Define working hours (9 AM to 6 PM)
    const workingHours = {
      start: 9,
      end: 18
    };

    const availableSlots = [];
    const slotDuration = duration; // in minutes

    // Generate time slots
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
        const slotStart = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStartTime = new Date(date);
        slotStartTime.setHours(hour, minute, 0, 0);
        
        const slotEndTime = new Date(slotStartTime.getTime() + slotDuration * 60000);
        
        // Check if this slot conflicts with existing meetings
        const hasConflict = existingMeetings.some(meeting => {
          const [meetingHour, meetingMinute] = meeting.time.split(':');
          const meetingStart = new Date(date);
          meetingStart.setHours(parseInt(meetingHour), parseInt(meetingMinute), 0, 0);
          
          const meetingEnd = new Date(meetingStart.getTime() + meeting.duration * 60000);
          
          return (slotStartTime < meetingEnd && slotEndTime > meetingStart);
        });

        if (!hasConflict && slotEndTime.getHours() <= workingHours.end) {
          availableSlots.push({
            start: slotStart,
            end: slotEndTime.toTimeString().slice(0, 5),
            available: true
          });
        }
      }
    }

    return availableSlots;
  }

  // Find optimal meeting times for multiple participants
  static async findOptimalMeetingTimes(participantIds, date, duration = 60, numberOfSlots = 3) {
    const allAvailabilities = await Promise.all(
      participantIds.map(userId => this.getUserAvailability(userId, date, duration))
    );

    // Find common available slots
    const commonSlots = allAvailabilities[0].filter(slot =>
      allAvailabilities.every(userAvailability =>
        userAvailability.some(userSlot =>
          userSlot.start === slot.start && userSlot.available
        )
      )
    );

    // Score slots based on preference (earlier in the day gets higher score)
    const scoredSlots = commonSlots.map(slot => {
      const [hour] = slot.start.split(':');
      const hourScore = 18 - parseInt(hour); // Earlier hours get higher scores
      
      return {
        ...slot,
        score: hourScore,
        participants: participantIds.length
      };
    });

    // Return top scored slots
    return scoredSlots
      .sort((a, b) => b.score - a.score)
      .slice(0, numberOfSlots);
  }

  // Generate meeting analytics
  static async getMeetingAnalytics(userId, startDate, endDate) {
    const meetings = await Meeting.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      $or: [
        { organizer: userId },
        { 'participants.user': userId }
      ]
    });

    const analytics = {
      totalMeetings: meetings.length,
      totalDuration: meetings.reduce((sum, meeting) => sum + meeting.duration, 0),
      averageDuration: meetings.length > 0 ? 
        Math.round(meetings.reduce((sum, meeting) => sum + meeting.duration, 0) / meetings.length) : 0,
      meetingsByStatus: {
        scheduled: meetings.filter(m => m.status === 'scheduled').length,
        completed: meetings.filter(m => m.status === 'completed').length,
        cancelled: meetings.filter(m => m.status === 'cancelled').length,
        'in-progress': meetings.filter(m => m.status === 'in-progress').length
      },
      meetingsByType: {
        video: meetings.filter(m => m.meetingType === 'video').length,
        audio: meetings.filter(m => m.meetingType === 'audio').length,
        'in-person': meetings.filter(m => m.meetingType === 'in-person').length
      },
      recurringMeetings: meetings.filter(m => m.recurring !== 'One-time').length,
      upcomingMeetings: meetings.filter(m => m.isUpcoming()).length,
      averageParticipants: meetings.length > 0 ?
        Math.round(meetings.reduce((sum, meeting) => sum + meeting.participants.length, 0) / meetings.length) : 0
    };

    return analytics;
  }

  // Check for meeting conflicts
  static async checkMeetingConflicts(userId, date, time, duration, excludeMeetingId = null) {
    const [hour, minute] = time.split(':');
    const meetingStart = new Date(date);
    meetingStart.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    const meetingEnd = new Date(meetingStart.getTime() + duration * 60000);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let query = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      $or: [
        { organizer: userId },
        { 'participants.user': userId }
      ],
      status: { $ne: 'cancelled' }
    };

    // Exclude current meeting if updating
    if (excludeMeetingId) {
      query._id = { $ne: excludeMeetingId };
    }

    const existingMeetings = await Meeting.find(query);

    const conflicts = existingMeetings.filter(meeting => {
      const [existingHour, existingMinute] = meeting.time.split(':');
      const existingStart = new Date(date);
      existingStart.setHours(parseInt(existingHour), parseInt(existingMinute), 0, 0);
      
      const existingEnd = new Date(existingStart.getTime() + meeting.duration * 60000);
      
      return (meetingStart < existingEnd && meetingEnd > existingStart);
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts: conflicts.map(meeting => ({
        id: meeting._id,
        title: meeting.title,
        time: meeting.time,
        duration: meeting.duration
      }))
    };
  }
}

module.exports = CalendarService;
