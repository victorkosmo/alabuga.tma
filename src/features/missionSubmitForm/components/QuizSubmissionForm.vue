<template>
  <Card>
    <CardHeader>
      <CardTitle>Квиз: {{ mission.title }}</CardTitle>
      <CardDescription v-if="requiredAnswersToPassText">
        {{ requiredAnswersToPassText }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="mb-4">
        <Progress :model-value="progress" class="w-full" />
        <p class="text-sm text-muted-foreground mt-2 text-center">
          Вопрос {{ currentQuestionIndex + 1 }} из {{ totalQuestions }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Question Body -->
        <div :key="currentQuestionIndex" class="space-y-4 min-h-[120px]">
          <p class="font-semibold">{{ currentQuestion.text }}</p>
          <div class="space-y-2 pl-4">
            <div v-for="(answer, oIndex) in currentQuestion.answers" :key="oIndex" class="flex items-center gap-2">
              <input
                type="radio"
                :id="`q${currentQuestionIndex}o${oIndex}`"
                :name="`question-${currentQuestionIndex}`"
                :value="oIndex"
                :checked="selectedAnswers[currentQuestionIndex] === oIndex"
                @change="() => handleAnswerChange(currentQuestionIndex, oIndex)"
                :disabled="isSubmitting"
                class="h-4 w-4"
              />
              <Label :for="`q${currentQuestionIndex}o${oIndex}`">{{ answer.text }}</Label>
            </div>
          </div>
        </div>

        <!-- Errors and Results -->
        <div v-if="error" class="text-sm text-destructive">{{ error }}</div>
        <div v-if="submissionResult && !submissionResult.passed" class="text-sm text-yellow-600">
          К сожалению, вы не прошли квиз ({{ submissionResult.score.toFixed(0) }}% правильных ответов). Попробуйте еще раз!
        </div>

        <!-- Navigation and Submission -->
        <div class="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" @click="prevQuestion" :disabled="isFirstQuestion || isSubmitting">
            Назад
          </Button>

          <Button v-if="!isLastQuestion" type="button" @click="nextQuestion" :disabled="isSubmitting">
            Далее
          </Button>

          <Button v-if="isLastQuestion" type="submit" :disabled="isSubmitting || !allQuestionsAnswered">
            {{ isSubmitting ? 'Отправка...' : 'Отправить ответы' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { submitQuizCompletion } from '../services/mission.service';
import { useQuiz } from '../composables/useQuiz';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
const isSubmitting = ref(false);
const error = ref(null);
const submissionResult = ref(null);

const {
  currentQuestionIndex,
  selectedAnswers,
  currentQuestion,
  isFirstQuestion,
  isLastQuestion,
  allQuestionsAnswered,
  progress,
  totalQuestions,
  nextQuestion,
  prevQuestion,
  selectAnswer,
  getPayload,
} = useQuiz(props.mission);

const requiredAnswersToPassText = computed(() => {
  const threshold = props.mission.details.pass_threshold;
  // Changed condition: Check for null/undefined instead of > 0,
  // as a threshold of 0 is a valid scenario.
  if (threshold != null && totalQuestions.value > 0) {
    const requiredCount = Math.ceil(threshold * totalQuestions.value);
    
    // Helper for Russian pluralization of "вопрос"
    function getQuestionWord(count) {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'вопросов';
      }
      if (lastDigit === 1) {
        return 'вопрос';
      }
      if ([2, 3, 4].includes(lastDigit)) {
        return 'вопроса';
      }
      return 'вопросов';
    }

    return `Для прохождения необходимо правильно ответить как минимум на ${requiredCount} ${getQuestionWord(requiredCount)} из ${totalQuestions.value}.`;
  }
  return '';
});

const handleAnswerChange = (questionIndex, answerIndex) => {
  selectAnswer(questionIndex, answerIndex);
  submissionResult.value = null; // Clear previous result on new answer
  error.value = null;
};

const handleSubmit = async () => {
  if (!allQuestionsAnswered.value) {
    error.value = 'Пожалуйста, ответьте на все вопросы.';
    return;
  }

  isSubmitting.value = true;
  error.value = null;
  submissionResult.value = null;

  const answersPayload = getPayload();

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
