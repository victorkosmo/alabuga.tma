import { get, post } from '@/services/apiService';

/**
 * Fetches the current user's campaigns.
 * @returns {Promise<Array<Object>>} The user's campaigns.
 */
export const getCampaigns = async () => {
  const response = await get('/campaigns');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось загрузить кампании');
};

/**
 * Joins a campaign using an activation code.
 * @param {string} activationCode - The 6-digit activation code.
 * @returns {Promise<Object>} The newly joined campaign data.
 */
export const joinCampaign = async (activationCode) => {
  const response = await post('/campaigns/join', { activation_code: activationCode });
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось присоединиться к кампании');
};
