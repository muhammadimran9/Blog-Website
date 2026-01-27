# Quick Start Guide - Quiz System

## The Error You're Seeing

`ERR_CONNECTION_REFUSED` means the backend server is not running. The frontend (test.html) is trying to connect to `http://localhost:3000/api/generate-quiz`, but there's no server listening on that port.

## Solution: Start the Backend Server

### Step 1: Install Dependencies (First Time Only)

Open a terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install:
- express (web server)
- cors (cross-origin support)
- groq-sdk (AI integration)
- dotenv (environment variables)

### Step 2: Start the Server

After dependencies are installed, start the server:

**Option A: Using npm**
```bash
npm start
```

**Option B: Using Node directly**
```bash
node server.js
```

**Option C: Using the batch file (Windows)**
Double-click `start-server.bat`

### Step 3: Verify Server is Running

You should see:
```
Server is running on http://localhost:3000
Quiz API endpoint: http://localhost:3000/api/generate-quiz
```

### Step 4: Test the Quiz

1. Keep the server running (don't close the terminal)
2. Open your browser
3. Navigate to `test.html` (or `http://localhost:3000/test.html` if using the server)
4. Select a domain and difficulty
5. The quiz should generate!

## Troubleshooting

### "Cannot find module" error
- Run `npm install` first

### "Port 3000 already in use"
- Another application is using port 3000
- Change PORT in `.env` file to a different number (e.g., 3001)
- Update API_URL in test.html to match

### "GROQ_API_KEY is not defined"
- Make sure `.env` file exists in the project root
- Check that it contains: `GROQ_API_KEY=your_groq_api_key_here`

### Server starts but quiz doesn't generate
- Check the terminal for error messages
- Verify the API key is correct
- Make sure you have internet connection (Groq API needs internet)

## Important Notes

- **Keep the server running** while using the quiz
- The server must be running for the quiz to work
- If you close the terminal, the server stops
- For production, use a process manager like PM2

## Development Mode (Auto-restart)

For development with auto-restart on file changes:
```bash
npm run dev
```

(Requires nodemon: `npm install -g nodemon`)
