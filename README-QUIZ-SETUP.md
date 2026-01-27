# Quiz System Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Setup Steps

### 1. Install Dependencies
Open terminal in the project directory and run:
```bash
npm install
```

### 2. Create Environment File
Create a file named `.env` in the root directory with the following content:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

### 3. Start the Server
Run the following command:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Access the Quiz Page
Open your browser and navigate to:
```
http://localhost:3000/test.html
```

Or if you're using a local file server, make sure the backend is running and update the API_URL in test.html if needed.

## API Endpoints

- `POST /api/generate-quiz` - Generate a quiz based on domain and difficulty
  - Body: `{ "domain": "Web Development", "difficulty": "Intermediate" }`
  - Returns: `{ "questions": [...] }`

- `GET /api/health` - Health check endpoint

## Troubleshooting

1. **Port already in use**: Change the PORT in `.env` file
2. **API key error**: Verify the GROQ_API_KEY in `.env` file
3. **CORS errors**: Make sure the server is running and accessible
4. **Quiz not generating**: Check server logs for error messages

## Notes

- The API key is stored securely in `.env` file (not exposed to frontend)
- The server serves static files from the current directory
- CORS is enabled for cross-origin requests
- The quiz generates 8-10 questions based on domain and difficulty
