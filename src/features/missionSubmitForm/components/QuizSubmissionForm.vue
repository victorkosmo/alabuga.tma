<template>
  <Card>
    <CardHeader>
      <CardTitle>Квиз: {{ mission.title }}</CardTitle>
      <CardDescription v-if="mission.details.pass_threshold">
        Для прохождения необходимо правильно ответить как минимум на {{ (mission.details.pass_threshold * 100).toFixed(0) }}% вопросов.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-for="(question, qIndex) in mission.details.questions" :key="qIndex" class="space-y-2">
          <p class="font-semibold">{{ qIndex + 1 }}. {{ question.text }}</p>
          <div class="space-y-2 pl-4">
            <div v-for="(answer, oIndex) in question.answers" :key="oIndex" class="flex items-center gap-2">
              <input
                type="radio"
                :id="`q${qIndex}o${oIndex}`"
                :name="`question-${qIndex}`"
                :value="oIndex"
                @change="() => handleAnswerChange(qIndex, oIndex)"
                :disabled="isSubmitting"
                class="h-4 w-4"
              />
              <Label :for="`q${qIndex}o${oIndex}`">{{ answer.text }}</Label>
            </div>
          </div>
        </div>

        <div v-if="error" class="text-sm text-destructive">{{ error }}</div>
        <div v-if="submissionResult && !submissionResult.passed" class="text-sm text-yellow-600">
          К сожалению, вы не прошли квиз ({{ submissionResult.score.toFixed(0) }}% правильных ответов). Попробуйте еще раз!
        </div>

        <Button type="submit" :disabled="isSubmitting || !allQuestionsAnswered">
          {{ isSubmitting ? 'Отправка...' : 'Отправить ответы' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { submitQuizCompletion } from '../services/mission.service';
import { Button } from '@/components/ui/button';
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
const selectedAnswers = ref({});
const isSubmitting = ref(false);
const error = ref(null);
const submissionResult = ref(null);

const allQuestionsAnswered = computed(() => {
  const questionCount = props.mission.details.questions.length;
  return Object.keys(selectedAnswers.value).length === questionCount;
});

const handleAnswerChange = (questionIndex, answerIndex) => {
  selectedAnswers.value[questionIndex] = answerIndex;
  submissionResult.value = null; // Clear previous result on new answer
  error.value = null;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;
  submissionResult.value = null;

  const answersPayload = Object.entries(selectedAnswers.value).map(([qIndex, aIndex]) => ({
    question_index: parseInt(qIndex, 10),
    answer_index: aIndex,
  }));

  try {
    const result = await submitQuizCompletion(props.mission.id, answersPayload);
    submissionResult.value = result;

    if (result.passed) {
      let message = 'Поздравляем! Вы успешно прошли квиз.';
      if (result.rewards) {
        const rewards = [];
        if (result.rewards.mana > 0) rewards.push(`${result.rewards.mana} MP`);
        if (result.rewards.experience > 0) rewards.push(`${result.rewards.experience} XP`);
        if (rewards.length > 0) {
          message += ` Вы получили: ${rewards.join(', ')}.`;
        }
      }
      successMessage(message);
      router.push(`/campaign/${props.campaignId}`);
    }
  } catch (err) {
    error.value = err.message || 'Произошла неизвестная ошибка при отправке квиза.';
    console.error('Не удалось отправить квиз:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
