<template>
  <div class="p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton class="h-7 w-48" />
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="i in 2" :key="i" class="p-4 border rounded-md">
            <div class="flex justify-between items-center">
              <Skeleton class="h-5 w-1/2" />
              <Skeleton class="h-6 w-20" />
            </div>
            <Skeleton class="h-4 w-full mt-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton class="h-7 w-40" />
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="i in 1" :key="i" class="p-4 border rounded-md">
            <div class="flex justify-between items-center">
              <Skeleton class="h-5 w-1/2" />
              <Skeleton class="h-6 w-20" />
            </div>
            <Skeleton class="h-4 w-full mt-2" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки миссий: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Available Missions -->
      <Card>
        <CardHeader>
          <CardTitle>Доступные миссии</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="availableMissions.length > 0" class="space-y-4">
            <div v-for="mission in availableMissions" :key="mission.id" class="p-4 border rounded-md">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ mission.title }}</h3>
                  <p v-if="mission.description" class="text-sm text-muted-foreground mt-1">{{ mission.description }}</p>
                  <div class="flex items-center gap-4 mt-2 text-sm">
                    <span v-if="mission.mana_reward > 0" class="font-semibold text-blue-500">{{ mission.mana_reward }} MP</span>
                  </div>
                </div>
                <div class="flex-shrink-0 ml-4">
                  <Badge v-if="mission.submission_status === 'PENDING_REVIEW'" variant="outline">На рассмотрении</Badge>
                  <router-link v-else :to="{ name: 'Завершить миссию', params: { campaignId: mission.campaign_id, missionId: mission.id } }">
                    <Button size="sm">Начать</Button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground py-4">
            <p>Сейчас нет доступных миссий. Загляните позже!</p>
          </div>
        </CardContent>
      </Card>

      <!-- Locked Missions -->
      <Card v-if="lockedMissions.length > 0">
        <CardHeader>
          <CardTitle>Заблокированные миссии</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="mission in lockedMissions" :key="mission.id" class="p-4 border rounded-md">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ mission.title }}</h3>
                  <p v-if="mission.description" class="text-sm text-muted-foreground mt-1">{{ mission.description }}</p>
                  <div class="flex items-center gap-4 mt-2 text-sm">
                    <span v-if="mission.mana_reward > 0" class="font-semibold text-blue-500">{{ mission.mana_reward }} MP</span>
                  </div>
                </div>
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
            </div>
          </div>
        </CardContent>
      </Card>
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
