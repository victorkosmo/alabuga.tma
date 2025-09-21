// src/utils/toast.js
import { telegramService } from '../services/telegramService';

// Use Telegram's native notifications if available, fallback to console
export const successMessage = (message) => {
  if (telegramService.webApp?.showAlert) {
    telegramService.webApp.showAlert(message);
  } else {
    console.log('[SUCCESS]', message);
  }
};

export const errorMessage = (message) => {
  if (telegramService.webApp?.showAlert) {
    telegramService.webApp.showAlert(`Error: ${message}`);
  } else {
    console.error('[ERROR]', message);
  }
};

export const warningMessage = (message) => {
  if (telegramService.webApp?.showAlert) {
    telegramService.webApp.showAlert(`Warning: ${message}`);
  } else {
    console.warn('[WARNING]', message);
  }
};