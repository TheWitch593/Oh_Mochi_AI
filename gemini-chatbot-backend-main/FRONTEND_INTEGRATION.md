# Frontend Integration Guide

## Backend Configuration

Your backend is running on: **http://localhost:8081**

## API Endpoints

### 1. Health Check
```
GET http://localhost:8081/api/chat/health
```
Response:
```json
{
  "status": "UP",
  "service": "Oh_Mochi_AI Backend"
}
```

### 2. Send Chat Message
```
POST http://localhost:8081/api/chat/message
Content-Type: application/json

{
  "message": "Your message here"
}
```
Response:
```json
{
  "response": "AI response from Gemini",
  "userName": "Anonymous",
  "timestamp": 1704931200000
}
```

### 3. Get User Info
```
GET http://localhost:8081/api/chat/user
```
Response (when not logged in):
```json
{
  "authenticated": false
}
```

### 4. Google OAuth Login
```
Redirect to: http://localhost:8081/oauth2/authorization/google
```

## Frontend Code Example (Vite + React)

### Using Fetch API

```javascript
// In your frontend (port 8080)
const API_BASE_URL = 'http://localhost:8081';

// Send a chat message
async function sendMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies/sessions
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Check user authentication
async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/user`, {
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error checking auth:', error);
    return { authenticated: false };
  }
}

// Login with Google
function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
}
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Send message
const sendMessage = async (message) => {
  const response = await api.post('/api/chat/message', { message });
  return response.data;
};

// Get user
const getUser = async () => {
  const response = await api.get('/api/chat/user');
  return response.data;
};
```

## CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:8080` (your Vite frontend)
- `http://localhost:3000`
- GitHub Codespaces URLs

**Important:** Always include `credentials: 'include'` or `withCredentials: true` in your requests for cookie-based sessions.

## Starting the Backend

```bash
cd /workspaces/gemini-chatbot-backend/gemini-chatbot
./mvnw spring-boot:run -DskipTests
```

The backend will start on port 8081.

## Environment Variables Required

Make sure these are set:
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `GEMINI_API_KEY` - Your Google Gemini API key
- `FRONTEND_URL` - Your frontend URL (default: http://localhost:8080)

## Troubleshooting

### CORS Errors
- Ensure you're using `credentials: 'include'` in fetch requests
- Check that your frontend is running on port 8080
- Verify the backend console shows CORS filter in the security chain

### 500 Errors
- Check if Gemini API quota is exceeded
- Verify environment variables are set
- Check backend logs for detailed error messages

### Authentication Issues
- Make sure cookies are enabled
- Check that Google OAuth redirect URI is set to: `http://localhost:8081/login/oauth2/code/google`
- Verify Google Cloud Console has the correct redirect URIs configured
