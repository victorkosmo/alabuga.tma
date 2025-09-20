<template>
    <div class="max-w-4xl mx-auto p-8 border border-gray-200 rounded-xl bg-gray-50 mt-8">
      <h1 class="text-3xl font-bold text-center mb-8">Check User Status</h1>
  
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 class="text-lg font-semibold text-blue-800 mb-2">Current Auth Token</h2>
        <p class="text-sm text-gray-600 mb-2">This is the token being sent to the backend. If it looks incorrect (e.g., "[object Object]"), the backend login response format may differ from what the frontend expects.</p>
        <pre class="bg-white p-3 rounded border border-dashed border-gray-300 text-sm break-all whitespace-pre-wrap">{{ telegramStore.accessToken || 'No token found' }}</pre>
      </div>

      <div class="mt-8">
        <div v-if="loading" class="bg-gray-200 p-6 rounded-lg text-gray-700 text-center">
          Loading user data...
        </div>
        <div v-else-if="error" class="bg-red-50 border border-red-500 text-red-700 p-6 rounded-lg">
          Error: {{ error }}
        </div>
        <div v-else-if="userData" class="bg-green-50 border border-green-500 text-green-700 p-6 rounded-lg">
          <p class="mb-4 font-bold">Successfully fetched user data:</p>
          <pre class="bg-white p-4 rounded-lg border border-dashed border-gray-300 overflow-x-auto whitespace-pre-wrap">{{ userData }}</pre>
          <p class="mt-4">Your internal User ID (UUID): <strong>{{ userData.id }}</strong></p>
        </div>
        <div v-else class="text-center text-gray-600 p-6">
            Waiting to fetch data...
        </div>
      </div>
  
      <div class="mt-8">
        <Button @click="fetchUserData" :disabled="loading" class="w-full">
          {{ loading ? 'Fetching...' : 'Fetch /auth/me' }}
        </Button>
      </div>
  
      <div class="mt-4">
        <Button asChild variant="outline" class="w-full">
          <router-link to="/">Go Home</router-link>
        </Button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import apiClient from '../services/apiService'; // Your configured Axios instance
  import { Button } from '@/components/ui/button'
  import { useTelegramStore } from '../stores/telegram';
  
  const telegramStore = useTelegramStore();
  
  const userData = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchUserData = async () => {
    loading.value = true;
    error.value = null;
    userData.value = null; // Clear previous data
  
    try {
      // apiClient already includes the Authorization header via interceptor
      const response = await apiClient.get('/users/me');
  
      // The backend's /users/me endpoint returns the user data directly under response.data.data
      if (response.data?.data) {
        userData.value = response.data.data; // Store { id: '...', tg_id: ... }
      } else {
        // Handle cases where API call succeeded but data indicates failure
        throw new Error(response.data?.message || 'Failed to get user data from response.');
      }
    } catch (err) {
      // Error could be from network, 401 (handled by interceptor logout), 404, 500 etc.
      console.error('Error fetching /auth/me:', err.response?.data || err.message || err);
      error.value = err.response?.data?.message || err.message || 'Could not fetch user data.';
      // If the error was 401, the interceptor should have already logged the user out
      // and the router guard will redirect them away from this page soon.
    } finally {
      loading.value = false;
    }
  };
  
  // Optionally fetch data automatically when the component loads
  // import { onMounted } from 'vue';
  // onMounted(() => {
  //   fetchUserData();
  // });
  
  </script>
  
  <style scoped>
  /* All styles moved to Tailwind classes in the template */
  </style>
