<template>
  <Card>
    <CardHeader>
      <CardTitle>Join a Campaign</CardTitle>
      <CardDescription>Enter the 6-digit activation code to join a new campaign.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleJoinCampaign" class="space-y-4">
        <div class="space-y-2">
          <Label for="activation-code">Activation Code</Label>
          <Input
            id="activation-code"
            v-model="activationCode"
            placeholder="e.g., 123456"
            maxlength="6"
            required
            pattern="\d{6}"
            title="Activation code must be 6 digits."
          />
        </div>
        <Button type="submit" :disabled="loading" class="w-full">
          <span v-if="loading">Joining...</span>
          <span v-else>Join Campaign</span>
        </Button>
        <p v-if="error" class="text-sm text-destructive text-center">{{ error }}</p>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { joinCampaign } from '../services/campaign.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { successMessage } from '@/utils/toast';

const emit = defineEmits(['campaign-joined']);

const activationCode = ref('');
const loading = ref(false);
const error = ref(null);

const handleJoinCampaign = async () => {
  loading.value = true;
  error.value = null;

  try {
    const newCampaign = await joinCampaign(activationCode.value);
    successMessage(`Successfully joined campaign: ${newCampaign.name}`);
    emit('campaign-joined');
    activationCode.value = '';
  } catch (err) {
    error.value = err.message;
    console.error('Failed to join campaign:', err);
  } finally {
    loading.value = false;
  }
};
</script>
