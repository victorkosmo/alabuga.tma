<template>
  <div class="p-4 md:p-6">

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-4 w-full mt-2" />
          <Skeleton class="h-4 w-2/3 mt-1" />
        </CardHeader>
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

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Error loading campaign data: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="campaign" class="space-y-6">
    <div class="flex w-full gap-2">
        <router-link to="/" class="h-full items-center">
            <Button variant="outline" size="lg" class="w-full">
                <ArrowLeft class="mr-2 h-5 w-5" />
                Back
            </Button>
        </router-link>
          <Card class="w-full">
            <CardHeader>
              <CardTitle class="text-2xl">{{ campaign.name }}</CardTitle>
              <CardDescription v-if="campaign.description">{{ campaign.description }}</CardDescription>
            </CardHeader>
          </Card>
    </div>

      <Card>
        <CardHeader>
          <CardTitle>Missions</CardTitle>
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
                  <Badge v-if="mission.is_completed" variant="secondary">Completed</Badge>
                  <template v-else-if="mission.is_locked">
                    <AchievementLockBadge
                      v-if="mission.required_achievement_name"
                      :achievement-name="mission.required_achievement_name"
                    />
                    <Badge v-else variant="destructive" class="flex items-center gap-1">
                      <Lock class="h-3 w-3" />
                      Locked
                    </Badge>
                  </template>
                  <router-link v-else :to="{ name: 'Завершить миссию', params: { campaignId: campaignId, missionId: mission.id } }">
                    <Button size="sm">Start</Button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground py-4">
            <p>No missions available for this campaign yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCampaignById, getCampaignMissions } from './services/campaign.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Lock } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AchievementLockBadge from './components/AchievementLockBadge.vue';

const route = useRoute();
const campaignId = route.params.id;

const campaign = ref(null);
const missions = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [campaignResult, missionsResult] = await Promise.all([
      getCampaignById(campaignId),
      getCampaignMissions(campaignId),
    ]);
    campaign.value = campaignResult;
    missions.value = missionsResult;
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch campaign data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
