import { ref, computed } from 'vue';

export function useQuiz(mission) {
  const questions = ref(mission.details.questions || []);
  const currentQuestionIndex = ref(0);
  const selectedAnswers = ref({});

  const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value];
  });

  const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);
  const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

  const allQuestionsAnswered = computed(() => {
    return questions.value.length > 0 && questions.value.length === Object.keys(selectedAnswers.value).length;
  });

  const progress = computed(() => {
    const totalQuestions = questions.value.length;
    if (totalQuestions === 0) return 0;
    return ((currentQuestionIndex.value + 1) / totalQuestions) * 100;
  });

  function nextQuestion() {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
    }
  }

  function prevQuestion() {
    if (!isFirstQuestion.value) {
      currentQuestionIndex.value--;
    }
  }

  function selectAnswer(questionIndex, answerIndex) {
    selectedAnswers.value[questionIndex] = answerIndex;
  }

  function getPayload() {
    return Object.entries(selectedAnswers.value).map(([qIndex, aIndex]) => ({
      question_index: parseInt(qIndex, 10),
      answer_index: aIndex,
    }));
  }

  return {
    // State
    currentQuestionIndex,
    selectedAnswers,
    
    // Computed
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    allQuestionsAnswered,
    progress,
    totalQuestions: questions.value.length,

    // Methods
    nextQuestion,
    prevQuestion,
    selectAnswer,
    getPayload,
  };
}
