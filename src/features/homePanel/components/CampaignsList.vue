<template>
  <Card>
    <CardHeader>
      <CardTitle>Your Campaigns</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="campaigns.length > 0" class="space-y-4">
        <div v-for="campaign in campaigns" :key="campaign.id" class="p-4 border rounded-md bg-background">
          <h3 class="font-semibold">{{ campaign.name }}</h3>
          <p v-if="campaign.description" class="text-sm text-muted-foreground">{{ campaign.description }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({
  campaigns: {
    type: Array,
    required: true,
  },
});
</script>
