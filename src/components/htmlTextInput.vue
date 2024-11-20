<template>
  <div class="inputCss">
    <label v-if="config.label" :class="config.labelStyle || 'text-lg text-blue-500'">{{ config.label }}</label>
    <input
        type="text"
        :name="config.name"
        :value="config.value"
        :size="config.fieldSize || config.inputLength || 25"
        :maxlength="config.inputLength || config.fieldSize || 25"
        :placeholder="config.placeholder || 'Enter'"
        :pattern="config.inputFormat"
        :required="config.required"
        :class="config.tailwindStyle || 'text-lg outline outline-2 outline-blue-500 focus:outline-red-500 hover:outline-red-500 rounded'"
        @input="doNothing"
        @keydown.enter="handleInput"
        @keydown.tab="handleInput"
        ref="inputRef"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import {c} from "../components/constants.js";
export default {
  name: 'htmlTextInput',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const inputRef = ref(null);

    onMounted(() => {
      if (props.config.initialFocus) {
        inputRef.value.focus();
      }
    });

    const doNothing= (event) =>{
      console.log('doNothing-',event);
    }
    const handleInput = (event) => {
//      console.log('handleInput in htmlTextInput-', event);
      debugger;
      if (props.config.required && !event.target.value.trim()) {
        emit('error', `${props.config.name} is required`);
      } else if (props.config.inputFormat && !new RegExp(props.config.inputFormat).test(event.target.value)) {
        emit('error', `Invalid input format for ${props.config.name}`);
      } else {
//        emit('input', { name: props.config.name, value: event.target.value });
        emit('cevt', [c.FIELD_INPUT, props.config.name, event.target.value]);
        emit('cevt', [c.FIELD_CHANGED, props.config.name, event.target.value])
      }
    };

    return {
      inputRef,
      handleInput,
    };
  },
};
</script>

<style scoped>
.inputCss {
  display: grid;
  grid-template-columns: 20% 40%;
}

</style>

