import { put } from '@/services/apiService';

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
