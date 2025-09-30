<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Ваши кампании</CardTitle>
      <Button size="sm" @click="isJoinDialogOpen = true">
        Присоединиться
      </Button>
    </CardHeader>
    <CardContent>
      <div v-if="campaigns.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CampaignCard v-for="campaign in campaigns" :key="campaign.id" :campaign="campaign" />
      </div>
      <div v-else class="text-center text-muted-foreground py-4">
        <p>Вы еще не присоединились ни к одной кампании.</p>
        <p class="text-sm">Нажмите "Присоединиться", чтобы начать.</p>
      </div>
    </CardContent>
  </Card>

  <JoinCampaignDialog
    v-model:open="isJoinDialogOpen"
    @campaign-joined="handleCampaignJoined"
  />
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JoinCampaignDialog from './JoinCampaignDialog.vue';
import CampaignCard from './CampaignCard.vue';

defineProps({
  campaigns: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['campaign-joined']);

const isJoinDialogOpen = ref(false);

const handleCampaignJoined = () => {
  emit('campaign-joined');
};
</script>
