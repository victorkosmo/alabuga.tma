import { get } from '@/services/apiService';

/**
 * Fetches all available store items for the current user.
 * @returns {Promise<Array<Object>>} A list of available store items.
 */
export const getAvailableStoreItems = async () => {
  const response = await get('/telegram/store/available');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch store items');
};
