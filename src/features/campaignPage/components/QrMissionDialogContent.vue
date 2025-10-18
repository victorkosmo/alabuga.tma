<template>
  <div class="flex flex-col items-center justify-center gap-6 py-8">
    <div class="relative">
      <div class="absolute -inset-4 z-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
      <div class="relative z-10 rounded-full bg-primary/10 p-6">
        <QrCode class="h-24 w-24 text-primary" />
      </div>
    </div>
    <p class="max-w-xs text-center font-medium">
      Найдите QR код и просто наведите на него камеру телефона.
    </p>
  </div>
</template>

<script setup>
import { QrCode } from 'lucide-vue-next';
</script>
