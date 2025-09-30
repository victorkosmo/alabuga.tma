<template>
  <Card>
    <CardHeader>
      <CardTitle>Отправить ссылку</CardTitle>
      <CardDescription>
        {{ mission.details?.submission_prompt || 'Пожалуйста, укажите URL для вашей заявки. Она будет рассмотрена администратором.' }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <Label for="submissionUrl" class="pb-3">Ссылка для отправки</Label>
          <Input
            id="submissionUrl"
            v-model="submissionUrl"
            type="url"
            :placeholder="placeholderText"
            required
            :disabled="isSubmitting"
            class="placeholder:text-xs placeholder:text-muted-foreground"
          />
        </div>
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Отправка...' : 'Отправить на проверку' }}
        </Button>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const placeholderText = computed(() => {
  const providedPlaceholder = props.mission.details?.placeholder_text;
  // If placeholder is provided (not null/undefined)
  if (providedPlaceholder != null) {
    // If it's a non-empty string, add prefix. Otherwise (it's an empty string), return it as is.
    return providedPlaceholder ? `Пример ссылки: ${providedPlaceholder}` : '';
  }
  // If placeholder is not provided at all, use default.
  return 'https://example.com/your-submission';
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;
  try {
    await submitUrlCompletion(props.mission.id, submissionUrl.value);
    successMessage('Заявка успешно отправлена! Она ожидает рассмотрения.');
    // Redirect back to the campaign page
    router.push(`/campaign/${props.campaignId}`);
  } catch (err) {
    error.value = err.message || 'Произошла неизвестная ошибка.';
    console.error('Не удалось отправить URL:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
