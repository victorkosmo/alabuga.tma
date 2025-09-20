<template>
  <div class="mx-auto max-w-4xl p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Application Information</h1>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="w-2 h-2 rounded-full" :class="telegramStore.isAuthenticated ? 'bg-green-500' : 'bg-red-500'"></span>
        {{ telegramStore.isAuthenticated ? 'Active Session' : 'No Active Session' }}
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8">
      <div v-if="telegramStore.user" class="text-center mb-8 pb-4 border-b border-gray-200">
        <h2 class="text-2xl font-semibold">Welcome, {{ telegramStore.user.first_name }}!</h2>
        <p class="text-gray-500 font-mono">Your Telegram ID: {{ telegramStore.user.id }}</p>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">About This App</h3>
        <p class="mb-4">This is a Telegram Web App built with:</p>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <li class="bg-gray-50 rounded-lg p-4 text-center">Vue 3 + Vite</li>
          <li class="bg-gray-50 rounded-lg p-4 text-center">Pinia for State Management</li>
          <li class="bg-gray-50 rounded-lg p-4 text-center">Vue Router for Navigation</li>
          <li class="bg-gray-50 rounded-lg p-4 text-center">Telegram Bot API Integration</li>
        </ul>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-xl font-semibold mb-4">Current State</h3>
        <div class="grid gap-4">
          <div class="flex justify-between bg-white rounded-lg p-2">
            <span class="font-medium text-gray-500">Initialized:</span>
            <span class="font-mono">{{ telegramStore.isInitialized }}</span>
          </div>
          <div class="flex justify-between bg-white rounded-lg p-2">
            <span class="font-medium text-gray-500">Authenticated:</span>
            <span class="font-mono">{{ telegramStore.isAuthenticated }}</span>
          </div>
          <div class="flex justify-between bg-white rounded-lg p-2">
            <span class="font-medium text-gray-500">Has User Data:</span>
            <span class="font-mono">{{ !!telegramStore.user }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-4 mt-8">
      <Button asChild>
        <router-link to="/">Home</router-link>
      </Button>
      <Button asChild>
        <router-link to="/profile">Back to Profile</router-link>
      </Button>
    </div>

    <div v-if="telegramStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-8">
      <h3 class="font-bold text-lg mb-2">Error Information</h3>
      <p>{{ telegramStore.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { useTelegramStore } from '../stores/telegram'
import { Button } from '@/components/ui/button'
import { onMounted } from 'vue'

const telegramStore = useTelegramStore()

onMounted(() => {
  console.log('Info page mounted', {
    user: telegramStore.user,
    isAuthenticated: telegramStore.isAuthenticated
  })
})
</script>

