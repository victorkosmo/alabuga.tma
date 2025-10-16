<template>
  <div class="flex items-center text-sm text-muted-foreground">
    <div v-if="stats.total_completions === 0">
      Эту миссию еще никто не выполнил. Станьте первым
    </div>
    <div v-else-if="stats.total_completions === 1">
      Миссию завершил 1 чел.
    </div>
    <div v-else class="flex items-center">
      <div class="flex -space-x-2">
        <Avatar
          v-for="user in visibleUsers"
          :key="user.id"
          class="h-6 w-6 border-2 border-background"
        >
          <AvatarImage v-if="user.avatar_url" :src="user.avatar_url" :alt="user.first_name || ''" />
          <AvatarFallback :style="{ backgroundColor: user.color }">
            {{ getInitials(user) }}
          </AvatarFallback>
        </Avatar>
      </div>
      <span class="ml-2 font-medium text-foreground">
        +{{ formatNumber(stats.total_completions) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({ total_completions: 0, completed_by: [] }),
  },
});

// A small palette of colors for fallbacks
const colors = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
];

function getDeterministicColor(id) {
  let hash = 0;
  if (!id || id.length === 0) return colors[0];
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
}

const visibleUsers = computed(() => {
  return (props.stats.completed_by || []).slice(0, 5).map(user => ({
    ...user,
    color: getDeterministicColor(user.id),
  }));
});

function getInitials(user) {
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }
  return '??';
}

function formatNumber(num) {
  if (num >= 1000) {
    // Use Number to drop trailing zeros from toFixed
    return `${Number((num / 1000).toFixed(2))}K`;
  }
  return num.toString();
}
</script>
