<template>
  <div class="p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading">
      <p>Загрузка миссии...</p>
      <!-- TODO: Add skeleton loaders for better UX -->
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки данных миссии: {{ error.message }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="mission">
      <div class="flex w-full gap-2 mb-6">
        <router-link :to="`/campaign/${campaignId}`" class="h-full items-center">
            <Button variant="outline" size="lg" class="w-full">
                <ArrowLeft class="mr-2 h-5 w-5" />
                Назад
            </Button>
        </router-link>
        <Card class="w-full">
          <CardHeader>
            <CardTitle class="text-2xl">{{ mission.title }}</CardTitle>
            <CardDescription v-if="mission.description">{{ mission.description }}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <!-- Mission Type Dispatcher -->
      <UrlSubmissionForm v-if="mission.type === 'MANUAL_URL'" :mission="mission" :campaign-id="campaignId" />
      <div v-else>
        <p>Этот тип миссии ({{ mission.type }}) пока не поддерживается.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMissionById } from './services/mission.service';
import UrlSubmissionForm from './components/UrlSubmissionForm.vue';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-vue-next';

const route = useRoute();
const missionId = route.params.missionId;
const campaignId = route.params.campaignId;

const mission = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    mission.value = await getMissionById(campaignId, missionId);
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch mission data:', err);
  } finally {
    loading.value = false;
  }
});
</script>
