<template>
  <component
    :is="wrapperComponent"
    v-bind="wrapperProps"
    :class="['p-4 border rounded-md block', !mission.is_completed ? 'cursor-pointer' : 'cursor-default']"
    @click="handleClick"
  >
    <div>
      <!-- Header: Title and Action Button -->
      <div class="flex justify-between items-start gap-4">
        <h3 class="font-semibold flex-1 min-w-0">{{ mission.title }}</h3>

        <!-- Standardized Action Area -->
        <div class="flex-shrink-0 w-[120px] h-[36px]">
          <!-- Completed -->
          <div v-if="mission.is_completed" class="flex items-center justify-center h-full w-full rounded-md border border-green-600 text-green-600 text-xs font-medium px-1 text-center">
            <CheckCircle2 class="h-4 w-4 mr-1 flex-shrink-0" />
            <span>Завершено</span>
          </div>

          <!-- Start -->
          <div v-else-if="isStartable" class="flex items-center justify-center h-full w-full rounded-md bg-primary text-primary-foreground text-sm font-medium">
            <span>Начать</span>
          </div>

          <!-- Pending Review -->
          <div v-else-if="mission.submission_status === 'PENDING_REVIEW'" class="flex items-center justify-center h-full w-full rounded-md border border-border text-xs font-medium px-1 text-center">
            <span>На рассмотрении</span>
          </div>

          <!-- Scan QR -->
          <div v-else-if="isQrCodeMission" class="flex items-center justify-center h-full w-full rounded-md border border-border text-sm font-medium px-1 text-center">
            <span>Сканировать QR</span>
          </div>

          <!-- Locked (Achievement) -->
          <div v-else-if="mission.is_locked && requiredAchievement" class="relative h-full w-full flex items-center justify-center rounded-md border border-border">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="requiredAchievement.image_url" :alt="requiredAchievement.name" class="grayscale" />
              <AvatarFallback>{{ requiredAchievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div class="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <Lock class="h-4 w-4 text-destructive" />
            </div>
          </div>

          <!-- Locked (Generic) -->
          <div v-else-if="mission.is_locked" class="flex items-center justify-center h-full w-full rounded-md border border-destructive/50 bg-destructive/10 text-destructive text-xs font-medium px-1 text-center">
            <Lock class="h-3 w-3 mr-1 flex-shrink-0" />
            <span>Заблокировано</span>
          </div>
        </div>
      </div>

      <!-- Description: Full width -->
      <p v-if="mission.description" class="text-sm text-muted-foreground pt-3">{{ mission.description }}</p>
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lock, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  mission: {
    type: Object,
    required: true,
  },
  campaign: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['interact']);

const isStartable = computed(() => {
  return !props.mission.is_completed &&
         !props.mission.is_locked &&
         props.mission.submission_status !== 'PENDING_REVIEW' &&
         props.mission.type !== 'QR_CODE';
});

const isQrCodeMission = computed(() => {
  return props.mission.type === 'QR_CODE' && !props.mission.is_completed && !props.mission.is_locked;
});

const isInteractable = computed(() => {
  return !props.mission.is_completed && !isStartable.value;
});

const wrapperComponent = computed(() => {
  return isStartable.value ? RouterLink : 'div';
});

const wrapperProps = computed(() => {
  if (isStartable.value) {
    return {
      to: {
        name: 'Завершить миссию',
        params: { campaignId: props.campaign.id, missionId: props.mission.id },
      },
    };
  }
  return {};
});

const requiredAchievement = computed(() => {
  if (!props.mission.is_locked || !props.mission.required_achievement_name) return null;
  return props.campaign.achievements?.find(a => a.name === props.mission.required_achievement_name) || null;
});

const handleClick = () => {
  if (isInteractable.value) {
    emit('interact', props.mission, props.campaign);
  }
};
</script>
