// src/services/apiService.js
import axios from 'axios';
import { useTelegramStore } from '../stores/telegram';

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
  (config) => {
    // We need the actual store *instance* which might not be available globally
    // outside of setup functions or components. However, Pinia makes the store
    // accessible fairly globally once setup. Trying direct access:
    try {
        const telegramStore = useTelegramStore(); // Get INSTANCE
        const token = telegramStore.accessToken; // Access token from the telegram store
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (error) {
        // This might happen if the interceptor runs before Pinia is fully initialized.
        // It's less likely with how Pinia/Vue work but possible in edge cases.
        console.warn('[API Interceptor] Could not access telegramStore, proceeding without token.', error.message);
    }
    return config;
  },
  (error) => {
    // Only handle request setup errors here
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
