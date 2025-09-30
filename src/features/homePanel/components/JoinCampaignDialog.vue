<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Присоединиться к событию</DialogTitle>
        <DialogDescription>Введите 6-значный код активации, чтобы присоединиться к новому событию.</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleJoinCampaign" class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="activation-code" class="text-center block">Код активации</Label>
          <ActivationCodeInput id="activation-code" v-model="activationCode" />
        </div>
        <p v-if="error" class="text-sm text-destructive text-center">{{ error }}</p>
        <DialogFooter>
          <Button type="submit" :disabled="loading || activationCode.length !== 6" class="w-full">
            <span v-if="loading">Присоединяемся...</span>
            <span v-else>Присоединиться</span>
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
import ActivationCodeInput from './ActivationCodeInput.vue';

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
    successMessage(`Успешно присоединились к событию: ${newCampaign.title}`);
    emit('campaign-joined');
    emit('update:open', false); // Close dialog on success
  } catch (err) {
    error.value = err.message;
    console.error('Failed to join event:', err);
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
