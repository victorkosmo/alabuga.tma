<template>
  <div class="flex flex-col items-center justify-center p-2 rounded-md text-center text-xs font-medium leading-tight w-full h-full">
    <!-- Completed -->
    <div v-if="type === 'completed'" class="flex flex-col items-center justify-center gap-2 text-green-600">
      <CheckCircle2 class="h-8 w-8" />
      <span>Завершено</span>
    </div>

    <!-- Pending Review -->
    <div v-else-if="type === 'pending-review'" class="flex flex-col items-center justify-center gap-2 text-muted-foreground bg-zinc-900 p-2 rounded-lg">
      <Clock class="h-8 w-8" />
      <span>На проверке</span>
    </div>

    <!-- Generic Lock -->
    <div v-else-if="type === 'locked'" class="flex flex-col items-center justify-center gap-2 text-destructive">
      <Lock class="h-8 w-8" />
      <span>Заблокировано</span>
    </div>
  </div>
</template>

<script setup>
import { Lock, CheckCircle2, Clock } from 'lucide-vue-next';

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['completed', 'pending-review', 'locked'].includes(value),
  },
});
</script>
