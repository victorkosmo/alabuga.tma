import { ref, computed } from 'vue';

export function useQuiz(mission) {
  const questions = ref(mission.details.questions || []);
  const currentQuestionIndex = ref(0);
  const selectedAnswers = ref({});

  // THIS IS THE FIX: totalQuestions is now a computed property, making it reactive.
  const totalQuestions = computed(() => questions.value.length);

  const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value];
  });

  const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);
  
  // This now correctly uses the reactive totalQuestions
  const isLastQuestion = computed(() => {
    if (totalQuestions.value === 0) return true;
    return currentQuestionIndex.value === totalQuestions.value - 1;
  });

  // This also now correctly uses the reactive totalQuestions
  const allQuestionsAnswered = computed(() => {
    return totalQuestions.value > 0 && totalQuestions.value === Object.keys(selectedAnswers.value).length;
  });

  const progress = computed(() => {
    if (totalQuestions.value === 0) return 0;
    // Use .value because totalQuestions is a computed ref
    return ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100;
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
    totalQuestions, // Return the reactive computed property
    
    // Methods
    nextQuestion,
    prevQuestion,
    selectAnswer,
    getPayload,
  };
}
