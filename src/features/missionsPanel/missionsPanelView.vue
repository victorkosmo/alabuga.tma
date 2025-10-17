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
    <div v-else>
      <Tabs default-value="available" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="available">
            Доступные
          </TabsTrigger>
          <TabsTrigger value="completed">
            Завершенные
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" class="mt-6">
          <div v-if="activeMissions.length > 0" class="space-y-6">
            <div v-for="campaignGroup in activeMissions" :key="campaignGroup.campaign_id">
              <h2 class="text-lg font-semibold mb-4">{{ campaignGroup.campaign_title }}</h2>
              <div class="space-y-4">
                <MissionCard
                  v-for="mission in campaignGroup.missions"
                  :key="mission.id"
                  :mission="mission"
                  :campaign="campaignsMap[mission.campaign_id]"
                  @interact="handleMissionInteract"
                />
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground py-4">
            <p>Сейчас нет доступных миссий. Загляните позже!</p>
          </div>
        </TabsContent>

        <TabsContent value="completed" class="mt-6">
          <div v-if="completedMissions.length > 0" class="space-y-4">
            <MissionCard
              v-for="mission in completedMissions"
              :key="mission.id"
              :mission="mission"
              :campaign="campaignsMap[mission.campaign_id]"
              @interact="handleMissionInteract"
            />
          </div>
          <div v-else class="text-center text-muted-foreground py-4">
            <p>У вас пока нет завершенных миссий.</p>
          </div>
        </TabsContent>
      </Tabs>
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
import { ref, onMounted, computed } from 'vue';
import { getAvailableMissions, getCompletedMissions } from './services/mission.service';
import { getCampaignById } from '../campaignPage/services/campaign.service';
import { CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MissionCard from '../campaignPage/components/MissionCard.vue';
import { useMissionInteraction } from '../campaignPage/composables/useMissionInteraction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const activeMissions = ref([]);
const completedMissions = ref([]);
const campaignsMap = ref({}); // Add this ref to store campaign data
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

// Update the signature and logic of handleMissionInteract
const handleMissionInteract = async (mission, campaign) => {
  let campaignData = campaign || campaignsMap.value[mission.campaign_id];

  if (campaignData) {
    openMissionDialog(mission, campaignData);
  } else {
    // Fallback to fetch if not available (e.g., for an available mission)
    try {
      const fetchedCampaign = await getCampaignById(mission.campaign_id);
      // Cache it for subsequent interactions
      campaignsMap.value = { ...campaignsMap.value, [mission.campaign_id]: fetchedCampaign };
      openMissionDialog(mission, fetchedCampaign);
    } catch (err) {
      console.error('Failed to get campaign details for dialog:', err);
      // Optionally: show a toast error to the user
    }
  }
};

// Update fetchData to get all mission types
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [availableResult, completedResult] = await Promise.all([
      getAvailableMissions(),
      getCompletedMissions(),
    ]);

    const newCampaignsMap = {};
    const allCompletedMissions = [];

    const processedAvailableResult = (availableResult || []).map(group => {
      newCampaignsMap[group.campaign_id] = {
        id: group.campaign_id,
        title: group.campaign_title,
        cover_url: group.campaign_cover_url,
        campaign_icon_url: group.campaign_icon_url,
      };
      const missionsWithCampaignId = group.missions.map(mission => ({
        ...mission,
        campaign_id: group.campaign_id,
      }));
      return { ...group, missions: missionsWithCampaignId };
    });

    // Process completed missions
    (completedResult || []).forEach(group => {
      if (!newCampaignsMap[group.campaign_id]) {
        newCampaignsMap[group.campaign_id] = {
          id: group.campaign_id,
          title: group.campaign_title,
          cover_url: group.campaign_cover_url,
          campaign_icon_url: group.campaign_icon_url,
        };
      }
      const missionsWithCampaignId = group.missions.map(mission => ({
        ...mission,
        campaign_id: group.campaign_id,
        is_completed: true,
      }));
      allCompletedMissions.push(...missionsWithCampaignId);
    });

    activeMissions.value = processedAvailableResult;
    completedMissions.value = allCompletedMissions;
    campaignsMap.value = newCampaignsMap;
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch missions:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
