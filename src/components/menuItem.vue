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
      if(typeof(props.config.layout_linkTo)=='undefined'){
        emit('input', props.config.actionCode);
      }else{
        emit('input', [props.config.actionCode, props.config.layout_link_to, props.config.isExternal]);
      }
      emit('input', props.config.actionCode);
    };

    return {
      handleClick,
    };
  },
});
</script>
