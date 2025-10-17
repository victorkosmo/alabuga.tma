<template>
  <component
    :is="wrapperComponent"
    v-bind="wrapperProps"
    :class="['border rounded-md block', !mission.is_completed ? 'cursor-pointer' : 'cursor-default']"
    @click="handleClick"
  >
    <div v-if="mission.cover_url" class="relative">
      <img
        :src="mission.cover_url"
        :alt="mission.title"
        :class="['w-full h-32 object-cover rounded-t-md', shouldGrayscale && 'grayscale']"
      />
      <MissionStatusOverlay v-if="missionStatus" :status="missionStatus" />
    </div>
    <div class="relative p-4">
      <!-- Campaign Icon -->
      <div
        v-if="campaign && campaign.campaign_icon_url"
        class="absolute left-4 -top-5 bg-background rounded-full p-0.5"
      >
        <img :src="campaign.campaign_icon_url" :alt="campaign.title || 'Campaign icon'" class="h-10 w-10 rounded-full" />
      </div>

      <!-- Header: Title and Action -->
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
          <p v-if="mission.campaign_title" class="inline-block rounded-md border bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium mb-2 truncate">
            {{ mission.campaign_title }}
          </p>
          <h3 class="font-semibold leading-tight pt-3">{{ mission.title }}</h3>
        </div>
      </div>

      <!-- Description: Full width -->
      <p v-if="mission.description" class="text-sm text-muted-foreground pt-2">{{ mission.description }}</p>

      <!-- Completion Stats Footer -->
      <div v-if="mission.completion_stats" class="mt-3 -mx-4 -mb-4 p-4 border-t bg-muted/50 rounded-b-md">
        <MissionCompletionStats :stats="mission.completion_stats" />
      </div>
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import MissionStatusOverlay from './MissionStatusOverlay.vue';
import MissionCompletionStats from './MissionCompletionStats.vue';

const props = defineProps({
  mission: {
    type: Object,
    required: true,
  },
  campaign: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['interact']);

const missionStatus = computed(() => {
  if (props.mission.is_completed) return 'completed';
  if (props.mission.submission_status === 'PENDING_REVIEW') return 'pending-review';
  if (props.mission.is_locked) return 'locked';
  return null;
});

const shouldGrayscale = computed(() => {
  return missionStatus.value && missionStatus.value !== 'completed';
});

const isStartable = computed(() => {
  return !props.mission.is_completed &&
         !props.mission.is_locked &&
         props.mission.submission_status !== 'PENDING_REVIEW' &&
         props.mission.type !== 'QR_CODE';
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
        params: { campaignId: props.campaign?.id || props.mission.campaign_id, missionId: props.mission.id },
      },
    };
  }
  return {};
});

const handleClick = () => {
  if (isInteractable.value) {
    emit('interact', props.mission, props.campaign);
  }
};
</script>
