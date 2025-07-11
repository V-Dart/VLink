# VLink Meeting Backend API Documentation

## Overview
This document describes the backend API endpoints for the VLink Meet page functionality. The backend provides comprehensive meeting management, calendar features, and analytics.

## Authentication
All API endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Base URLs
- Development: `http://localhost:5000/api`
- Meetings: `/api/meetings`
- Calendar: `/api/calendar`

## Meeting Endpoints

### 1. Get All Meetings
**GET** `/api/meetings`

**Query Parameters:**
- `startDate` (optional): Filter meetings from this date (ISO format)
- `endDate` (optional): Filter meetings until this date (ISO format)
- `status` (optional): Filter by status (`scheduled`, `in-progress`, `completed`, `cancelled`)
- `type` (optional): Filter by type (`upcoming`, `past`, `all`)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 50)
- `search` (optional): Search in title, description, and participants

**Example Request:**
```javascript
fetch('/api/meetings?type=upcoming&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Response:**
```json
{
  "meetings": [
    {
      "_id": "meeting_id",
      "title": "Weekly Team Standup",
      "description": "Daily standup to discuss progress",
      "date": "2024-01-15T00:00:00.000Z",
      "time": "09:00",
      "duration": 30,
      "meetLink": "https://teams.microsoft.com/...",
      "organizer": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "participants": [
        {
          "user": "user_id",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "status": "pending"
        }
      ],
      "recurring": "Weekly",
      "status": "scheduled",
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 45
  }
}
```

### 2. Get Specific Meeting
**GET** `/api/meetings/:id`

**Response:** Single meeting object (same structure as above)

### 3. Create New Meeting
**POST** `/api/meetings`

**Request Body:**
```json
{
  "title": "Project Planning Session",
  "description": "Q1 project planning and roadmap discussion",
  "date": "2024-01-16",
  "time": "10:30",
  "duration": 90,
  "participants": [
    "john@example.com",
    "jane@example.com"
  ],
  "recurring": "Weekly",
  "recurringUntil": "2024-03-16",
  "meetLink": "https://teams.microsoft.com/...",
  "reminder": {
    "enabled": true,
    "time": 15
  },
  "meetingType": "video",
  "tags": ["planning", "project"],
  "notes": "Bring Q4 reports"
}
```

**Required Fields:**
- `title` (string)
- `date` (ISO date string)
- `time` (HH:MM format)
- `duration` (integer, minutes)
- `participants` (array)

**Response:** Created meeting object

### 4. Update Meeting
**PUT** `/api/meetings/:id`

**Request Body:** Same as create, all fields optional
**Response:** Updated meeting object

### 5. Delete Meeting
**DELETE** `/api/meetings/:id`

**Response:**
```json
{
  "message": "Meeting deleted successfully"
}
```

### 6. Get Calendar View
**GET** `/api/meetings/calendar/:year/:month`

**Example:** `/api/meetings/calendar/2024/1`

**Response:**
```json
{
  "2024-01-15": [
    {
      // meeting objects for Jan 15th
    }
  ],
  "2024-01-16": [
    {
      // meeting objects for Jan 16th
    }
  ]
}
```

### 7. Get Today's Meetings
**GET** `/api/meetings/today`

**Response:** Array of today's meetings

### 8. Get Upcoming Meetings
**GET** `/api/meetings/upcoming`

**Query Parameters:**
- `limit` (optional): Number of meetings to return (default: 5)

**Response:** Array of upcoming meetings

### 9. Join Meeting
**POST** `/api/meetings/:id/join`

**Response:**
```json
{
  "message": "Successfully joined meeting",
  "meetLink": "https://teams.microsoft.com/..."
}
```

### 10. Search Meetings
**GET** `/api/meetings/search`

**Query Parameters:**
- `q` (required): Search query
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `limit` (optional): Number of results (default: 20)

**Response:** Array of matching meetings

## Calendar Endpoints

### 1. Get User Availability
**GET** `/api/calendar/availability`

**Query Parameters:**
- `date` (required): Date to check (ISO format)
- `duration` (optional): Meeting duration in minutes (default: 60)

**Example Request:**
```javascript
fetch('/api/calendar/availability?date=2024-01-15&duration=60', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Response:**
```json
{
  "date": "2024-01-15",
  "duration": 60,
  "availableSlots": [
    {
      "start": "09:00",
      "end": "10:00",
      "available": true
    },
    {
      "start": "14:00",
      "end": "15:00",
      "available": true
    }
  ]
}
```

### 2. Find Optimal Meeting Times
**POST** `/api/calendar/find-optimal-time`

**Request Body:**
```json
{
  "participants": ["user_id_1", "user_id_2"],
  "date": "2024-01-15",
  "duration": 60,
  "numberOfSlots": 3
}
```

**Response:**
```json
{
  "date": "2024-01-15",
  "duration": 60,
  "participants": 3,
  "suggestedTimes": [
    {
      "start": "10:00",
      "end": "11:00",
      "available": true,
      "score": 8,
      "participants": 3
    }
  ]
}
```

### 3. Get Meeting Analytics
**GET** `/api/calendar/analytics`

**Query Parameters:**
- `startDate` (required): Analytics period start
- `endDate` (required): Analytics period end

**Response:**
```json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "analytics": {
    "totalMeetings": 45,
    "totalDuration": 2700,
    "averageDuration": 60,
    "meetingsByStatus": {
      "scheduled": 30,
      "completed": 12,
      "cancelled": 3,
      "in-progress": 0
    },
    "meetingsByType": {
      "video": 40,
      "audio": 3,
      "in-person": 2
    },
    "recurringMeetings": 15,
    "upcomingMeetings": 8,
    "averageParticipants": 4
  }
}
```

### 4. Check Meeting Conflicts
**POST** `/api/calendar/check-conflicts`

**Request Body:**
```json
{
  "date": "2024-01-15",
  "time": "10:00",
  "duration": 60,
  "excludeMeetingId": "optional_meeting_id"
}
```

**Response:**
```json
{
  "hasConflicts": true,
  "conflicts": [
    {
      "id": "meeting_id",
      "title": "Existing Meeting",
      "time": "10:30",
      "duration": 45
    }
  ]
}
```

### 5. Get Quick Stats
**GET** `/api/calendar/quick-stats`

**Response:**
```json
{
  "thisWeek": {
    "totalMeetings": 8,
    "totalDuration": 420
    // ... other analytics
  },
  "thisMonth": {
    "totalMeetings": 32,
    "totalDuration": 1920
    // ... other analytics
  },
  "period": {
    "week": {
      "start": "2024-01-14",
      "end": "2024-01-20"
    },
    "month": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    }
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## Frontend Integration Examples

### React Hook for Meetings
```javascript
// Custom hook for meeting management
import { useState, useEffect } from 'react';

export const useMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/meetings?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMeetings(data.meetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData) => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(meetingData)
      });
      const newMeeting = await response.json();
      setMeetings(prev => [...prev, newMeeting]);
      return newMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  return {
    meetings,
    loading,
    fetchMeetings,
    createMeeting
  };
};
```

### Integration with Meet.jsx
```javascript
// In your Meet.jsx component
import { useMeetings } from './hooks/useMeetings';

