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
      <div class="flex items-center gap-3 mb-4">
        <router-link :to="`/campaign/${campaignId}`">
          <Button variant="outline" size="icon" class="h-10 w-10 rounded-full">
            <ArrowLeft class="h-5 w-5" />
          </Button>
        </router-link>
        <h1 class="text-2xl font-bold">{{ mission.title }}</h1>
      </div>

      <!-- Mission Type Dispatcher -->
      <UrlSubmissionForm v-if="mission.type === 'MANUAL_URL'" :mission="mission" :campaign-id="campaignId" />
      <QuizSubmissionForm v-else-if="mission.type === 'QUIZ'" :mission="mission" :campaign-id="campaignId" />
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
import QuizSubmissionForm from './components/QuizSubmissionForm.vue';
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
