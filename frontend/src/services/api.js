// API Service for Oh Mochi AI
// This handles all communication with the backend

// Use your NEW Backend URL (from Port 8081)
const API_URL = import.meta.env.VITE_API_URL || 'https://obscure-trout-r9r75vxr74hpxqq-8081.app.github.dev';

export const api = {
  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/api/chat/health`);
      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Login with Google OAuth
  login() {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  },

  // Logout
  logout() {
    window.location.href = `${API_URL}/logout`;
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/api/chat/user`, {
        credentials: 'include', // IMPORTANT: Send cookies for auth
      });
      
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      
      return response.json();
    } catch (error) {
      console.error('Get user failed:', error);
      throw error;
    }
  },

  // Send chat message
  async sendMessage(message, conversationId = null) {
    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: Send cookies for auth
        body: JSON.stringify({
          message,
          conversationId
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('UNAUTHORIZED');
        }
        throw new Error('Failed to send message');
      }

      return response.json();
    } catch (error) {
      console.error('Send message failed:', error);
      throw error;
    }
  }
};

export default api;