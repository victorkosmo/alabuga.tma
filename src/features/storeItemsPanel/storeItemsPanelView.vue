<template>
  <div class="p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card v-for="i in 4" :key="i">
        <CardHeader>
          <Skeleton class="h-32 w-full rounded-md" />
        </CardHeader>
        <CardContent class="space-y-2">
          <Skeleton class="h-5 w-3/4" />
          <Skeleton class="h-4 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton class="h-5 w-16" />
        </CardFooter>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки товаров магазина: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <div v-if="storeItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card v-for="item in storeItems" :key="item.id" class="flex flex-col">
          <CardHeader>
            <div class="aspect-square bg-muted rounded-md flex items-center justify-center">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="h-full w-full object-cover rounded-md">
              <span v-else class="text-muted-foreground text-sm">Нет изображения</span>
            </div>
          </CardHeader>
          <CardContent class="flex-grow space-y-1">
            <CardTitle class="text-base">{{ item.name }}</CardTitle>
            <CardDescription class="text-xs">{{ item.description }}</CardDescription>
          </CardContent>
          <CardFooter class="pt-4">
            <div class="flex items-center gap-1">
              <span class="font-semibold text-white">{{ item.cost }}</span>
              <img src="/mana.svg" alt="MP" class="h-5 w-5" />
            </div>
          </CardFooter>
        </Card>
      </div>
      <div v-else class="text-center text-muted-foreground py-10">
        <p>Магазин пока пуст. Загляните позже!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAvailableStoreItems } from './services/store.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const storeItems = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    storeItems.value = await getAvailableStoreItems();
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch store items:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
