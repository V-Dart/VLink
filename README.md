# 🚀 VLink - Enterprise Communication & Collaboration Platform

<div align="center">
  <img src="frontend/src/assets/logo-profile.png" alt="VLink Logo" width="80" height="80">
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-v19.1.0-blue.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-v6.17+-brightgreen.svg)](https://mongodb.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-v5.1.0-lightgrey.svg)](https://expressjs.com/)
  
  **A modern, full-stack enterprise platform for team communication, meeting management, and business intelligence.**
</div>

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#-configuration)
- [🔐 Authentication](#-authentication)
- [📱 Features Deep Dive](#-features-deep-dive)
- [🛠️ Development](#-development)
- [📊 API Documentation](#-api-documentation)
- [🎨 UI/UX Design](#-uiux-design)
- [🔧 Tech Stack](#-tech-stack)
- [📈 Performance](#-performance)
- [🐛 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Overview

VLink is a comprehensive enterprise communication and collaboration platform designed to streamline team workflows, enhance productivity, and provide powerful business intelligence tools. Built with modern web technologies, it offers a seamless experience across web and mobile platforms.

### 🌟 Key Highlights

- **🔐 Multi-Provider Authentication**: Support for Google OAuth, LinkedIn OAuth, and traditional email/password
- **📅 Integrated Calendar Management**: Seamless Google Calendar integration with real-time synchronization
- **🎥 Video Conferencing**: Built-in meeting management with scheduling and analytics
- **💬 Real-time Communication**: Live chat functionality with persistent messaging
- **📊 Business Intelligence**: Integrated PowerBI dashboards and custom analytics
- **🎫 Task Management**: Comprehensive ticketing system with workflow automation
- **🔄 Pipeline Management**: Visual workflow management for projects and processes
- **🏢 Multi-tenant Architecture**: Support for multiple organizations and role-based access

## ✨ Features

### 🔒 Authentication & Security
- **Multi-Provider OAuth**: Google, LinkedIn, and traditional authentication
- **JWT Token Management**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Admin, Team Leader, Sales Rep, and Product Owner roles
- **Session Management**: Secure session handling with automatic token refresh
- **Security Headers**: Comprehensive security headers and CORS configuration

### 📅 Calendar & Meeting Management
- **Google Calendar Integration**: Two-way synchronization with Google Calendar
- **Meeting Scheduling**: Advanced meeting scheduling with conflict detection
- **Video Conferencing**: Integrated video meeting capabilities
- **Meeting Analytics**: Detailed meeting metrics and attendance tracking
- **Calendar Sharing**: Team calendar visibility and sharing options

### 💼 Business Tools
- **Task Management**: Comprehensive ticketing system with priorities and assignments
- **Live Chat**: Real-time messaging with file sharing and emoji support
- **PowerBI Integration**: Embedded business intelligence dashboards
- **Workspace Management**: Project and team workspace organization
- **Pipeline Management**: Visual workflow and process management

### 📱 User Experience
- **Responsive Design**: Mobile-first design with cross-platform compatibility
- **Dark Theme**: Modern dark theme with accessibility features
- **Sidebar Navigation**: Intuitive navigation with hover effects and shortcuts
- **Profile Management**: Comprehensive user profile with avatar support
- **Notification System**: Real-time notifications and alerts

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VLink Architecture                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 19.1.0)          Backend (Node.js/Express)│
│  ├── React Router DOM             ├── Express.js Server     │
│  ├── Tailwind CSS                 ├── MongoDB Database      │
│  ├── React Icons                  ├── JWT Authentication    │
│  ├── Axios HTTP Client            ├── Passport.js OAuth     │
│  └── Vite Build Tool              └── Google APIs           │
├─────────────────────────────────────────────────────────────┤
│  External Integrations                                      │
│  ├── Google OAuth 2.0 & Calendar                          │
│  ├── LinkedIn OAuth 2.0                                    │
│  ├── PowerBI Embedded                                       │
│  └── Video Conferencing APIs                               │
└─────────────────────────────────────────────────────────────┘
```

### 🏢 System Design Principles

- **Microservices Architecture**: Modular backend services for scalability
- **RESTful API Design**: Clean, consistent API endpoints with proper HTTP methods
- **Component-Based Frontend**: Reusable React components with hooks and context
- **Database Normalization**: Optimized MongoDB schema design
- **Caching Strategy**: Efficient data caching with Redis integration
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version

### 1-Minute Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/vlink.git
cd vlink

# Install dependencies for both frontend and backend
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start the development servers
npm run dev
```

Access the application at `http://localhost:5173`

## 📦 Installation

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure your environment variables
nano .env

# Start the backend server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the frontend development server
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vlink
DB_NAME=vlink

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=1h

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

# Session Configuration
SESSION_SECRET=your_session_secret_key
SESSION_MAX_AGE=86400000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_CLIENT_URL=http://localhost:5173

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# Feature Flags
VITE_ENABLE_GOOGLE_CALENDAR=true
VITE_ENABLE_POWERBI=true
VITE_ENABLE_VIDEO_CALLING=true

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
```

## 🔐 Authentication

### Supported Authentication Methods

1. **Google OAuth 2.0**
   - Seamless sign-in with Google accounts
   - Automatic Google Calendar integration
   - Profile picture and basic info import

2. **LinkedIn OAuth 2.0**
   - Professional network integration
   - LinkedIn profile data import
   - Business contact synchronization

3. **Traditional Email/Password**
   - Secure bcrypt password hashing
   - Email verification workflow
   - Password reset functionality

### Authentication Flow

```javascript
// Google OAuth Login
const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/auth/google`;
};

// LinkedIn OAuth Login
const handleLinkedInLogin = () => {
  window.location.href = `${API_URL}/auth/linkedin`;
};

// Traditional Login
const handleLogin = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  const { token, user } = response.data;
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
```

## 📱 Features Deep Dive

### 🎫 Task Management System

The task management system provides comprehensive ticketing functionality:

- **Priority Levels**: Critical, High, Medium, Low
- **Status Tracking**: Open, In Progress, Resolved, Closed
- **Assignment System**: Multi-user assignment with notifications
- **Comments & Attachments**: Rich text comments with file uploads
- **Time Tracking**: Built-in time logging and reporting
- **Custom Fields**: Configurable custom fields per organization

### 💬 Live Chat System

Real-time communication platform with:

- **Real-time Messaging**: WebSocket-based instant messaging
- **File Sharing**: Support for images, documents, and multimedia
- **Emoji Support**: Comprehensive emoji picker and reactions
- **Message History**: Persistent message storage and search
- **User Presence**: Online/offline status indicators
- **Channel Management**: Public and private channels

### 📊 PowerBI Integration

Embedded business intelligence with:

- **Dashboard Embedding**: Seamless PowerBI dashboard integration
- **Single Sign-On**: Automatic authentication with PowerBI
- **Custom Reports**: User-defined report generation
- **Data Refresh**: Automatic data synchronization
- **Mobile Responsive**: Optimized for mobile viewing

### 🎥 Meeting Management

Comprehensive meeting solution featuring:

- **Meeting Scheduling**: Advanced scheduling with conflict detection
- **Google Calendar Sync**: Two-way synchronization
- **Video Conferencing**: Integrated video calling
- **Meeting Analytics**: Attendance tracking and meeting metrics
- **Recording**: Meeting recording and playback
- **Screen Sharing**: Built-in screen sharing capabilities

## 🛠️ Development

### Project Structure

```
vlink/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── passport.js          # OAuth configuration
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── Users.js             # User model
│   │   └── Meeting.js           # Meeting model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── meetingRoutes.js     # Meeting management
│   │   ├── calendarRoutes.js    # Calendar integration
│   │   └── userRoutes.js        # User management
│   ├── services/
│   │   ├── CalendarService.js   # Calendar operations
│   │   └── GoogleCalendarService.js
│   ├── docs/
│   │   └── MEETING_API.md       # API documentation
│   └── server.js                # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── GoogleCalendarIntegration.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── UserStatus.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Meet.jsx
│   │   │   ├── Task.jsx
│   │   │   ├── LiveChat.jsx
│   │   │   ├── PowerBI.jsx
│   │   │   ├── Workspace.jsx
│   │   │   └── Pipelines.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── oauthService.js
│   │   │   └── googleCalendarService.js
│   │   └── assets/
│   ├── public/
│   └── index.html
└── README.md
```

### Development Commands

```bash
# Start development servers
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build           # Build frontend for production
npm run build:frontend  # Build frontend only
npm run build:backend   # Build backend only

# Linting and formatting
npm run lint            # Lint all code
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier

# Testing
npm run test            # Run all tests
npm run test:frontend   # Run frontend tests
npm run test:backend    # Run backend tests
npm run test:e2e        # Run end-to-end tests
```

### Code Style & Standards

- **ESLint**: Comprehensive linting rules for JavaScript and React
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for code quality
- **Commit Convention**: Conventional commits for automated versioning
- **TypeScript**: Optional TypeScript support for type safety

## 📊 API Documentation

### Authentication Endpoints

```javascript
// Register new user
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin"
}

// Login user
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Google OAuth
GET /api/auth/google
GET /api/auth/google/callback

// LinkedIn OAuth
GET /api/auth/linkedin
GET /api/auth/linkedin/callback

// Logout
POST /api/auth/logout
```

### Meeting Management Endpoints

```javascript
// Get all meetings
GET /api/meetings?type=upcoming&limit=10

// Create new meeting
POST /api/meetings
{
  "title": "Team Standup",
  "description": "Daily team meeting",
  "date": "2024-01-15T09:00:00.000Z",
  "duration": 30,
  "participants": ["user1@example.com", "user2@example.com"]
}

// Update meeting
PUT /api/meetings/:id
{
  "title": "Updated Meeting Title",
  "status": "completed"
}

// Delete meeting
DELETE /api/meetings/:id
```

### Calendar Integration Endpoints

```javascript
// Get calendar events
GET /api/calendar/events

// Create calendar event
POST /api/calendar/events
{
  "summary": "Team Meeting",
  "start": "2024-01-15T09:00:00.000Z",
  "end": "2024-01-15T10:00:00.000Z",
  "attendees": ["user1@example.com"]
}

// Sync with Google Calendar
POST /api/calendar/sync
```

## 🎨 UI/UX Design

### Design System

- **Color Palette**: Professional dark theme with blue accents
- **Typography**: System fonts for optimal readability
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable UI components with Tailwind CSS
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG 2.1 compliance with keyboard navigation

### Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layout for tablet screens
- **Desktop Enhanced**: Rich desktop experience with hover effects
- **Touch Friendly**: Large touch targets and gesture support

### Theme Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        dark: {
          100: '#1e293b',
          200: '#0f172a',
          300: '#334155'
        }
      }
    }
  }
}
```

## 🔧 Tech Stack

### Frontend Technologies

- **React 19.1.0**: Latest React with concurrent features
- **Vite**: Lightning-fast build tool and development server
- **React Router DOM**: Client-side routing with lazy loading
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Comprehensive icon library
- **Axios**: HTTP client with request/response interceptors
- **React Context**: Global state management
- **React Hooks**: Modern React patterns

### Backend Technologies

- **Node.js**: JavaScript runtime with ES6+ features
- **Express.js 5.1.0**: Web framework with middleware support
- **MongoDB**: NoSQL database with Mongoose ODM
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Token for secure authentication
- **bcrypt**: Password hashing and validation
- **CORS**: Cross-origin resource sharing
- **Express Validator**: Input validation middleware

### Development Tools

- **ESLint**: Code linting and quality analysis
- **Prettier**: Code formatting and consistency
- **Nodemon**: Development server with auto-restart
- **Husky**: Git hooks for quality gates
- **Jest**: Testing framework
- **Postman**: API testing and documentation

## 📈 Performance

### Frontend Optimizations

- **Code Splitting**: Route-based code splitting with React.lazy
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Caching**: Service worker caching for offline support
- **Compression**: Gzip compression for static assets

### Backend Optimizations

- **Database Indexing**: Optimized MongoDB indexes
- **Connection Pooling**: Efficient database connection management
- **Caching**: Redis caching for frequently accessed data
- **Rate Limiting**: API rate limiting to prevent abuse
- **Compression**: Response compression middleware

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **API Response Time**: < 200ms average

## 🐛 Testing

### Testing Strategy

- **Unit Tests**: Component and function testing with Jest
- **Integration Tests**: API endpoint testing with Supertest
- **E2E Tests**: Full user journey testing with Cypress
- **Performance Tests**: Load testing with Artillery
- **Security Tests**: Vulnerability scanning with Snyk

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Deployment

#### Using Docker

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3
```

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start ecosystem.config.js

# Build and serve frontend
npm run build
pm2 serve frontend/dist 3000 --name "vlink-frontend"
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
DEBUG=vlink:*
```

#### Staging
```bash
NODE_ENV=staging
LOG_LEVEL=info
```

#### Production
```bash
NODE_ENV=production
LOG_LEVEL=error
ENABLE_METRICS=true
```

### Monitoring & Logging

- **Application Monitoring**: New Relic or DataDog integration
- **Error Tracking**: Sentry for error monitoring
- **Log Management**: Winston with log rotation
- **Health Checks**: Kubernetes-compatible health endpoints
- **Performance Metrics**: Prometheus metrics collection

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

### Issue Reporting

When reporting issues, please include:

- **Environment details** (OS, Node.js version, browser)
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Error messages** and stack traces

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **MongoDB**: For the flexible document database
- **Google**: For OAuth and Calendar APIs
- **LinkedIn**: For professional network integration
- **Open Source Community**: For the countless libraries and tools

---

<div align="center">
  <p>Built with ❤️ by the VLink Team</p>
  <p>
    <a href="https://github.com/yourusername/vlink">GitHub</a> •
    <a href="https://vlink-demo.com">Live Demo</a> •
    <a href="https://docs.vlink.com">Documentation</a> •
    <a href="mailto:support@vlink.com">Support</a>
  </p>
</div>
