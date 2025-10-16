import { get } from '@/services/apiService';

/**
 * Fetches all available and locked missions for the current user.
 * @returns {Promise<{available_missions: Array<Object>, locked_missions: Array<Object>}>} An object containing available and locked missions.
 */
export const getAvailableMissions = async () => {
  const response = await get('/missions/available');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось получить доступные миссии');
};

/**
 * Fetches all completed missions for the current user.
 * @returns {Promise<Array<Object>>} A list of completed missions.
 */
export const getCompletedMissions = async () => {
  const response = await get('/missions/completed');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось получить завершенные миссии');
};
