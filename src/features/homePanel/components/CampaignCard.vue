<template>
  <router-link :to="`/campaign/${campaign.id}`" class="block border rounded-lg overflow-hidden bg-background hover:bg-muted transition-colors group">
    <div class="aspect-video overflow-hidden">
      <img
        v-if="campaign.cover_url"
        :src="campaign.cover_url"
        :alt="campaign.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="w-full h-full bg-secondary flex items-center justify-center">
        <span class="text-muted-foreground">No cover</span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-lg">{{ campaign.title }}</h3>
      <p v-if="campaign.description" class="text-sm text-muted-foreground mt-2">{{ campaign.description }}</p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});
</script>
