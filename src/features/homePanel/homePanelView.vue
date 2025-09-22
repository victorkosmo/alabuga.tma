<template>
  <div class="p-4 md:p-6">
    <div v-if="loading" class="space-y-6">
      <!-- User Profile Card Skeleton -->
      <Card>
        <CardHeader class="flex flex-row items-center gap-4">
          <Skeleton class="h-16 w-16 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-6 w-48" />
            <Skeleton class="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton class="h-6 w-24" />
        </CardContent>
      </Card>

      <!-- Stats Card Skeleton -->
      <Card>
        <CardHeader>
          <Skeleton class="h-7 w-20" />
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <div class="flex justify-between mb-2">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-4 w-16" />
            </div>
            <Skeleton class="h-2 w-full" />
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <Skeleton class="h-4 w-16" />
              <Skeleton class="h-4 w-12" />
            </div>
            <Skeleton class="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Error loading user data: {{ error.message }}</p>
    </div>

    <div v-else-if="user" class="space-y-6">
      <!-- User Profile Card -->
      <Card>
        <CardHeader class="flex flex-row items-center gap-4">
          <Avatar class="h-16 w-16">
            <AvatarImage :src="user.avatar_url" :alt="user.username" />
            <AvatarFallback>{{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle class="text-2xl">{{ user.first_name }} {{ user.last_name }}</CardTitle>
            <CardDescription>@{{ user.username }}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <Badge variant="secondary">Rank</Badge>
            <span class="font-semibold">{{ user.rank_title }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Stats Card -->
      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-muted-foreground">Experience</span>
              <span class="text-sm font-medium">{{ user.experience_points }} XP</span>
            </div>
            <Progress :model-value="75" class="h-2" /> <!-- TODO: Calculate progress based on rank thresholds -->
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-muted-foreground">Mana</span>
              <span class="text-sm font-medium">{{ user.mana_points }} MP</span>
            </div>
            <Progress :model-value="50" class="h-2" /> <!-- TODO: Calculate progress based on max mana -->
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMe } from './services/user.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const user = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    error.value = null;
    user.value = await getMe();
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch user profile:', err);
  } finally {
    loading.value = false;
  }
});
</script>
