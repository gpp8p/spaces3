<template>
  <div
      :class="config.tailwindStyle ? config.tailwindStyle : 'text-sm text-blue-500 hover:text-red-500 cursor-pointer'"
      @click="handleClick"
  >
    {{ config.label || 'Missing' }}
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'menuItem',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit('input', props.config.actionCode);
    };

    return {
      handleClick,
    };
  },
});
</script>
