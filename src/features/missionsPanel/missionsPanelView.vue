<template>
  <div class="p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div>
        <Skeleton class="h-7 w-48 mb-6" />
        <div class="space-y-4">
          <div v-for="i in 2" :key="i" class="p-4 border rounded-md">
            <div class="flex justify-between items-center">
              <Skeleton class="h-5 w-1/2" />
              <Skeleton class="h-6 w-20" />
            </div>
            <Skeleton class="h-4 w-full mt-2" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton class="h-7 w-40 mb-6" />
        <div class="space-y-4">
          <div v-for="i in 1" :key="i" class="p-4 border rounded-md">
            <div class="flex justify-between items-center">
              <Skeleton class="h-5 w-1/2" />
              <Skeleton class="h-6 w-20" />
            </div>
            <Skeleton class="h-4 w-full mt-2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки миссий: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Available Missions -->
      <div>
        <CardTitle class="mb-6">Доступные миссии</CardTitle>
        <div v-if="availableMissions.length > 0" class="space-y-4">
          <div v-for="mission in availableMissions" :key="mission.id" class="p-4 border rounded-md">
            <div class="flex justify-between items-start">
              <h3 class="font-semibold">{{ mission.title }}</h3>
              <div class="flex-shrink-0 ml-4">
                <Badge v-if="mission.submission_status === 'PENDING_REVIEW'" variant="outline">На рассмотрении</Badge>
                <Badge v-else-if="mission.type === 'QR_CODE'" variant="outline">отсканируйте QR код</Badge>
                <router-link v-else :to="{ name: 'Завершить миссию', params: { campaignId: mission.campaign_id, missionId: mission.id } }">
                  <Button size="sm">Начать</Button>
                </router-link>
              </div>
            </div>
            <p v-if="mission.description" class="text-sm text-muted-foreground pt-3">{{ mission.description }}</p>
          </div>
        </div>
        <div v-else class="text-center text-muted-foreground py-4">
          <p>Сейчас нет доступных миссий. Загляните позже!</p>
        </div>
      </div>

      <!-- Locked Missions -->
      <div v-if="lockedMissions.length > 0">
        <CardTitle class="mb-6">Заблокированные миссии</CardTitle>
        <div class="space-y-4">
          <div v-for="mission in lockedMissions" :key="mission.id" class="p-4 border rounded-md">
            <div class="flex justify-between items-start">
              <h3 class="font-semibold">{{ mission.title }}</h3>
              <div class="flex-shrink-0 ml-4">
                <AchievementLockBadge
                  v-if="mission.required_achievement_name"
                  :achievement-name="mission.required_achievement_name"
                />
                <Badge v-else variant="destructive" class="flex items-center gap-1">
                  <Lock class="h-3 w-3" />
                  Заблокировано
                </Badge>
              </div>
            </div>
            <p v-if="mission.description" class="text-sm text-muted-foreground pt-3">{{ mission.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAvailableMissions } from './services/mission.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AchievementLockBadge from '@/features/campaignPage/components/AchievementLockBadge.vue';

const availableMissions = ref([]);
const lockedMissions = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const result = await getAvailableMissions();
    availableMissions.value = result.available_missions || [];
    lockedMissions.value = result.locked_missions || [];
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch missions:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
