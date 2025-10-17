<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6">Мой Прогресс</h1>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <Card v-for="i in 3" :key="i">
        <CardContent class="p-4 space-y-3">
          <Skeleton class="h-6 w-1/3" />
          <Skeleton class="h-4 w-full" />
          <div class="pt-2">
            <div class="flex justify-between mb-2">
              <Skeleton class="h-4 w-20" />
              <Skeleton class="h-4 w-16" />
            </div>
            <Skeleton class="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки прогресса: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="competencies.length > 0" class="space-y-4">
      <Card v-for="competency in competencies" :key="competency.id">
        <CardContent class="p-4">
          <h3 class="font-semibold text-lg">{{ competency.name }}</h3>
          <p v-if="competency.description" class="text-sm text-muted-foreground mt-1">{{ competency.description }}</p>
          <div class="mt-4 space-y-3">
            <div class="flex items-baseline gap-2">
              <span class="text-muted-foreground text-sm">Уровень: </span>
              <span class="font-bold text-2xl">{{ competency.level }}</span>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1 text-sm">
                <span class="text-muted-foreground">Прогресс</span>
                <span class="font-medium">{{ competency.progress_points }} / 100</span>
              </div>
              <Progress :model-value="competency.progress_points" class="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-muted-foreground py-10">
      <p>Данные о вашем прогрессе пока отсутствуют.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGlobalCompetencies } from './services/progress.service';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

const competencies = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    competencies.value = await getGlobalCompetencies();
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch competencies:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
