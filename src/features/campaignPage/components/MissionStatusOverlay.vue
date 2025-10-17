<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
    <div class="flex flex-col items-center justify-center gap-2 text-center">
      <component :is="icon" :class="['h-10 w-10', status === 'completed' && 'text-green-500']" />
      <span class="font-semibold text-sm">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Lock, Clock, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['locked', 'pending-review', 'completed'].includes(value),
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
