<template>
  <div class="space-y-4">
    <div class="flex flex-col items-center gap-3 text-center">
      <Avatar class="h-20 w-20 animate-vibrant-pulse">
        <AvatarImage v-if="achievement.image_url" :src="achievement.image_url" :alt="achievement.name" />
        <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
      </Avatar>
      <span class="text-lg font-semibold">{{ achievement.name }}</span>
    </div>

    <p v-if="achievement.description" class="text-sm text-muted-foreground pt-2">
      {{ achievement.description }}
    </p>

    <div v-if="achievement.mana_reward > 0">
      <h5 class="font-semibold text-sm mb-1">Награда за достижение</h5>
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <span class="text-[20px]">{{ achievement.mana_reward }}</span>
        <img src="/mana.svg" alt="MP" class="h-7 w-7" />
      </div>
    </div>

    <div>
      <h5 class="font-semibold text-sm mb-2">Для получения нужно выполнить миссии:</h5>
      <ul v-if="achievement.required_missions.length > 0" class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        <li v-for="mission in achievement.required_missions" :key="mission.id">
          {{ mission.title }}
        </li>
      </ul>
      <p v-else class="text-sm text-muted-foreground">Нет обязательных миссий.</p>
    </div>
  </div>
</template>

<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

defineProps({
  achievement: {
    type: Object,
    required: true,
  },
});
</script>
