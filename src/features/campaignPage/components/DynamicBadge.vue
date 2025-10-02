<template>
  <div class="flex flex-col items-center justify-center p-2 rounded-md text-center text-xs font-medium leading-tight w-full h-full">
    <!-- Achievement Lock -->
    <div v-if="type === 'achievement-lock' && achievement" class="relative w-full h-full flex items-center justify-center">
      <Avatar class="h-16 w-16">
        <AvatarImage v-if="achievement.image_url" :src="achievement.image_url" :alt="achievement.name" class="grayscale" />
        <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
      </Avatar>
      <div class="absolute bottom-1 right-1 rounded-full p-1 bg-background border border-red-800">
        <Lock class="h-4 w-4 text-red-800" />
      </div>
    </div>

    <!-- Completed -->
    <div v-else-if="type === 'completed'" class="flex flex-col items-center justify-center gap-2 text-green-600">
      <CheckCircle2 class="h-8 w-8" />
      <span>Завершено</span>
    </div>

    <!-- Pending Review -->
    <div v-else-if="type === 'pending-review'" class="flex flex-col items-center justify-center gap-2 text-muted-foreground bg-zinc-900 p-2 rounded-lg">
      <Clock class="h-8 w-8" />
      <span>На проверке</span>
    </div>

    <!-- Scan QR -->
    <div v-else-if="type === 'scan-qr'" class="flex flex-col items-center justify-center gap-2 text-muted-foreground bg-zinc-900 p-2 rounded-lg">
      <QrCode class="h-8 w-8" />
      <span>Сканировать</span>
    </div>

    <!-- Generic Lock -->
    <div v-else-if="type === 'locked'" class="flex flex-col items-center justify-center gap-2 text-destructive">
      <Lock class="h-8 w-8" />
      <span>Заблокировано</span>
    </div>
  </div>
</template>

<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lock, CheckCircle2, Clock, QrCode } from 'lucide-vue-next';

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['completed', 'pending-review', 'scan-qr', 'achievement-lock', 'locked'].includes(value),
  },
  achievement: {
    type: Object,
    default: null,
  },
});
</script>
