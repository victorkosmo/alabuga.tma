// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("FATAL ERROR: VITE_API_URL is not defined in environment variables");
}

// Create separate instances to avoid interceptor conflicts
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const unauthorizedInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Token refresh queue management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add auth token
apiInstance.interceptors.request.use(
  async (config) => {
    try {
      // Dynamically import store to avoid circular dependency
      const { useTelegramStore } = await import('../stores/telegram');
      const telegramStore = useTelegramStore();
      const token = telegramStore.accessToken;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[API] Could not access token:', error.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh and errors
apiInstance.interceptors.response.use(
  (response) => {
    // Handle 204 No Content responses
    if (response.status === 204) {
      return { success: true, status: 204, data: null };
    }
    // Return the full response data structure
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors - token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/login-dev')) { // Added for dev login
        return handleErrorResponse(error);
      }

      if (isRefreshing) {
        // Queue request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using TMA init data or dev login
        const { useTelegramStore } = await import('../stores/telegram');
        const telegramStore = useTelegramStore();
        
        const newToken = await refreshTMAToken(telegramStore);
        
        processQueue(null, newToken);
        
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Logout and redirect on refresh failure
        const { useTelegramStore } = await import('../stores/telegram');
        const telegramStore = useTelegramStore();
        telegramStore.logout();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return handleErrorResponse(error);
  }
);

// TMA-specific token refresh using initData or dev-login
async function refreshTMAToken(telegramStore) {
  try {
    let response;
    const isDev = import.meta.env.VITE_ENV === 'development';

    if (isDev) {
      console.log('[API] Refreshing token in dev mode...');
      response = await unauthorizedInstance.post('/auth/login-dev');
    } else {
      // Production mode refresh
      const { telegramService } = await import('./telegramService');
      if (!telegramService.webApp?.initData) {
        throw new Error("No Telegram initData available for refresh");
      }
      response = await unauthorizedInstance.post('/auth/login', {
        initData: telegramService.webApp.initData
      });
    }

    if (response.data?.success && response.data?.data?.access) {
      const newToken = response.data.data.access;
      telegramStore.setToken(newToken);
      
      // In dev mode, the user object might be sent back as well
      if (isDev && response.data.data.user) {
        telegramStore.tgUser = response.data.data.user;
      }
      return newToken;
    } else {
      const endpoint = isDev ? '/auth/login-dev' : '/auth/login';
      throw new Error(`Invalid response from ${endpoint} during refresh`);
    }
  } catch (error) {
    console.error('[API] Token refresh failed:', error);
    throw error;
  }
}

// Handle error responses
function handleErrorResponse(error) {
  const { response } = error;
  
  let errorMsg = 'An unexpected error occurred';
  
  if (response?.data?.error?.message) {
    errorMsg = response.data.error.message;
  } else if (response?.data?.detail) {
    errorMsg = response.data.detail;
    if (Array.isArray(errorMsg) && errorMsg[0]?.msg) {
      errorMsg = errorMsg[0].msg;
    }
  } else if (response?.data?.message) {
    errorMsg = response.data.message;
  } else if (!response) {
    errorMsg = "Network error. Please check your connection.";
  }

  // Import toast dynamically to show error
  import('../utils/toast').then(({ errorMessage }) => {
    errorMessage(typeof errorMsg === 'string' ? errorMsg : "An error occurred");
  }).catch(() => {
    console.error('[API] Error message:', errorMsg);
  });

  return Promise.reject(error);
}

// Unauthorized instance response interceptor
unauthorizedInstance.interceptors.response.use(
  (response) => response,
  (error) => handleErrorResponse(error)
);

// Export the default client
export default apiInstance;

// Export API methods with same interface as web frontend
export const get = (url, options = {}) => apiInstance.get(url, options);
export const post = (url, data, options = {}) => apiInstance.post(url, data, options);
export const put = (url, data, options = {}) => apiInstance.put(url, data, options);
export const patch = (url, data, options = {}) => apiInstance.patch(url, data, options);
export const remove = (url, options = {}) => apiInstance.delete(url, options);

// Unauthorized methods for auth endpoints
export const unauthorizedGet = (url, options = {}) => unauthorizedInstance.get(url, options);
export const unauthorizedPost = (url, data, options = {}) => unauthorizedInstance.post(url, data, options);
