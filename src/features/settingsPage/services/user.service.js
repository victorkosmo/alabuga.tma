import { get, put } from '@/services/apiService';

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

/**
 * Updates the current user's profile.
 * @param {object} userData - The user data to update.
 * @param {string} userData.first_name - The user's first name.
 * @param {string} [userData.last_name] - The user's last name.
 * @returns {Promise<Object>} The updated user profile.
 */
export const updateMe = async (userData) => {
  const response = await put('/users/me', userData);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Не удалось обновить профиль');
};
