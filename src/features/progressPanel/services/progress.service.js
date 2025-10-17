import { get } from '@/services/apiService';

/**
 * Fetches user's global competency ratings.
 * @returns {Promise<Array<Object>>} A list of global competencies with user progress.
 */
export const getGlobalCompetencies = async () => {
  const response = await get('/progress/global-competencies');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось получить данные о компетенциях');
};
