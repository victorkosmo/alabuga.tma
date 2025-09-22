<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto pb-20">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center shadow-inner">
      <router-link
        v-for="item in navConfig"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center text-gray-500 w-full h-full transition-colors duration-200 ease-in-out"
        active-class="text-blue-600"
      >
        <component :is="item.icon" class="h-6 w-6 mb-1" />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { navConfig } from './navConfig.js';
</script>
