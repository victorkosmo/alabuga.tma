import { get, post } from '@/services/apiService';

/**
 * Fetches details for a specific campaign.
 * @param {string} campaignId - The ID of the campaign.
 * @returns {Promise<Object>} The campaign data.
 */
export const getCampaignById = async (campaignId) => {
  const response = await get(`/campaigns/${campaignId}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch campaign details');
};


/**
 * Fetches missions for a specific campaign.
 * @param {string} campaignId - The ID of the campaign.
 * @returns {Promise<Array<Object>>} The list of missions.
 */
export const getCampaignMissions = async (campaignId) => {
  const response = await get(`/campaigns/${campaignId}/missions`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch campaign missions');
};

/**
 * Fetches user's earned achievements for a specific campaign.
 * @param {string} campaignId - The ID of the campaign.
 * @returns {Promise<Array<Object>>} The list of earned achievements.
 */
export const getUserCampaignAchievements = async (campaignId) => {
  const response = await get(`/campaigns/${campaignId}/achievements`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch user achievements');
};
