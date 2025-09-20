<template>
  <!-- Show loading screen until initialization is attempted -->
  <div v-if="!telegramStore.isInitialized" class="flex justify-center items-center min-h-screen bg-gray-100">
    <h1 class="text-2xl font-bold text-gray-700">Initializing...</h1>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { useTelegramStore } from './stores/telegram';
const telegramStore = useTelegramStore();
</script>

