<template>
  <div class="flex flex-col h-screen bg-background">
    <!-- User Header -->
    <UserHeader />

    <!-- Main content area -->
    <main id="main-content" class="flex-1 overflow-y-auto">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <nav id="bottom-nav" class="fixed bottom-0 left-0 right-0 border-t border-border">
      <div class="h-20 flex items-center">
        <div
          v-for="item in navConfig"
          :key="item.name"
          class="flex-1 h-full border-l border-input first:border-l-0"
        >
          <router-link
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
  padding-bottom: 12px;
  background-color: var(--secondary); /* Ensure background covers the new padded area */
}

#main-content {
  /* 5rem is h-20. We add 12px for the nav padding. */
  padding-bottom: calc(5rem + 12px);
}
</style>
