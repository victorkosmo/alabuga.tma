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

        <div>
          <Skeleton class="h-7 w-28 mb-6" />
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="p-4 border rounded-md">
              <div class="flex justify-between items-center">
                <Skeleton class="h-5 w-1/2" />
                <Skeleton class="h-6 w-20" />
              </div>
              <Skeleton class="h-4 w-full mt-2" />
            </div>
          </div>
        </div>
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
        <Card v-if="campaign.description || campaign.achievements?.length">
          <CardContent>
            <p v-if="campaign.description" class="text-muted-foreground">{{ campaign.description }}</p>
            <CampaignAchievementsList v-if="campaign.achievements?.length" :achievements="campaign.achievements" />
          </CardContent>
        </Card>

        <div>
          <CardTitle class="mb-6">Миссии</CardTitle>
          <div v-if="missions.length > 0" class="space-y-4">
            <MissionCard
              v-for="mission in missions"
              :key="mission.id"
              :mission="mission"
              :campaign="campaign"
              @interact="openMissionDialog"
            />
          </div>
          <div v-else class="text-center text-muted-foreground py-4">
            <p>Пока нет доступных миссий для этой кампании.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
    <DialogContent class="max-w-[90vw] rounded-lg">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription v-if="dialogDescription">
          {{ dialogDescription }}
        </DialogDescription>
      </DialogHeader>
      <component
        v-if="dialogContentComponent"
        :is="dialogContentComponent"
        v-bind="dialogContentProps"
        class="py-4"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCampaignById, getCampaignMissions } from './services/campaign.service';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import CampaignAchievementsList from './components/CampaignAchievementsList.vue';
import MissionCard from './components/MissionCard.vue';
import { useMissionInteraction } from './composables/useMissionInteraction.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const route = useRoute();
const campaignId = route.params.id;

const campaign = ref(null);
const missions = ref([]);
const loading = ref(true);
const error = ref(null);

const {
  isDialogOpen,
  dialogTitle,
  dialogDescription,
  dialogContentComponent,
  dialogContentProps,
  openMissionDialog,
} = useMissionInteraction();

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
