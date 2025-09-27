<template>
  <div class="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
    <Lock class="h-3 w-3" />
    <span>Requires "{{ achievementName }}"</span>
  </div>
</template>

<script setup>
import { Lock } from 'lucide-vue-next';

defineProps({
  achievementName: {
    type: String,
    required: true,
  },
});
</script>
