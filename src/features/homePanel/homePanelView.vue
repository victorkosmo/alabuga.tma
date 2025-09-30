<template>
  <div class="p-4 md:p-6">
    <div v-if="loading" class="space-y-6">
      <!-- User Profile Card Skeleton -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between gap-4">
          <div class="flex flex-row items-center gap-4">
            <Skeleton class="h-16 w-16 rounded-full" />
            <div class="space-y-2">
              <Skeleton class="h-6 w-48" />
              <Skeleton class="h-4 w-32" />
            </div>
          </div>
          <div class="space-y-2 text-right">
            <Skeleton class="h-6 w-20 ml-auto" />
            <Skeleton class="h-4 w-12 ml-auto" />
          </div>
        </CardHeader>
      </Card>

      <!-- Campaigns Card Skeleton -->
      <Card>
        <CardHeader>
          <Skeleton class="h-7 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-10 w-full" />
        </CardContent>
      </Card>
    </div>

    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки данных: {{ error.message }}</p>
    </div>

    <div v-else-if="user" class="space-y-6">
      <!-- User Profile Card -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between gap-4">
          <div class="flex flex-row items-center gap-4">
            <Avatar class="h-16 w-16">
              <AvatarImage :src="user.avatar_url" :alt="user.username" />
              <AvatarFallback>{{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle class="text-2xl">{{ user.first_name }} {{ user.last_name }}</CardTitle>
              <CardDescription>@{{ user.username }}</CardDescription>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center justify-end gap-1 font-semibold text-lg">
              <span class="text-[24px]">{{ user.mana_points }}</span>
              <img src="/mana.svg" alt="Mana" class="h-10 w-10" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <!-- Campaigns Section -->
      <CampaignsList :campaigns="campaigns" @campaign-joined="fetchData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMe } from './services/user.service';
import { getCampaigns } from './services/campaign.service';
import CampaignsList from './components/CampaignsList.vue';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const user = ref(null);
const campaigns = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  // Set loading to true only on initial load, not on subsequent fetches
  if (!user.value) {
    loading.value = true;
  }
  error.value = null;

  try {
    const [userResult, campaignsResult] = await Promise.all([
      getMe(),
      getCampaigns(),
    ]);
    user.value = userResult;
    campaigns.value = campaignsResult;
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch home panel data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
