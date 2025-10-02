<template>
  <!-- Show loading screen until initialization is attempted -->
  <AppLoader v-if="!telegramStore.isInitialized" />
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { useTelegramStore } from './stores/telegram';
import AppLoader from './layouts/components/AppLoader.vue';

const telegramStore = useTelegramStore();
</script>

