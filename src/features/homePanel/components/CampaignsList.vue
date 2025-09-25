<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Your Campaigns</CardTitle>
      <Button variant="outline" size="sm" @click="isJoinDialogOpen = true">
        Join Campaign
      </Button>
    </CardHeader>
    <CardContent>
      <div v-if="campaigns.length > 0" class="space-y-4">
        <router-link v-for="campaign in campaigns" :key="campaign.id" :to="`/campaign/${campaign.id}`" class="block p-4 border rounded-md bg-background hover:bg-muted transition-colors">
          <div>
            <h3 class="font-semibold">{{ campaign.name }}</h3>
            <p v-if="campaign.description" class="text-sm text-muted-foreground">{{ campaign.description }}</p>
          </div>
        </router-link>
      </div>
      <div v-else class="text-center text-muted-foreground py-4">
        <p>You haven't joined any campaigns yet.</p>
        <p class="text-sm">Click "Join Campaign" to get started.</p>
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
