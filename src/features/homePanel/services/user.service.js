import { get } from '@/services/apiService';

/**
 * Fetches the current authenticated user's profile.
 * @returns {Promise<Object>} The user data from the API.
 */
export const getMe = async () => {
  const response = await get('/users/me');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось загрузить профиль пользователя');
};
