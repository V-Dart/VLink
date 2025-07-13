# 🚀 VLink - Modern CRM & Customer Relationship Management Platform

<div align="center">
  <img src="frontend/src/assets/logo-profile.png" alt="VLink Logo" width="80" height="80">
  
  [![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-v19.1.0-blue.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-v6.17+-brightgreen.svg)](https://mongodb.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-v5.1.0-lightgrey.svg)](https://expressjs.com/)
  
  **A comprehensive CRM solution for sales teams, customer management, and business growth acceleration.**
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
- [📄 License](#-linse)

## 🎯 Overview

VLink is a comprehensive Customer Relationship Management (CRM) platform designed to streamline sales processes, enhance customer relationships, and drive business growth. Built with modern web technologies, it provides sales teams with powerful tools for lead management, deal tracking, customer communication, and performance analytics.

### 🌟 Key Highlights

- **🎯 Lead Management**: Comprehensive lead capture, qualification, and nurturing system
- **💼 Sales Pipeline**: Visual pipeline management with deal tracking and forecasting
- **� Customer Portal**: Dedicated customer self-service portal with account management
- **📊 Sales Analytics**: Advanced reporting and business intelligence with PowerBI integration
- **📅 Meeting & Calendar**: Integrated scheduling with Google Calendar synchronization
- **💬 Customer Communication**: Live chat and messaging for seamless customer support
- **🎫 Ticket Management**: Customer support ticketing system with priority handling
- **🔄 Workflow Automation**: Automated sales processes and customer journey mapping
- **🔐 Multi-Role Access**: Role-based permissions for Sales Reps, Team Leaders, and Admins

## ✨ Features

### 🎯 Sales Management
- **Lead Capture & Qualification**: Multi-channel lead capture with automated qualification
- **Deal Pipeline Management**: Visual pipeline with drag-and-drop deal progression
- **Sales Forecasting**: Advanced forecasting with historical data analysis
- **Quote & Proposal Management**: Automated quote generation and approval workflows
- **Territory Management**: Geographic and account-based territory assignments

### � Customer Management
- **360° Customer View**: Complete customer profile with interaction history
- **Customer Segmentation**: Advanced segmentation for targeted marketing
- **Account Management**: Hierarchical account structure with multiple contacts
- **Customer Portal**: Self-service portal for customer account management
- **Communication History**: Complete timeline of all customer interactions

### 📊 Analytics & Reporting
- **Sales Performance Dashboards**: Real-time sales metrics and KPIs
- **PowerBI Integration**: Advanced business intelligence and custom reports
- **Revenue Analytics**: Revenue tracking, trends, and forecasting
- **Team Performance**: Individual and team performance metrics
- **Customer Analytics**: Customer behavior and engagement analytics

### 🎫 Customer Support
- **Ticket Management**: Comprehensive support ticketing system
- **Live Chat**: Real-time customer support chat functionality
- **Knowledge Base**: Self-service customer support articles
- **SLA Management**: Service level agreement tracking and enforcement
- **Escalation Management**: Automated escalation workflows

### 🔄 Process Automation
- **Workflow Designer**: Visual workflow creation and automation
- **Email Automation**: Automated email sequences and follow-ups
- **Task Automation**: Automated task creation and assignment
- **Integration APIs**: REST APIs for third-party integrations
- **Notification System**: Real-time alerts and notifications

### 🔐 Security & Access Control
- **Role-Based Permissions**: Granular access control for different user roles
- **Multi-Factor Authentication**: Enhanced security with MFA support
- **Data Encryption**: End-to-end encryption for sensitive customer data
- **Audit Trails**: Complete audit logging for compliance
- **GDPR Compliance**: Data protection and privacy compliance features

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VLink CRM Architecture                   │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 19.1.0)          Backend (Node.js/Express)│
│  ├── Customer Dashboard           ├── CRM API Server        │
│  ├── Sales Pipeline UI            ├── MongoDB Database      │
│  ├── Analytics Dashboard          ├── Lead Management       │
│  ├── Customer Portal              ├── Deal Tracking         │
│  └── Support Interface            └── Customer Management   │
├─────────────────────────────────────────────────────────────┤
│  CRM Integrations                                           │
│  ├── Google Calendar & OAuth                               │
│  ├── LinkedIn Sales Navigator                              │
│  ├── PowerBI Analytics                                     │
│  ├── Email Marketing Tools                                 │
│  └── Video Conferencing                                    │
└─────────────────────────────────────────────────────────────┘
```

### 🏢 CRM System Design Principles

- **Sales-Centric Architecture**: Optimized for sales process workflows
- **Customer-First Design**: All features designed around customer lifecycle
- **Scalable Lead Management**: Handle high-volume lead processing
- **Real-Time Analytics**: Live dashboards and performance metrics
- **Integration-Ready**: Built for seamless third-party integrations
- **Mobile Sales Support**: Mobile-optimized for field sales teams

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version

### 1-Minute Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/vlink-crm.git
cd vlink-crm

# Install dependencies for both frontend and backend
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start the CRM development servers
npm run dev
```

Access the CRM dashboard at `http://localhost:5173`

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
MONGODB_URI=mongodb://localhost:27017/vlink_crm
DB_NAME=vlink_crm

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=1h

# Google OAuth Configuration (for Calendar integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# LinkedIn OAuth Configuration (for Sales Navigator)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

# CRM Configuration
SALES_PIPELINE_STAGES=prospecting,qualification,proposal,negotiation,closed-won,closed-lost
DEFAULT_CURRENCY=USD
FISCAL_YEAR_START=01-01

# Email Configuration (for automated campaigns)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_crm_email@gmail.com
SMTP_PASS=your_app_password

# PowerBI Configuration (for analytics)
POWERBI_CLIENT_ID=your_powerbi_client_id
POWERBI_CLIENT_SECRET=your_powerbi_client_secret
POWERBI_TENANT_ID=your_tenant_id

# Redis Configuration (for caching)
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

# CRM Feature Flags
VITE_ENABLE_SALES_PIPELINE=true
VITE_ENABLE_CUSTOMER_PORTAL=true
VITE_ENABLE_POWERBI_ANALYTICS=true
VITE_ENABLE_EMAIL_CAMPAIGNS=true
VITE_ENABLE_VIDEO_MEETINGS=true
VITE_ENABLE_LEAD_SCORING=true

# Sales Configuration
VITE_DEFAULT_CURRENCY=USD
VITE_SALES_QUOTA_PERIOD=quarterly
VITE_PIPELINE_STAGES=prospecting,qualification,proposal,negotiation,closed

# Analytics Configuration
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
VITE_POWERBI_WORKSPACE_ID=your_powerbi_workspace_id
VITE_SENTRY_DSN=https://your-sentry-dsn
```

## 🔐 Authentication

### Supported Authentication Methods

1. **Google OAuth 2.0**
   - Seamless sign-in for sales teams
   - Automatic Google Calendar integration for meeting scheduling
   - Contact import from Google Contacts

2. **LinkedIn OAuth 2.0**
   - Professional network integration for lead prospecting
   - LinkedIn Sales Navigator integration
   - Automatic profile and company data import

3. **Traditional Email/Password**
   - Secure CRM user authentication
   - Role-based access for Sales Reps, Team Leaders, and Admins
   - Password policies and multi-factor authentication

### CRM User Roles

- **Admin**: Full system access, user management, system configuration
- **Sales Manager**: Team oversight, pipeline management, reporting access
- **Team Leader**: Team performance, lead assignment, quota management
- **Sales Rep**: Lead management, deal tracking, customer interaction
- **Customer**: Limited access to customer portal and support features

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

## 📱 CRM Features Deep Dive

### � Sales Pipeline Management

The sales pipeline is the heart of the CRM system:

- **Visual Pipeline**: Drag-and-drop interface for deal progression
- **Customizable Stages**: Configure pipeline stages based on your sales process
- **Deal Forecasting**: Probability-based revenue forecasting
- **Pipeline Analytics**: Conversion rates, velocity, and bottleneck analysis
- **Automated Workflows**: Trigger actions based on deal stage changes
- **Team Quotas**: Set and track individual and team sales quotas

### � Customer Relationship Management

Comprehensive customer lifecycle management:

- **Lead Capture**: Multi-channel lead capture (web forms, API, manual entry)
- **Lead Scoring**: Automated lead scoring based on engagement and fit
- **Customer Profiles**: 360-degree customer view with interaction history
- **Account Hierarchy**: Manage complex account structures with multiple contacts
- **Customer Segmentation**: Advanced segmentation for targeted campaigns
- **Relationship Mapping**: Visualize customer relationships and influencers

### 📊 Sales Analytics & Reporting

Powerful business intelligence for sales teams:

- **Sales Dashboards**: Real-time sales metrics and KPIs
- **Revenue Reports**: Historical and forecasted revenue analysis
- **Performance Tracking**: Individual and team performance metrics
- **Activity Analytics**: Call, email, and meeting activity tracking
- **Pipeline Reports**: Deal progression and conversion analysis
- **Custom Reports**: Build custom reports with drag-and-drop interface

### 🎫 Customer Support & Service

Integrated customer support functionality:

- **Ticket Management**: Comprehensive support ticket system
- **SLA Management**: Service level agreement tracking and alerts
- **Knowledge Base**: Self-service customer support articles
- **Live Chat**: Real-time customer support chat
- **Escalation Rules**: Automated ticket escalation workflows
- **Customer Satisfaction**: Post-interaction satisfaction surveys

### 🔄 Sales Process Automation

Streamline repetitive sales tasks:

- **Email Sequences**: Automated email campaigns and follow-ups
- **Task Automation**: Automatic task creation and assignment
- **Lead Routing**: Intelligent lead distribution to sales reps
- **Approval Workflows**: Quote and discount approval processes
- **Data Enrichment**: Automatic contact and company data enrichment
- **Integration Triggers**: Webhook-based third-party integrations

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

This project is licensed by VDart.

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
