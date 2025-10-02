<template>
  <div class="flex flex-col h-screen bg-background pb-safe">
    <!-- User Header -->
    <UserHeader />

    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto pb-24">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border h-20 flex justify-around items-center">
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
          <component :is="item.icon" class="h-8 w-8 mb-1" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </a>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { navConfig } from './navConfig.js';
import UserHeader from './components/UserHeader.vue';
</script>
