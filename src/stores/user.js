import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getMe, updateMe } from '@/features/settingsPage/services/user.service';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchUser() {
    // Avoid re-fetching if data is already loaded or a fetch is in progress
    if (user.value || loading.value) return;

    loading.value = true;
    error.value = null;
    try {
      user.value = await getMe();
    } catch (err) {
      error.value = err;
      console.error('Failed to fetch user data in store:', err);
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(userData) {
    try {
      const updatedUser = await updateMe(userData);
      // Update the state with the fresh data from the server
      user.value = { ...user.value, ...updatedUser };
      return updatedUser;
    } catch (err) {
      console.error('Failed to update user in store:', err);
      throw err; // Re-throw so the component can handle it
    }
  }

  return { user, loading, error, fetchUser, updateUser };
});
