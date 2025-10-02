// src/features/campaignPage/components/MissionCard.vue
<template>
  <component
    :is="wrapperComponent"
    v-bind="wrapperProps"
    :class="['p-4 border rounded-md block', !mission.is_completed ? 'cursor-pointer' : 'cursor-default']"
    @click="handleClick"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1 mr-4">
        <h3 class="font-semibold">{{ mission.title }}</h3>
        <p v-if="mission.description" class="text-sm text-muted-foreground pt-3">{{ mission.description }}</p>
      </div>

      <div class="flex-shrink-0 flex items-center justify-center w-[120px] h-[36px]">
        <Badge v-if="mission.is_completed" variant="outline" class="flex items-center gap-1 text-green-600 border-green-600">
          <CheckCircle2 class="h-4 w-4" />
          Завершено
        </Badge>

        <Button v-else-if="isStartable" size="sm" class="pointer-events-none">Начать</Button>

        <Badge v-else-if="mission.submission_status === 'PENDING_REVIEW'" variant="outline">На рассмотрении</Badge>

        <Badge v-else-if="isQrCodeMission" variant="outline">Сканировать QR</Badge>

        <div v-else-if="mission.is_locked && requiredAchievement" class="relative">
          <Avatar class="h-9 w-9 border-2 border-transparent">
            <AvatarImage
              :src="requiredAchievement.image_url"
              :alt="requiredAchievement.name"
              class="grayscale"
            />
            <AvatarFallback>{{ requiredAchievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
            <Lock class="h-4 w-4 text-destructive" />
          </div>
        </div>

        <Badge v-else-if="mission.is_locked" variant="destructive" class="flex items-center gap-1">
          <Lock class="h-3 w-3" />
          Заблокировано
        </Badge>
      </div>
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
