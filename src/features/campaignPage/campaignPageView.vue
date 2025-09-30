<template>
  <div class="pb-6">

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="relative h-60 w-full bg-secondary">
        <div class="relative z-10 flex h-full items-end p-4 md:p-6">
          <div class="flex w-full items-center gap-3">
            <Skeleton class="h-10 w-10 rounded-full" />
            <Skeleton class="h-8 w-1/2" />
          </div>
        </div>
      </div>

      <div class="px-4 md:px-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton class="h-7 w-40" />
          </CardHeader>
          <CardContent class="flex gap-4">
            <div v-for="i in 4" :key="i" class="flex flex-col items-center gap-2">
              <Skeleton class="h-10 w-10 rounded-full" />
              <Skeleton class="h-4 w-16" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton class="h-7 w-28" />
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="i in 3" :key="i" class="p-4 border rounded-md">
              <div class="flex justify-between items-center">
                <Skeleton class="h-5 w-1/2" />
                <Skeleton class="h-6 w-20" />
              </div>
              <Skeleton class="h-4 w-full mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive px-4 md:px-6">
      <p>Ошибка загрузки данных кампании: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="campaign">
      <div
        class="relative h-60 w-full bg-cover bg-center"
        :style="{ backgroundImage: campaign.cover_url ? `url(${campaign.cover_url})` : 'none' }"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div class="relative z-10 flex h-full items-end p-4 md:p-6">
          <div class="flex w-full items-center gap-3">
            <router-link to="/">
              <Button variant="outline" size="icon" class="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm">
                <ArrowLeft class="h-5 w-5" />
              </Button>
            </router-link>
            <h1 class="text-3xl font-bold text-foreground drop-shadow-md">{{ campaign.title }}</h1>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-4 md:p-6">
        <Card v-if="campaign.description">
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">{{ campaign.description }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ваши достижения</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="userAchievements.length > 0" class="flex flex-wrap gap-4">
              <div v-for="achievement in userAchievements" :key="achievement.id" class="flex flex-col items-center gap-2 w-20 text-center">
                <Avatar>
                  <AvatarImage :src="achievement.image_url" :alt="achievement.name" />
                  <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
                </Avatar>
                <span class="text-xs font-medium leading-tight">{{ achievement.name }}</span>
              </div>
            </div>
            <div v-else class="text-center text-muted-foreground py-4">
              <p>Пока нет достижений. Выполняйте миссии, чтобы разблокировать их!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Миссии</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="missions.length > 0" class="space-y-4">
              <div v-for="mission in missions" :key="mission.id" class="p-4 border rounded-md">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold">{{ mission.title }}</h3>
                    <p v-if="mission.description" class="text-sm text-muted-foreground mt-1">{{ mission.description }}</p>

                    <div class="flex items-center gap-4 mt-2 text-sm">
                      <span v-if="mission.mana_reward > 0" class="font-semibold text-blue-500">{{ mission.mana_reward }} MP</span>
                    </div>
                  </div>
                  <div class="flex-shrink-0 ml-4">
                    <Badge v-if="mission.is_completed" variant="outline" class="flex items-center gap-1 text-green-600 border-green-600">
                      <CheckCircle2 class="h-4 w-4" />
                      Завершено
                    </Badge>
                    <template v-else-if="mission.is_locked">
                      <AchievementLockBadge
                        v-if="mission.required_achievement_name"
                        :achievement-name="mission.required_achievement_name"
                      />
                      <Badge v-else variant="destructive" class="flex items-center gap-1">
                        <Lock class="h-3 w-3" />
                        Заблокировано
                      </Badge>
                    </template>
                    <Badge v-else-if="mission.submission_status === 'PENDING_REVIEW'" variant="outline">На рассмотрении</Badge>
                    <Badge v-else-if="mission.type === 'QR_CODE'" variant="outline">отсканируйте QR код</Badge>
                    <router-link v-else :to="{ name: 'Завершить миссию', params: { campaignId: campaignId, missionId: mission.id } }">
                      <Button size="sm">Начать</Button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted-foreground py-4">
              <p>Пока нет доступных миссий для этой кампании.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCampaignById, getCampaignMissions, getUserCampaignAchievements } from './services/campaign.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AchievementLockBadge from './components/AchievementLockBadge.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const route = useRoute();
const campaignId = route.params.id;

const campaign = ref(null);
const missions = ref([]);
const userAchievements = ref([]); // Add this line
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [campaignResult, missionsResult, achievementsResult] = await Promise.all([
      getCampaignById(campaignId),
      getCampaignMissions(campaignId),
      getUserCampaignAchievements(campaignId),
    ]);
    campaign.value = campaignResult;
    missions.value = missionsResult;
    userAchievements.value = achievementsResult; // Add this line
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch campaign data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
