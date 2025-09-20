export class TelegramService {
  constructor() {
    this.webApp = null;
  }

  parseInitData(initData) {
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      return userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
    } catch (e) {
      console.error('Parse error:', e.message);
      return null;
    }
  }

  async loadSDK() {
    if (window.Telegram?.WebApp) {
      return window.Telegram.WebApp;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      
      script.onload = () => {
        if (window.Telegram?.WebApp) {
          resolve(window.Telegram.WebApp);
        } else {
          reject(new Error('Telegram SDK failed to load'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Telegram SDK'));
      };
      
      document.head.appendChild(script);
    });
  }

  async initialize() {
    console.log('[TelegramService] Starting initialization...');
    try {
      console.log('[TelegramService] Loading SDK...');
      this.webApp = await this.loadSDK();
      
      console.log('[TelegramService] Checking environment...');
      console.log('[TelegramService] window.Telegram:', !!window.Telegram);
      console.log('[TelegramService] window.Telegram?.WebApp:', !!window.Telegram?.WebApp);
      
      // Expand the web app to full height
      this.webApp.expand();
      
      // Parse init data
      const user = this.parseInitData(this.webApp.initData);
      
      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('[TelegramService] Initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const telegramService = new TelegramService();

// Export composable function
export function useTelegram() {
  return {
    initializeTelegram: () => telegramService.initialize(),
    getWebApp: () => telegramService.getWebApp(),
    getUser: () => telegramService.getUser(),
    validateAuth: (initData) => telegramService.validateAuth(initData)
  };
}
