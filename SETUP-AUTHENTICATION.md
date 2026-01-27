# Authentication & Email Setup Guide

## Quick Start

### 1. Install New Dependencies

```bash
npm install
```

This will install:
- `express-session` - For session management
- `nodemailer` - For sending emails

### 2. Configure Environment Variables

Update your `.env` file with the following:

```env
# Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Server Port
PORT=3000

# Session Secret (change this to a random string)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Use this app password (not your regular password) in `EMAIL_PASS`

### 4. Start the Server

```bash
npm start
```

## Features Implemented

### ✅ Login/Register Page (`login.html`)
- Name and Email fields (required)
- Password field (optional)
- Email format validation
- Matches existing website design
- Tab switching between Login and Register

### ✅ Access Control
- Only logged-in users can access `test.html`
- Non-logged-in users are redirected to `login.html`
- Session-based authentication using express-session
- Session stored server-side with secure cookies

### ✅ Quiz Results Email
- Automatically sends quiz results after completion
- Email includes:
  - User name
  - Email address
  - Quiz domain
  - Difficulty level
  - Score and percentage
  - Complete question review with correct answers
- Email confirmation shown on frontend

### ✅ Navigation Updates
- Login/Logout links in header (shown based on auth status)
- Mobile menu also updated
- Automatic navigation state management

## User Flow

1. User visits `test.html` → Redirected to `login.html` if not logged in
2. User registers/logs in → Session created → Redirected to `test.html`
3. User takes quiz → Completes quiz → Results calculated
4. Results automatically emailed → Confirmation shown on page
5. User can take another quiz or logout

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/auth/status` - Check authentication status
- `POST /api/generate-quiz` - Generate quiz (protected)
- `POST /api/send-results` - Send quiz results via email (protected)

## Security Features

- Session-based authentication
- Secure HTTP-only cookies
- Email validation
- Password optional (quick access)
- Server-side session storage
- Protected API endpoints

## Troubleshooting

### Email Not Sending
- Check `.env` file has correct email credentials
- Verify app password (not regular password) for Gmail
- Check spam folder
- Verify EMAIL_HOST and EMAIL_PORT are correct

### Authentication Not Working
- Make sure server is running
- Check browser allows cookies
- Verify SESSION_SECRET is set in `.env`
- Clear browser cookies and try again

### Redirect Loop
- Clear sessionStorage: `sessionStorage.clear()`
- Clear browser cookies
- Restart server

## Notes

- Users are stored in memory (will be lost on server restart)
- For production, use a database (MongoDB, PostgreSQL, etc.)
- Session expires after 24 hours
- Email is sent asynchronously (doesn't block quiz completion)
