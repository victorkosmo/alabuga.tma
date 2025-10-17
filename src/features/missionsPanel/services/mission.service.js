import { get } from '@/services/apiService';

/**
 * Fetches all available and locked missions for the current user, grouped by campaign.
 * @returns {Promise<Array<Object>>} A list of objects, where each object represents a campaign and contains its missions.
 */
export const getAvailableMissions = async () => {
  const response = await get('/missions/available');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось получить доступные миссии');
};

/**
 * Fetches all completed missions for the current user, grouped by campaign.
 * @returns {Promise<Array<Object>>} A list of objects, where each object represents a campaign and contains its completed missions.
 */
export const getCompletedMissions = async () => {
  const response = await get('/missions/completed');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось получить завершенные миссии');
};
