<template>
  <div class="max-w-4xl mx-auto p-8 text-center">
    <h1 class="text-3xl font-bold text-red-500">Application Error</h1>
    <div class="bg-red-50 border border-red-500 text-red-700 rounded-xl p-8 mt-8 text-left">
      <h2 class="text-2xl font-semibold mb-4">An error occurred during initialization.</h2>
      
      <div class="mb-4">
        <p class="font-bold mb-1">Message:</p>
        <p class="break-all">{{ message }}</p>
      </div>

      <div>
        <p class="font-bold mb-1">Details / Stack Trace:</p>
        <pre class="bg-red-100 p-4 rounded-lg break-all whitespace-pre-wrap">{{ stack }}</pre>
      </div>
    </div>
    <Button class="mt-8" @click="retry">Retry Initialization</Button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTelegramStore } from '../stores/telegram';
import { Button } from '@/components/ui/button'

const route = useRoute();
const telegramStore = useTelegramStore();

const message = computed(() => route.query.message || 'No error message provided.');
const stack = computed(() => route.query.stack || 'No stack trace available.');

const retry = () => {
  // The logout action already handles clearing state and reloading the app.
  telegramStore.logout();
};
</script>

