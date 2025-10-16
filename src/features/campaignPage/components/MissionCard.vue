<template>
  <component
    :is="wrapperComponent"
    v-bind="wrapperProps"
    :class="['border rounded-md block overflow-hidden', !mission.is_completed ? 'cursor-pointer' : 'cursor-default']"
    @click="handleClick"
  >
    <div v-if="mission.cover_url" class="relative">
      <img
        :src="mission.cover_url"
        :alt="mission.title"
        :class="['w-full h-32 object-cover', mission.is_locked && 'grayscale']"
      />
      <div v-if="mission.is_locked" class="absolute inset-0 flex items-center justify-center bg-black/30">
        <Lock class="h-12 w-12 text-white" />
      </div>
    </div>
    <div class="p-4">
      <!-- Header: Title and Action -->
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
          <p v-if="mission.campaign_title" class="inline-block rounded-md border bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium mb-2 truncate">
            {{ mission.campaign_title }}
          </p>
          <h3 class="font-semibold leading-tight">{{ mission.title }}</h3>
        </div>

        <div class="flex-shrink-0 w-24 flex items-center justify-center">
          <DynamicBadge
            v-if="badgeType"
            :type="badgeType"
            :achievement="requiredAchievement"
            class="w-24 h-24"
          />
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
import { Button } from '@/components/ui/button';
import DynamicBadge from './DynamicBadge.vue';
import { Lock } from 'lucide-vue-next';

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

const isStartable = computed(() => {
  return !props.mission.is_completed &&
         !props.mission.is_locked &&
         props.mission.submission_status !== 'PENDING_REVIEW' &&
         props.mission.type !== 'QR_CODE';
});

const badgeType = computed(() => {
  if (props.mission.is_completed) return 'completed';
  if (props.mission.submission_status === 'PENDING_REVIEW') return 'pending-review';
  if (props.mission.is_locked && requiredAchievement.value) return 'achievement-lock';
  if (props.mission.is_locked) return 'locked';
  return ''; // Fallback
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

const requiredAchievement = computed(() => {
  if (!props.mission.is_locked || !props.mission.required_achievement_name) return null;
  if (props.campaign?.achievements) {
    return props.campaign.achievements.find(a => a.name === props.mission.required_achievement_name) || null;
  }
  // When campaign is not available, create a mock achievement object for DynamicBadge
  return {
    name: props.mission.required_achievement_name,
    image_url: null,
  };
});

const handleClick = () => {
  if (isInteractable.value) {
    emit('interact', props.mission, props.campaign);
  }
};
</script>
