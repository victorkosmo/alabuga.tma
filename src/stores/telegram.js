// src/stores/telegram.js
import { defineStore } from 'pinia';
import { telegramService } from '../services/telegramService';
import { unauthorizedPost } from '../services/apiService';
import router from '../router';

const STORE_KEY_ACCESS_TOKEN = 'tma_accessToken';

export const useTelegramStore = defineStore('telegram', {
  state: () => ({
    tgUser: null,
    rawInitData: null,
    accessToken: localStorage.getItem(STORE_KEY_ACCESS_TOKEN) || null,
    isInitialized: false,
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
          let authResponse;
          const isDev = import.meta.env.VITE_ENV === 'development';

          if (isDev) {
            // In dev mode, we authenticate directly with a dev-specific endpoint.
            // This bypasses the Telegram SDK and uses a pre-configured dev user on the backend.
            console.log('[Store] Development mode: Authenticating as dev user...');
            authResponse = await unauthorizedPost('/auth/login-dev');

            if (authResponse?.data?.success) {
              // The user object is expected in the dev login response.
              this.tgUser = authResponse.data.data.user;
              this.rawInitData = 'development-mode';
            }
          } else {
            // Production Mode: Standard Telegram Web App flow.
            // 1. Initialize Telegram SDK.
            const sdkResult = await telegramService.initialize();
            if (!sdkResult.success || !telegramService.webApp?.initData) {
              throw new Error(sdkResult.error || 'Telegram SDK failed or initData is missing.');
            }
            this.tgUser = sdkResult.user;
            this.rawInitData = telegramService.webApp.initData;

            // 2. Authenticate with Backend using initData.
            authResponse = await unauthorizedPost('/auth/login', {
              initData: this.rawInitData
            });
          }

          // 3. Common: Process authentication response and set token.
          if (authResponse?.data?.success && authResponse?.data?.data?.access) {
            this.setToken(authResponse.data.data.access);
          } else {
            const failureReason = authResponse?.data?.message || 'Backend authentication failed.';
            const mode = isDev ? 'dev ' : '';
            throw new Error(`Backend ${mode}authentication failed: ${failureReason}`);
          }

        } catch (error) {
          const VITE_API_URL = import.meta.env.VITE_API_URL;
          let detailedMessage = `Original error: ${error.message}.`;

          if (error.message === 'Network Error') {
            detailedMessage = `A "Network Error" occurred. This means the frontend application could not contact the backend server.\n\n`;
            detailedMessage += `Frontend Origin: ${window.location.origin}\n`;
            detailedMessage += `Backend URL Target: ${VITE_API_URL || 'VITE_API_URL IS NOT SET!'}\n\n`;
            detailedMessage += `ACTION REQUIRED: Ensure the backend is running and CORS is configured correctly.`;
          }
          
          const enhancedError = new Error(detailedMessage);
          enhancedError.stack = error.stack;
          this.error = enhancedError;

          router.push({
            name: 'error',
            query: {
              message: enhancedError.message,
              stack: enhancedError.stack || 'No stack trace available.'
            }
          });
        } finally {
          this.isInitialized = true;
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
      router.push('/').then(() => {
        window.location.reload();
      });
    },
  }
});
