import { get, post } from '@/services/apiService';

/**
 * Fetches details for a specific mission within a campaign.
 * @param {string} campaignId - The ID of the campaign.
 * @param {string} missionId - The ID of the mission.
 * @returns {Promise<Object>} The mission data.
 */
export const getMissionById = async (campaignId, missionId) => {
  const response = await get(`/campaigns/${campaignId}/missions/${missionId}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось получить детали миссии');
};

/**
 * Submits a URL for a manual review mission.
 * @param {string} missionId - The ID of the mission.
 * @param {string} submissionUrl - The URL being submitted.
 * @returns {Promise<Object>} The completion data.
 */
export const submitUrlCompletion = async (missionId, submissionUrl) => {
  const response = await post('/completions/submit-url', {
    mission_id: missionId,
    submission_url: submissionUrl,
  });
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось отправить URL');
};

/**
 * Submits answers for a quiz mission.
 * @param {string} missionId - The ID of the mission.
 * @param {Array<{question_index: number, answer_index: number}>} answers - The user's answers.
 * @returns {Promise<Object>} The quiz result.
 */
export const submitQuizCompletion = async (missionId, answers) => {
  const response = await post('/completions/submit-quiz', {
    mission_id: missionId,
    answers: answers,
  });
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось отправить ответы на квиз');
};
