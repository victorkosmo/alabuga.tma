// src/stores/telegram.js
import { defineStore } from 'pinia';
import { telegramService } from '../services/telegramService';
import apiClient from '../services/apiService';
import router from '../router'; // <-- IMPORT THE ROUTER INSTANCE

const STORE_KEY_ACCESS_TOKEN = 'tma_accessToken';

export const useTelegramStore = defineStore('telegram', {
  state: () => ({
    tgUser: null,
    rawInitData: null,
    accessToken: localStorage.getItem(STORE_KEY_ACCESS_TOKEN) || null,
    isInitialized: false, // Tracks completion of the entire init process
    error: null,
    initializationPromise: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async initialize() {
      if (this.initializationPromise) {
        return this.initializationPromise;
      }
      if (this.isInitialized) {
        return;
      }

      this.initializationPromise = (async () => {
        try {
          // --- Development Mode ---
          if (import.meta.env.VITE_ENV === 'development') {
            this.tgUser = { id: 12345, first_name: 'Dev', username: 'dev_user' };
            this.rawInitData = 'dev_mock_init_data';
            this.setToken('dev-mock-jwt-token');
            this.isInitialized = true;
            return;
          }

          // --- Production Mode ---
          // 1. Initialize Telegram SDK
          const sdkResult = await telegramService.initialize();
          if (!sdkResult.success || !telegramService.webApp?.initData) {
            throw new Error(sdkResult.error || 'Telegram SDK failed or initData is missing.');
          }
          this.tgUser = sdkResult.user;
          this.rawInitData = telegramService.webApp.initData;

          // 2. Authenticate with Backend
          const response = await apiClient.post('/auth/login', { initData: this.rawInitData });

          if (response.data?.success && response.data?.data?.access) {
            this.setToken(response.data.data.access);
          } else {
            throw new Error(response.data?.message || 'Backend authentication failed.');
          }

        } catch (error) {
          // --- THIS IS THE MODIFIED BLOCK ---
          const VITE_API_URL = import.meta.env.VITE_API_URL;
          let detailedMessage = `Original error: ${error.message}.`;

          if (error.message === 'Network Error') {
            detailedMessage = `A "Network Error" occurred. This means the frontend application could not contact the backend server. This is almost always a backend CORS issue.\n\n`;
            detailedMessage += `Frontend Origin: ${window.location.origin}\n`;
            detailedMessage += `Backend URL Target: ${VITE_API_URL || 'VITE_API_URL IS NOT SET in your frontend environment!'}\n\n`;
            detailedMessage += `ACTION REQUIRED: On your backend server, you MUST configure CORS to allow requests from your frontend's origin.`;
          }
          
          const enhancedError = new Error(detailedMessage);
          enhancedError.stack = error.stack;
          this.error = enhancedError; // Keep for state-tracking

          // Redirect to the dedicated error page
          router.push({
            name: 'error',
            query: {
              message: enhancedError.message,
              stack: enhancedError.stack || 'No stack trace available.'
            }
          });
          // --- END OF MODIFIED BLOCK ---
        } finally {
          this.isInitialized = true; // Mark as "done" even on failure
          this.initializationPromise = null;
        }
      })();

      return this.initializationPromise;
    },

    setToken(token) {
      this.accessToken = token;
      localStorage.setItem(STORE_KEY_ACCESS_TOKEN, token);
    },

    clearToken() {
      this.accessToken = null;
      localStorage.removeItem(STORE_KEY_ACCESS_TOKEN);
    },

    logout() {
      this.clearToken();
      this.tgUser = null;
      this.rawInitData = null;
      this.isInitialized = false;
      this.error = null;
      // Navigate to home before reloading to ensure a clean retry
      router.push('/').then(() => {
        window.location.reload();
      });
    },
  }
});
