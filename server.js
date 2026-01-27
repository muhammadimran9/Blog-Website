const express = require('express');
const cors = require('cors');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(express.static('.')); // Serve static files from current directory

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Firebase configuration is loaded from .env file
// Frontend will handle Firebase authentication and database operations
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Authentication middleware
function requireAuth(req, res, next) {
  // Firebase authentication is handled on the frontend
  // This middleware is for optional session tracking
  next();
}

// Firebase handles registration and authentication
// This endpoint is kept for legacy compatibility
app.post('/api/register', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Name and email are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    res.json({ 
      message: 'Firebase will handle registration',
      note: 'Please use Firebase authentication'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Check if user exists
    let user = users.get(email);

    // If user doesn't exist, create one (quick access)
    if (!user) {
      user = {
   Firebase handles login
// This endpoint is kept for legacy compatibility
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    res.json({ 
      message: 'Firebase will handle authentication',
      note: 'Please use Firebase authentication'(user) {
      return res.json({ 
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }
  }
  res.json({ authenticated: false });
});

// Quiz generation is now handled by Firebase Realtime Database
// This endpoint is kept for legacy compatibility and returns Firebase info
app.post('/api/generate-quiz', requireAuth, async (req, res) => {
  try {
    const { domain, difficulty } = req.body;

    if (!domain || !difficulty) {
      return res.status(400).json({ 
        error: 'Domain and difficulty are required' 
      });
    }

    res.json({
      message: 'Quiz data is managed by Firebase Realtime Database',
      note: 'Please use Firebase to read quiz questions',
      domain,
      difficulty
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error',
      message: error.message 
    });
  }
});

// Send quiz results via email (Firebase will store results)
app.post('/api/send-results', requireAuth, async (req, res) => {
  try {
    const { domain, difficulty, score, total, userEmail, userName } = req.body;

    if (!domain || difficulty === undefined || score === undefined || total === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    if (!userEmail) {
      return res.status(400).json({ 
        error: 'User email is required' 
      });
    }

    // Calculate percentage
    const percentage = Math.round((score / total) * 100);
    
    // Prepare email content
    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Quiz Results - IT Interview Hub</h2>
        <p>Hello ${userName || 'User'},</p>
        <p>Thank you for completing the quiz! Here are your results:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0f172a;">Quiz Summary</h3>
          <p><strong>Domain:</strong> ${domain}</p>
          <p><strong>Difficulty Level:</strong> ${difficulty}</p>
          <p><strong>Score:</strong> ${score} out of ${total}</p>
          <p><strong>Percentage:</strong> ${percentage}%</p>
        </div>

        <p style="margin-top: 30px;">Keep practicing to improve your knowledge!</p>
        <p>Best regards,<br>IT Interview Hub</p>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: `"IT Interview Hub" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Quiz Results: ${domain} - ${difficulty} Level`,
      html: emailContent,
      text: `
Quiz Results - IT Interview Hub

Hello ${userName || 'User'},

Thank you for completing the quiz! Here are your results:

Quiz Summary:
- Domain: ${domain}
- Difficulty Level: ${difficulty}
- Score: ${score} out of ${total}
- Percentage: ${percentage}%

Keep practicing to improve your knowledge!

Best regards,
IT Interview Hub
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Results sent successfully',
      emailSent: true
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
});

// Firebase configuration endpoint
app.get('/api/firebase-config', (req, res) => {
  res.json({ 
    message: 'Use the Firebase config from .env file',
    config: firebaseConfig
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    backend: 'Firebase with Node.js/Express'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Firebase integration enabled`);
  console.log(`Email service enabled`);
});
