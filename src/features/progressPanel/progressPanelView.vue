<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6">Мой Прогресс</h1>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <Card>
        <CardContent class="p-4">
          <Skeleton class="h-6 w-40 mb-4" />
          <div class="flex flex-wrap gap-4">
            <div v-for="i in 5" :key="i" class="flex flex-col items-center gap-2 w-20">
              <Skeleton class="h-16 w-16 rounded-full" />
              <Skeleton class="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div class="space-y-4">
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
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки прогресса: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="achievements.length > 0 || competencies.length > 0" class="space-y-6">
      <Card v-if="achievements.length > 0">
        <CardHeader>
          <CardTitle>Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-x-4 gap-y-6">
            <div
              v-for="achievement in achievements"
              :key="achievement.id"
              class="flex flex-col items-center gap-1.5 w-20 text-center"
            >
              <div class="relative">
                <Avatar :class="['h-16 w-16 border-2', achievement.is_completed ? 'border-green-500' : 'border-border']">
                  <AvatarImage v-if="achievement.image_url" :src="achievement.image_url" :alt="achievement.name" :class="[!achievement.is_completed && 'grayscale']" />
                  <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
                </Avatar>
                <Avatar v-if="achievement.campaign_icon_url" class="absolute -bottom-2 -right-2 h-8 w-8 border-2 border-background">
                  <AvatarImage :src="achievement.campaign_icon_url" alt="Campaign Icon" />
                  <AvatarFallback />
                </Avatar>
              </div>
              <span class="text-xs font-medium leading-tight mt-2">{{ achievement.name }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div v-if="competencies.length > 0" class="space-y-4">
        <Card v-for="competency in competencies" :key="competency.id">
          <CardContent class="p-4">
            <h3 class="font-semibold text-lg">{{ competency.name }}</h3>
            <div class="mt-4 space-y-3">
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
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-muted-foreground py-10">
      <p>Данные о вашем прогрессе пока отсутствуют.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGlobalCompetencies, getUserAchievements } from './services/progress.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const competencies = ref([]);
const achievements = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [achievementsResult, competenciesResult] = await Promise.all([
      getUserAchievements(),
      getGlobalCompetencies(),
    ]);
    achievements.value = achievementsResult;
    competencies.value = competenciesResult;
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch progress data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
