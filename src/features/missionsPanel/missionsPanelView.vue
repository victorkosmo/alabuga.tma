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
          <MissionCard
            v-for="mission in availableMissions"
            :key="mission.id"
            :mission="mission"
            @interact="handleMissionInteract"
          />
        </div>
        <div v-else class="text-center text-muted-foreground py-4">
          <p>Сейчас нет доступных миссий. Загляните позже!</p>
        </div>
      </div>

      <!-- Locked Missions -->
      <div v-if="lockedMissions.length > 0">
        <CardTitle class="mb-6">Заблокированные миссии</CardTitle>
        <div class="space-y-4">
          <MissionCard
            v-for="mission in lockedMissions"
            :key="mission.id"
            :mission="mission"
            @interact="handleMissionInteract"
          />
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
import { getAvailableMissions } from './services/mission.service';
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

const availableMissions = ref([]);
const lockedMissions = ref([]);
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

const handleMissionInteract = async (mission) => {
  try {
    const campaign = await getCampaignById(mission.campaign_id);
    openMissionDialog(mission, campaign);
  } catch (err) {
    console.error('Failed to get campaign details for dialog:', err);
    // Optionally: show a toast error to the user
  }
};

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
