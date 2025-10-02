<template>
  <!-- Scenario 1: User has campaigns -->
  <div v-if="campaigns.length > 0">
    <h2 class="text-xl font-semibold mb-4">Ваши события</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CampaignCard v-for="campaign in campaigns" :key="campaign.id" :campaign="campaign" />
    </div>
    <div class="mt-6 text-center pb-10">
      <p class="mb-2 text-muted-foreground">Хотите присоединиться к новому событию?</p>
      <Button @click="isJoinDialogOpen = true">
        Присоединиться по коду
      </Button>
    </div>
  </div>

  <!-- Scenario 2: User has no campaigns (Onboarding) -->
  <div v-else>
    <Card class="text-center">
      <CardHeader>
        <CardTitle class="text-2xl">Начните свое приключение!</CardTitle>
        <CardDescription class="mt-2">
          У вас пока нет активных событий. Присоединяйтесь к первому, чтобы начать!
        </CardDescription>
      </CardHeader>
      <CardContent class="pt-0">
        <Button size="lg" @click="isJoinDialogOpen = true">
          Присоединиться к событию
        </Button>
      </CardContent>
    </Card>
  </div>

  <JoinCampaignDialog
    v-model:open="isJoinDialogOpen"
    @campaign-joined="handleCampaignJoined"
  />
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
