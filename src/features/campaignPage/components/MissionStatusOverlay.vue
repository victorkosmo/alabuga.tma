<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
    <div class="flex flex-col items-center justify-center gap-2 text-center">
      <!-- Locked Status Icon -->
      <div v-if="status === 'locked'" class="flex items-center gap-2 rounded-full backdrop-blur-md p-1 pr-3 h-fit">
        <div class="text-foreground rounded-full p-1.5">
          <Lock class="h-5 w-5" />
        </div>
        <Avatar v-if="achievementImageUrl" class="h-10 w-10">
          <AvatarImage :src="achievementImageUrl" :alt="achievementName || 'Achievement'" />
          <AvatarFallback v-if="achievementName">{{ achievementName.substring(0, 2).toUpperCase() }}</AvatarFallback>
        </Avatar>
      </div>

      <!-- Other Statuses Icon -->
      <component
        v-else
        :is="icon"
        :class="['h-10 w-10', status === 'completed' && 'text-green-500']"
      />

      <!-- Status Text -->
      <span class="font-semibold text-sm">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Lock, Clock, CheckCircle2 } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['locked', 'pending-review', 'completed'].includes(value),
  },
  achievementImageUrl: {
    type: String,
    default: null,
  },
  achievementName: {
    type: String,
    default: null,
  },
});

const icon = computed(() => {
  switch (props.status) {
    case 'locked':
      return Lock;
    case 'pending-review':
      return Clock;
    case 'completed':
      return CheckCircle2;
    default:
      return null;
  }
});

const text = computed(() => {
  switch (props.status) {
    case 'locked':
      return 'Требуется достижение';
    case 'pending-review':
      return 'На проверке';
    case 'completed':
      return 'Выполнено';
    default:
      return '';
  }
});
</script>
