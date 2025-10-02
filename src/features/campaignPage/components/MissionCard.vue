<template>
  <component
    :is="wrapperComponent"
    v-bind="wrapperProps"
    :class="['p-4 border rounded-md block', !mission.is_completed ? 'cursor-pointer' : 'cursor-default']"
    @click="handleClick"
  >
    <div>
      <!-- Header: Title and Action -->
      <div class="flex justify-between items-end gap-4">
        <h3 class="font-semibold flex-1 min-w-0">{{ mission.title }}</h3>

        <div class="flex-shrink-0 w-24 flex items-center justify-center">
          <Button v-if="isStartable" class="w-full" size="sm">
            Начать
          </Button>
          <DynamicBadge
            v-else
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

const badgeType = computed(() => {
  if (props.mission.is_completed) return 'completed';
  if (props.mission.submission_status === 'PENDING_REVIEW') return 'pending-review';
  if (props.mission.type === 'QR_CODE' && !props.mission.is_completed && !props.mission.is_locked) return 'scan-qr';
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
