<template>
  <div class="flex flex-col items-center justify-center p-2 rounded-md text-center text-xs font-medium leading-tight w-full h-full">
    <!-- Completed -->
    <div v-if="type === 'completed'" class="flex flex-col items-center justify-center gap-2 text-green-600">
      <CheckCircle2 class="h-8 w-8" />
      <span>Завершено</span>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle2 } from 'lucide-vue-next';

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['completed'].includes(value),
  },
});
</script>
