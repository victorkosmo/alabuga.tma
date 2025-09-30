<template>
  <header class="p-4 bg-background border-b border-border">
    <div v-if="loading">
      <!-- User Profile Card Skeleton -->
      <div class="flex flex-row items-center justify-between gap-4">
        <div class="flex flex-row items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-24" />
          </div>
        </div>
        <div class="flex items-center justify-end gap-1">
          <Skeleton class="h-6 w-12" />
          <Skeleton class="h-6 w-6" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center text-destructive">
      <p>Не удалось загрузить профиль</p>
    </div>

    <div v-else-if="user" class="flex flex-row items-center justify-between gap-4">
      <div class="flex flex-row items-center gap-4 overflow-hidden">
        <Avatar class="h-12 w-12">
          <AvatarImage :src="user.avatar_url" :alt="user.username" />
          <AvatarFallback>{{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="overflow-hidden">
          <h1 class="font-semibold text-lg truncate">{{ user.first_name }} {{ user.last_name }}</h1>
          <p class="text-sm text-muted-foreground truncate">@{{ user.username }}</p>
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center justify-end gap-1 font-semibold text-lg">
          <span>{{ user.mana_points }}</span>
          <img src="/mana.svg" alt="Mana" class="h-6 w-6" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMe } from '@/features/homePanel/services/user.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const user = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchUser = async () => {
  loading.value = true;
  error.value = null;
  try {
    user.value = await getMe();
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch user data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUser);
</script>
