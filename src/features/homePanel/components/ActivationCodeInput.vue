<template>
  <div class="flex justify-center gap-2">
    <Input
      v-for="i in 6"
      :key="i"
      :ref="el => { if (el) inputs[i - 1] = el }"
      v-model="digits[i - 1]"
      type="tel"
      maxlength="1"
      pattern="[0-9]"
      class="w-10 h-12 text-center text-lg font-semibold sm:w-12"
      @input="handleInput(i - 1)"
      @keydown="handleKeyDown(i - 1, $event)"
      @paste.prevent="handlePaste"
      @focus="$event.target.select()"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Input } from '@/components/ui/input';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const digits = ref(Array(6).fill(''));
const inputs = ref([]);

const handleInput = (index) => {
  const value = digits.value[index];
  if (value && value.match(/^[0-9]$/)) {
    if (index < 5) {
      inputs.value[index + 1]?.$el.focus();
    }
    emitCode();
  } else {
    digits.value[index] = '';
  }
};

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.$el.focus();
  }
};

const handlePaste = (event) => {
  const pastedData = event.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
  
  if (pastedData) {
    digits.value.fill('');
    
    pastedData.split('').forEach((char, i) => {
      digits.value[i] = char;
    });
    
    const lastFilledIndex = Math.min(pastedData.length, 6) - 1;
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
    inputs.value[focusIndex]?.$el.focus();
    
    emitCode();
  }
};

const emitCode = () => {
  const code = digits.value.join('');
  emit('update:modelValue', code);
};

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    digits.value = Array(6).fill('');
  } else if (newValue !== digits.value.join('')) {
    const newDigits = newValue.padEnd(6, ' ').split('');
    digits.value = newDigits.map(d => d === ' ' ? '' : d);
  }
});
</script>
