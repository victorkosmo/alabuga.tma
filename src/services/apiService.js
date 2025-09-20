// src/services/apiService.js
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;
if (!VITE_API_URL) {
    console.error("FATAL ERROR: VITE_API_URL is not defined in environment variables (.env)");
    // Consider throwing an error or providing a default to prevent Axios errors
}

const apiClient = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Add a reasonable timeout (e.g., 15 seconds)
});

// Request Interceptor: Add JWT to outgoing requests if available
apiClient.interceptors.request.use(
  async (config) => {
    // Do not add token for auth endpoints like login
    if (config.url?.includes('/auth/login')) {
      return config;
    }

    try {
      // Dynamically import the store to break the circular dependency
      const { useTelegramStore } = await import('../stores/telegram');
      const telegramStore = useTelegramStore();
      const token = telegramStore.accessToken;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[API Interceptor] Could not access telegramStore, proceeding without token.', error.message);
    }
    return config;
  },
  (error) => {
    console.error('[API Interceptor] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Keep it minimal - just basic error logging
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Log API call errors but don't handle 401s automatically here
    if (error.response) {
        console.error(`[API Interceptor] Response Error: ${error.response.status}`, error.response.data || error.message);
    } else if (error.request) {
        console.error('[API Interceptor] No Response Received:', error.request);
    } else {
        console.error('[API Interceptor] Axios Setup Error:', error.message);
    }
    // Let the calling code handle the error (e.g., in the store's action)
    return Promise.reject(error);
  }
);

export default apiClient;