export default function Meet() {
  const { meetings, loading, fetchMeetings, createMeeting } = useMeetings();

  useEffect(() => {
    fetchMeetings({ type: 'upcoming' });
  }, []);

  const handleSchedule = async (formData) => {
    try {
      await createMeeting(formData);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  // Rest of your component...
}
```

## Database Schema

### Meeting Model
```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  time: String (required, HH:MM format),
  duration: Number (required, minutes),
  meetLink: String (required),
  organizer: ObjectId (ref: User),
  participants: [{
    user: ObjectId (ref: User),
    name: String (required),
    email: String,
    status: String (enum: pending/accepted/declined/tentative)
  }],
  recurring: String (enum: One-time/Daily/Weekly/Monthly),
  recurringUntil: Date,
  parentMeetingId: ObjectId (ref: Meeting),
  status: String (enum: scheduled/in-progress/completed/cancelled),
  reminder: {
    enabled: Boolean,
    time: Number (minutes before meeting)
  },
  meetingType: String (enum: video/audio/in-person),
  tags: [String],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: Date
  }],
  notes: String,
  recording: {
    enabled: Boolean,
    url: String,
    duration: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

This comprehensive backend provides all the functionality needed for a modern meeting management system with calendar features, analytics, and smart scheduling capabilities!
