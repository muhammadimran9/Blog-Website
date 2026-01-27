# Email Configuration Setup

## Required Environment Variables

Add the following to your `.env` file:

```env
# Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Server Port
PORT=3000

# Session Secret (change this to a random string in production)
SESSION_SECRET=your-super-secret-session-key-change-this

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS` (not your regular Gmail password)

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### Custom SMTP
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## Testing Email

After setting up, restart your server and complete a quiz. The results will be automatically emailed to the user's registered email address.

## Troubleshooting

- **"Invalid login"**: Check your email and app password
- **"Connection timeout"**: Verify EMAIL_HOST and EMAIL_PORT
- **"Authentication failed"**: Make sure you're using an app password, not your regular password
- **No emails received**: Check spam folder, verify email address is correct
