<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold">Home Page</h1>
    <p class="mt-4">Welcome, Telegram User ID: {{ telegramStore.tgUser?.id }}</p>

    <nav class="mt-8 flex flex-col gap-4">
      <Button asChild class="w-full">
        <router-link to="/profile">View Profile (TG Data)</router-link>
      </Button>
      <Button asChild class="w-full">
        <router-link to="/check-me">Check Backend User (/me)</router-link>
      </Button>
    </nav>

    <div v-if="telegramStore.error" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      Error: {{ telegramStore.error }}
    </div>
  </div>
</template>

<script setup>
import { useTelegramStore } from '../stores/telegram'
import { onMounted } from 'vue'
import { Button } from '@/components/ui/button'

const telegramStore = useTelegramStore()

onMounted(() => {
  console.log('Home page mounted', {
    user: telegramStore.user,
    isAuthenticated: telegramStore.isAuthenticated
  })
})
</script>

