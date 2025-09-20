<template>
  <div class="max-w-4xl mx-auto p-8" v-if="loading">
    <div class="text-center">Loading profile...</div>
  </div>
  <div v-else class="max-w-4xl mx-auto p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Profile page</h1>
      <div class="px-4 py-2 rounded-full text-white" :class="telegramStore.isAuthenticated ? 'bg-green-500' : 'bg-red-500'">
        {{ telegramStore.isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8 mb-8" v-if="telegramStore.user">
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-800">User Information</h2>
        <div class="grid gap-4">
          <div class="flex justify-between bg-gray-50 rounded-lg p-3">
            <span class="font-medium text-gray-500">User ID:</span>
            <span class="text-gray-800">{{ telegramStore.user.id }}</span>
          </div>
          <div class="flex justify-between bg-gray-50 rounded-lg p-3">
            <span class="font-medium text-gray-500">First Name:</span>
            <span class="text-gray-800">{{ telegramStore.user.first_name }}</span>
          </div>
          <div class="flex justify-between bg-gray-50 rounded-lg p-3" v-if="telegramStore.user.last_name">
            <span class="font-medium text-gray-500">Last Name:</span>
            <span class="text-gray-800">{{ telegramStore.user.last_name }}</span>
          </div>
          <div class="flex justify-between bg-gray-50 rounded-lg p-3" v-if="telegramStore.user.username">
            <span class="font-medium text-gray-500">Username:</span>
            <span class="text-gray-800">@{{ telegramStore.user.username }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-4">
      <Button asChild>
        <router-link to="/">Home</router-link>
      </Button>
      <Button asChild>
        <router-link to="/info">Additional Info</router-link>
      </Button>
      <Button asChild>
        <router-link to="/telegram-data">Telegram Data</router-link>
      </Button>
    </div>
    
    <div v-if="telegramStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-8">
      {{ telegramStore.error }}
    </div>
  </div>
</template>

<script setup>
import { useTelegramStore } from '../stores/telegram'
import { Button } from '@/components/ui/button'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter

const telegramStore = useTelegramStore()
const loading = ref(true)
const router = useRouter() // Initialize useRouter

watch(() => telegramStore.isInitialized, (initialized) => {
  if (initialized) {
    loading.value = false;
  }
}, { immediate: true })

onMounted(async () => {
  console.log('Profile page mounted', {
    user: telegramStore.user,
    isAuthenticated: telegramStore.isAuthenticated
  })
  
  if (!telegramStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  loading.value = false
})
</script>

