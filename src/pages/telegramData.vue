<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Telegram Raw Data</h1>
    
    <div class="mb-8 bg-gray-50 rounded-lg p-4">
      <h2 class="text-2xl font-semibold mb-4">WebApp Object</h2>
      <pre class="bg-white p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{{ webAppData }}</pre>
    </div>

    <div class="mb-8 bg-gray-50 rounded-lg p-4">
      <h2 class="text-2xl font-semibold mb-4">Init Data</h2>
      <pre class="bg-white p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{{ initData }}</pre>
    </div>

    <div class="mb-8 bg-gray-50 rounded-lg p-4">
      <h2 class="text-2xl font-semibold mb-4">User Object</h2>
      <pre class="bg-white p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{{ userData }}</pre>
    </div>

    <div class="flex justify-center">
      <Button asChild>
        <router-link to="/profile">Back to Profile</router-link>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTelegramStore } from '../stores/telegram'
import { telegramService } from '../services/telegramService'
import { Button } from '@/components/ui/button'

const telegramStore = useTelegramStore()
const webAppData = ref(null)
const initData = ref(null)
const userData = ref(null)

onMounted(async () => {
  try {
    if (import.meta.env.DEV) {
      // DEV mode mock data
      webAppData.value = JSON.stringify({
        initData: 'mock_init_data',
        platform: 'web',
        version: '6.9',
        colorScheme: 'dark',
        isExpanded: true,
        viewportHeight: 600,
        viewportStableHeight: 600,
        headerColor: '#123456',
        backgroundColor: '#654321',
        isClosingConfirmationEnabled: false,
        MainButton: {
          text: 'Mock Button',
          color: '#FF0000',
          isVisible: true
        }
      }, null, 2);
      
      initData.value = JSON.stringify({
        user: JSON.stringify({
          id: 123456789,
          first_name: 'DEV',
          last_name: 'User',
          username: 'dev_user',
          language_code: 'en'
        }),
        auth_date: '1704672000',
        hash: 'mock_hash_value'
      }, null, 2);
      
      userData.value = JSON.stringify({
        id: 123456789,
        first_name: 'DEV',
        last_name: 'User',
        username: 'dev_user',
        language_code: 'en',
        is_premium: true,
        photo_url: 'https://example.com/photo.jpg'
      }, null, 2);
    } else {
      // Production mode - real data
      webAppData.value = telegramService.webApp ? 
        JSON.stringify(telegramService.webApp, null, 2) : 
        'WebApp object not available';
        
      initData.value = telegramService.webApp?.initData ?
        JSON.stringify(new URLSearchParams(telegramService.webApp.initData), null, 2) :
        'Init data not available';
        
      userData.value = telegramStore.user ?
        JSON.stringify(telegramStore.user, null, 2) :
        'User data not available';
    }
  } catch (error) {
    console.error('Error getting Telegram data:', error)
  }
})
</script>

