<template>
  <div class="inputCss">
    <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
    <input
        type="password"
        :name="config.name"
        :maxlength="inputLength"
        :size="config.fieldSize || inputLength"
        @keydown.enter="handleInput"
        @keydown.tab="handleInput"
        :class="config.tailwindStyle || 'text-lg outline outline-2 outline-blue-500 focus:outline-red-500 hover:outline-red-500 rounded'"
        ref="inputRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {c} from "./constants";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['error', 'cevt']);

const inputRef = ref(null);
const inputLength = ref(props.config.inputLength || props.config.fieldSize || 25);

onMounted(() => {
  if (props.config.initialFocus) {
    inputRef.value.focus();
  }
});

const handleInput = (event) => {
  const inputValue = event.target.value;
  if (inputValue.length > inputLength.value) {
    emit('error', 'Input exceeds the maximum allowed length');
  } else {
//    emit('input', { name: props.config.name, value: inputValue });
    emit('cevt', [c.FIELD_INPUT, props.config.name, event.target.value])
  }
};
</script>
<style scoped>
.inputCss {
  display: grid;
  grid-template-columns: 20% 40%;
}

</style>
