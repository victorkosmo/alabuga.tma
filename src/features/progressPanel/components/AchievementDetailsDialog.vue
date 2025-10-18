<template>
  <div class="space-y-4 py-4">
    <div class="flex flex-col items-center gap-3 text-center">
      <div class="relative flex h-28 w-28 items-center justify-center">
        <div class="particle-container">
          <div class="particle particle-1" />
          <div class="particle particle-2" />
          <div class="particle particle-3" />
        </div>
        <Avatar :class="['relative z-10 h-20 w-20 border-4', 'border-border']">
          <AvatarImage v-if="achievement.image_url" :src="achievement.image_url" :alt="achievement.name" />
          <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
        </Avatar>
      </div>
      <span class="text-lg font-semibold">{{ achievement.name }}</span>
    </div>

    <p v-if="achievement.description" class="text-sm text-muted-foreground text-center">
      {{ achievement.description }}
    </p>

    <div v-if="achievement.mana_reward > 0">
      <h5 class="font-semibold text-sm mb-1">Награда</h5>
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <span class="text-[20px]">{{ achievement.mana_reward }}</span>
        <img src="/mana.svg" alt="MP" class="h-7 w-7" />
      </div>
    </div>

    <div v-if="!achievement.is_completed && achievement.required_mission_titles?.length > 0">
      <h5 class="font-semibold text-sm mb-2">Для получения нужно выполнить миссии:</h5>
      <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        <li v-for="(title, index) in achievement.required_mission_titles" :key="index">
          {{ title }}
        </li>
      </ul>
    </div>

    <div v-if="achievement.is_completed && achievement.awarded_at">
      <h5 class="font-semibold text-sm mb-1">Получено</h5>
      <p class="text-sm text-muted-foreground">{{ new Date(achievement.awarded_at).toLocaleString('ru-RU') }}</p>
    </div>

    <div v-if="achievement.campaign_title">
      <h5 class="font-semibold text-sm mb-2">Из кампании</h5>
      <div class="flex items-center gap-2">
        <Avatar v-if="achievement.campaign_icon_url" class="h-10 w-10">
          <AvatarImage :src="achievement.campaign_icon_url" :alt="achievement.campaign_title" />
          <AvatarFallback />
        </Avatar>
        <span class="font-medium text-sm">{{ achievement.campaign_title }}</span>
      </div>
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

<style scoped>
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: rotate 12s linear infinite;
}

.particle {
  position: absolute;
  border-radius: 50%;
  filter: blur(4px);
}

.particle-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background-color: rgba(59, 130, 246, 0.9); /* Blue */
}

.particle-2 {
  bottom: 5%;
  left: 15%;
  width: 12px;
  height: 12px;
  background-color: rgba(139, 92, 246, 0.9); /* Purple */
}

.particle-3 {
  bottom: 25%;
  right: 5%;
  width: 8px;
  height: 8px;
  background-color: rgba(99, 102, 241, 0.9); /* Indigo */
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
