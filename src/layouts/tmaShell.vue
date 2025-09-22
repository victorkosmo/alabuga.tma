<template>
  <div class="flex flex-col h-screen bg-background">
    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto pb-20">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border h-16 flex justify-around items-center">
      <router-link
        v-for="item in navConfig"
        :key="item.name"
        :to="item.path"
        custom
        v-slot="{ navigate, isActive, isExactActive }"
      >
        <a
          @click="navigate"
          class="flex flex-col items-center justify-center text-muted-foreground w-full h-full transition-colors duration-200 ease-in-out"
          :class="{ 'text-primary': item.path === '/' ? isExactActive : isActive }"
        >
          <component :is="item.icon" class="h-6 w-6 mb-1" />
          <span class="text-xs font-medium">{{ item.label }}</span>
        </a>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { navConfig } from './navConfig.js';
</script>
