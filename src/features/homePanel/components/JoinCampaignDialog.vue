<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Join a Campaign</DialogTitle>
        <DialogDescription>Enter the 6-digit activation code to join a new campaign.</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleJoinCampaign" class="space-y-4 py-4">
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
        <p v-if="error" class="text-sm text-destructive text-center">{{ error }}</p>
        <DialogFooter>
          <Button type="submit" :disabled="loading" class="w-full">
            <span v-if="loading">Joining...</span>
            <span v-else>Join Campaign</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { joinCampaign } from '../services/campaign.service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { successMessage } from '@/utils/toast';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'campaign-joined']);

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
    emit('update:open', false); // Close dialog on success
  } catch (err) {
    error.value = err.message;
    console.error('Failed to join campaign:', err);
  } finally {
    loading.value = false;
  }
};

// Reset form when dialog opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    activationCode.value = '';
    error.value = null;
    loading.value = false;
  }
});
</script>
