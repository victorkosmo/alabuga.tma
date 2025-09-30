<template>
  <div class="p-4 md:p-6">
    <div v-if="loading" class="space-y-6">
      <!-- Campaigns Card Skeleton -->
      <Card>
        <CardHeader>
          <Skeleton class="h-7 w-32" />
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton class="h-40 w-full" />
            <Skeleton class="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки данных: {{ error.message }}</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Campaigns Section -->
      <CampaignsList :campaigns="campaigns" @campaign-joined="fetchData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCampaigns } from './services/campaign.service';
import CampaignsList from './components/CampaignsList.vue';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const campaigns = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    campaigns.value = await getCampaigns();
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch campaigns data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
