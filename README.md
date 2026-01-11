# Oh Mochi AI

**Oh Mochi AI** is a full-stack chatbot application that integrates Google's Gemini AI with a modern React frontend and a secure Spring Boot backend. It features real-time chat capabilities and Google OAuth2 authentication.

## 🚀 Features

* **AI Chatbot**: Real-time conversation powered by Google's Gemini 2.5 Flash model.
* **Secure Authentication**: User login via Google OAuth2.
* **Modern UI**: Built with React, Tailwind CSS, and shadcn-ui for a responsive and accessible design.
* **Robust Backend**: Spring Boot service handling API requests, security, and AI model integration.

## 🛠️ Tech Stack

### Frontend

* **Framework**: React (Vite)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Components**: shadcn-ui, Radix UI, Lucide React
* **State/Data**: React Query (TanStack Query)

### Backend

* **Framework**: Spring Boot 2.7.13
* **Language**: Java 11
* **Security**: Spring Security Oauth2 Client
* **Build Tool**: Maven
* **AI Integration**: Google Gemini API

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

* **Node.js** & **npm** (for the frontend)
* **Java 11** JDK (for the backend)
* **Git**

You will also need keys from the [Google Cloud Console](https://console.cloud.google.com/):

1. **Google OAuth Credentials** (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)
2. **Gemini API Key** (`GEMINI_API_KEY`)

---

## ⚙️ Installation & Setup

### 1. Backend Setup (Spring Boot)

The backend runs on port `8081`.

1. Navigate to the backend directory:
```bash
cd gemini-chatbot-backend-main/gemini-chatbot

```

2. **Configure Environment Variables**:
You need to set the following environment variables. You can set these in your IDE run configuration or export them in your terminal before running the app.
* `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
* `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
* `GEMINI_API_KEY`: Your Google Gemini API key.
* `FRONTEND_URL`: `http://localhost:8080` (Default)

**Important**: Ensure your Google OAuth redirect URI in the Cloud Console is set to:
`http://localhost:8081/login/oauth2/code/google`
3. Run the application:
```bash
# Using the Maven wrapper (Linux/macOS)
./mvnw spring-boot:run -DskipTests

# Using the Maven wrapper (Windows)
./mvnw.cmd spring-boot:run -DskipTests

```

### 2. Frontend Setup (React + Vite)

The frontend runs on port `8080` (default for Vite if available, otherwise it may increment).

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend

```

2. Install dependencies:
```bash
npm install

```

3. Start the development server:
```bash
npm run dev

```

---

## 🔌 API Endpoints

The backend exposes the following endpoints (Base URL: `http://localhost:8081`):

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/chat/health` | Checks if the backend service is up. |
| `POST` | `/api/chat/message` | Sends a message to Gemini. Body: `{ "message": "..." }` |
| `GET` | `/api/chat/user` | Checks current user authentication status. |
| `GET` | `/oauth2/authorization/google` | Initiates Google Login flow. |

---

## 🐛 Troubleshooting

* **CORS Errors**:
* Ensure your frontend request includes `credentials: 'include'` (fetch) or `withCredentials: true` (axios).
* Verify the backend is running on port `8081` and the frontend on `8080`.

* **500 Internal Server Errors**:
* Check your backend console logs.
* Verify that `GEMINI_API_KEY` is valid and has quota available.

* **Login Not Working**:
* Double-check the **Redirect URI** in your Google Cloud Console matches `http://localhost:8081/login/oauth2/code/google`.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
