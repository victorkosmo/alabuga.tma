<template>
  <div class="flex flex-col h-screen bg-background">
    <!-- User Header -->
    <UserHeader />

    <!-- Main content area -->
    <main id="main-content" class="flex-1 overflow-y-auto">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <nav id="bottom-nav" class="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border">
      <div class="h-20 flex justify-around items-center">
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
      </div>
    </nav>
  </div>
</template>

<script setup>
import { navConfig } from './navConfig.js';
import UserHeader from './components/UserHeader.vue';
</script>

<style>
#bottom-nav {
  /* Fallback for older browsers */
  padding-bottom: constant(safe-area-inset-bottom);
  /* Modern syntax */
  padding-bottom: env(safe-area-inset-bottom);
}

#main-content {
  /* 5rem is the height of the nav bar's content (h-20) */
  /* Fallback for older browsers */
  padding-bottom: calc(5rem + constant(safe-area-inset-bottom));
  /* Modern syntax */
  padding-bottom: calc(5rem + env(safe-area-inset-bottom));
}
</style>
