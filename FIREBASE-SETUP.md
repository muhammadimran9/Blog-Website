# Firebase Setup Guide

## 🔥 Complete Firebase Backend Setup

This guide will help you set up Firebase for your quiz website with authentication, database, and AI-powered quiz generation.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `quiz-website` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select your preferred location
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: `quiz-app`
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Update Firebase Configuration

Replace the configuration in `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
};
```

## Step 6: Set Up Groq AI (Optional)

For AI-powered quiz generation:

1. Go to [Groq Console](https://console.groq.com/)
2. Create an account and get API key
3. Update `firebase-quiz.js`:

```javascript
this.groqApiKey = 'your-groq-api-key-here';
```

## Step 7: Configure Firestore Security Rules

In Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz attempts - users can only access their own
    match /quizAttempts/{attemptId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 8: Test the Setup

1. Open your website
2. Try registering a new user
3. Login with the credentials
4. Take a quiz to test the complete flow

## Features Included

✅ **User Authentication**
- Email/password registration and login
- User profile with additional fields (name, address, phone, preferred topic)
- Session management

✅ **Quiz System**
- AI-powered question generation using Groq
- Multiple difficulty levels
- Progress tracking
- Results storage in Firestore

✅ **Data Storage**
- User profiles in Firestore
- Quiz attempts and scores
- User statistics and history

✅ **Security**
- Copy protection on quiz pages
- Secure Firestore rules
- Authentication required for quiz access

## Troubleshooting

### Common Issues:

1. **Firebase not initialized**: Check if your config is correct
2. **Authentication errors**: Verify Email/Password is enabled
3. **Firestore permission denied**: Check security rules
4. **Groq API errors**: Verify API key and quota

### Error Messages:

- `ERR_CONNECTION_REFUSED`: Firebase config issue
- `Permission denied`: Firestore rules problem
- `User not authenticated`: Login required

## File Structure

```
blog-website/
├── firebase-config.js      # Firebase initialization
├── firebase-auth.js        # Authentication service
├── firebase-quiz.js        # Quiz service with AI
├── login.html             # Enhanced login/register
├── test.html              # Quiz interface
└── index.html             # Main page
```

## Next Steps

1. Customize quiz topics in `firebase-quiz.js`
2. Add more user profile fields if needed
3. Implement quiz history page
4. Add email notifications (optional)
5. Deploy to Firebase Hosting

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Test with simple authentication first
4. Check Firestore rules and data structure

Your Firebase-powered quiz website is now ready! 🚀