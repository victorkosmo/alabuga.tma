<template>
  <Card>
    <CardHeader>
      <CardTitle>Submit URL</CardTitle>
      <CardDescription>Please provide the URL for your submission. It will be reviewed by an administrator.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <Label for="submissionUrl">Submission URL</Label>
          <Input
            id="submissionUrl"
            v-model="submissionUrl"
            type="url"
            placeholder="https://github.com/your-profile"
            required
            :disabled="isSubmitting"
          />
        </div>
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit for Review' }}
        </Button>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { submitUrlCompletion } from '../services/mission.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { successMessage } from '@/utils/toast';

const props = defineProps({
  mission: {
    type: Object,
    required: true,
  },
  campaignId: {
    type: String,
    required: true,
  }
});

const router = useRouter();
const submissionUrl = ref('');
const isSubmitting = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;
  try {
    await submitUrlCompletion(props.mission.id, submissionUrl.value);
    successMessage('Submission successful! It is now pending review.');
    // Redirect back to the campaign page
    router.push(`/campaign/${props.campaignId}`);
  } catch (err) {
    error.value = err.message || 'An unknown error occurred.';
    console.error('Failed to submit URL:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
