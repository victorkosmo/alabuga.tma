<template>
  <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
    <div class="flex items-start gap-3">
      <Info class="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p class="text-sm font-medium">
        Камера откроется для сканирования QR-кода. После успешного сканирования вы автоматически вернетесь в приложение.
      </p>
    </div>
  </div>
</template>

<script setup>
import { Info } from 'lucide-vue-next';
</script>
